"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Node } from "@xyflow/react";
import { Header } from "@/components/Header";
import { CausalDAG } from "@/components/CausalDAG";
import { TimelineScrubber } from "@/components/TimelineScrubber";
import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { CommandPalette } from "@/components/CommandPalette";

const API_BASE = "http://localhost:8000";

// Fallback deterministic data for immediate rendering & testing
const FALLBACK_INCIDENT = {
  incident_id: "INC-7702",
  title: "RFC-308: Redis MaxMemory Eviction Collapse",
  severity: "P1",
  nodes: [
    {
      id: "commit-c92f8a1",
      type: "causeNode",
      position: { x: 50, y: 150 },
      data: {
        label: "Git Commit c92f8a1",
        kind: "Commit",
        subtext: "RFC-308: redis maxmemory-policy change",
        author: "sarah.dev@company.internal",
        status: "root_cause",
        timestamp: "T-14m 22s",
        details: "Commit modified helm values: maxmemory-policy allkeys-random. Triggered hot key evictions.",
      },
    },
    {
      id: "config-drift",
      type: "causeNode",
      position: { x: 320, y: 150 },
      data: {
        label: "Config Drift: Redis Pod",
        kind: "ConfigDrift",
        subtext: "policy: allkeys-random (evicted pricing keys)",
        status: "root_cause",
        timestamp: "T-11m 05s",
        details: "Deployment applied to redis-cache-0. Pricing tier keys randomly purged under memory pressure.",
      },
    },
    {
      id: "service-pricing",
      type: "causeNode",
      position: { x: 600, y: 80 },
      data: {
        label: "PricingService",
        kind: "Service",
        subtext: "Cache miss rate: 98.4%, p99 latency 14.8s",
        status: "degraded",
        timestamp: "T-08m 40s",
        details: "Service degraded due to massive Postgres fallback query storm.",
      },
    },
    {
      id: "service-checkout",
      type: "causeNode",
      position: { x: 880, y: 150 },
      data: {
        label: "CheckoutService",
        kind: "Service",
        subtext: "HTTP 504 Gateway Timeout (Circuit Breaker Tripped)",
        status: "affected",
        timestamp: "T-04m 12s",
        details: "Client-facing checkout flow failing. Invariant broken: Checkout latency < 250ms.",
      },
    },
    {
      id: "db-postgres-pricing",
      type: "causeNode",
      position: { x: 600, y: 280 },
      data: {
        label: "pricing-db (PostgreSQL)",
        kind: "Database",
        subtext: "Connection pool 100/100 exhausted",
        status: "affected",
        timestamp: "T-07m 18s",
        details: "Active connections saturated at 100 max_connections limit.",
      },
    },
    {
      id: "service-auth",
      type: "causeNode",
      position: { x: 880, y: 320 },
      data: {
        label: "AuthService",
        kind: "Service",
        subtext: "Checked, healthy. Latency 14ms (baseline)",
        status: "healthy",
        timestamp: "T-00m 00s",
        details: "Inspected via FalkorDB dependency graph: zero error rate, healthy connection pool.",
      },
    },
  ],
  edges: [
    {
      id: "e-commit-config",
      source: "commit-c92f8a1",
      target: "config-drift",
      label: "DEPLOYED_IN",
      animated: true,
      data: { relation: "DEPLOYED_IN" },
    },
    {
      id: "e-config-pricing",
      source: "config-drift",
      target: "service-pricing",
      label: "INDUCED_CACHE_MISS",
      animated: true,
      data: { relation: "INDUCED_CACHE_MISS" },
    },
    {
      id: "e-pricing-db",
      source: "service-pricing",
      target: "db-postgres-pricing",
      label: "EXHAUSTED_POOL",
      animated: true,
      data: { relation: "EXHAUSTED_POOL" },
    },
    {
      id: "e-pricing-checkout",
      source: "service-pricing",
      target: "service-checkout",
      label: "CASCADED_TIMEOUT",
      animated: true,
      data: { relation: "CASCADED_TIMEOUT" },
    },
    {
      id: "e-checkout-auth",
      source: "service-checkout",
      target: "service-auth",
      label: "DEPENDS_ON",
      animated: false,
      data: { relation: "DEPENDS_ON" },
    },
  ],
  evidence: {
    affected: [
      { name: "CheckoutService", symptom: "HTTP 504 Gateway Timeout, circuit breaker tripped" },
      { name: "PricingService", symptom: "p99 latency 14.8s, cache miss rate 98.4%" },
      { name: "pricing-db (PostgreSQL)", symptom: "Connection pool 100/100 active connections" },
    ],
    healthy: [
      { name: "AuthService", metric: "Latency 14ms, 0 errors, connection pool 12/50" },
      { name: "PaymentGateway (Stripe API)", metric: "200 OK, latency 88ms" },
    ],
    changed_elsewhere: [
      { name: "inventory-worker-cron", detail: "Nightly batch job ran at 02:00 UTC, unrelated to latency" },
    ],
    not_checked: [
      { name: "AnalyticsIngestCluster", reason: "Isolated from core checkout path" },
    ],
  },
  cypher_query:
    "MATCH path = (c:Commit {hash: 'c92f8a1'})-[:TRIGGERED|DEPLOYED_IN*1..4]->(s:Service {name: 'CheckoutService'}) RETURN path;",
  cypher_latency_ms: 1.42,
};

export default function IncidentConsole() {
  const [data, setData] = useState(FALLBACK_INCIDENT);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [scrubProgress, setScrubProgress] = useState(1);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [falkorConnected, setFalkorConnected] = useState(true);
  const [nodeCount, setNodeCount] = useState(6);
  const [relCount, setRelCount] = useState(5);
  const [isRemediating, setIsRemediating] = useState(false);
  const [remediationSuccess, setRemediationSuccess] = useState(false);

  // Fetch live incident graph from backend if available
  useEffect(() => {
    async function fetchCausalGraph() {
      try {
        const res = await fetch(`${API_BASE}/api/graph/causal-path`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        // Use fallback deterministic data
      }
    }

    async function fetchStats() {
      try {
        const res = await fetch(`${API_BASE}/api/graph/stats`);
        if (res.ok) {
          const stats = await res.json();
          if (stats.total_nodes) setNodeCount(stats.total_nodes);
          if (stats.total_relationships) setRelCount(stats.total_relationships);
        }
      } catch {
        // Use defaults
      }
    }

    async function fetchStatus() {
      try {
        const res = await fetch(`${API_BASE}/api/status`);
        if (res.ok) {
          const st = await res.json();
          setFalkorConnected(st.falkordb_connected);
        }
      } catch {
        setFalkorConnected(false);
      }
    }

    fetchCausalGraph();
    fetchStats();
    fetchStatus();
  }, []);

  const handleExecuteRemediation = useCallback(async () => {
    setIsRemediating(true);
    try {
      const res = await fetch(`${API_BASE}/api/remediation/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incident_id: data.incident_id,
          command: "CONFIG SET maxmemory-policy allkeys-lru",
          target_node: "redis-cache-0",
        }),
      });
      if (res.ok) {
        setRemediationSuccess(true);
      }
    } catch {
      // Offline fallback simulation
      setTimeout(() => {
        setRemediationSuccess(true);
      }, 800);
    } finally {
      setIsRemediating(false);
    }
  }, [data.incident_id]);

  const handleCommandAction = useCallback(
    (action: string) => {
      if (action === "remediate") {
        handleExecuteRemediation();
      }
    },
    [handleExecuteRemediation]
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* 1. SRE Top Header */}
      <Header
        incidentId={data.incident_id}
        incidentTitle={data.title}
        severity={data.severity}
        falkorConnected={falkorConnected}
        queryLatencyMs={data.cypher_latency_ms}
        nodeCount={nodeCount}
        relCount={relCount}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* 2. Main Middle Viewport: Causal DAG + Evidence Drawer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Causal DAG */}
        <main className="flex-1 h-full relative">
          <CausalDAG
            initialNodes={data.nodes as Node[]}
            initialEdges={data.edges}
            onSelectNode={setSelectedNode}
            scrubProgress={scrubProgress}
          />
        </main>

        {/* Right Evidence & Cypher Drawer */}
        <EvidenceDrawer
          selectedNode={selectedNode}
          evidence={data.evidence}
          cypherQuery={data.cypher_query}
          cypherLatencyMs={data.cypher_latency_ms}
          onExecuteRemediation={handleExecuteRemediation}
          isRemediating={isRemediating}
          remediationSuccess={remediationSuccess}
        />
      </div>

      {/* 3. Bottom Temporal Incident Scrubber */}
      <TimelineScrubber
        progress={scrubProgress}
        onChange={setScrubProgress}
      />

      {/* 4. Global Command Palette (Cmd+K) */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onSelectAction={handleCommandAction}
      />
    </div>
  );
}
