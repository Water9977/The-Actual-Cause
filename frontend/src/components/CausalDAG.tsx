"use client";

import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { CauseNode, CauseNodeData } from "./CauseNode";
import "@xyflow/react/dist/style.css";

interface CausalDAGProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onSelectNode: (node: Node | null) => void;
  scrubProgress?: number; // 0 to 1
}

const nodeTypes = {
  causeNode: CauseNode,
};

// Compute Dagre orthogonal left-to-right layout
function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "LR", // Left to Right causal flow
    nodesep: 40,
    ranksep: 90,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 300, height: 110 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 150,
        y: nodeWithPosition.y - 55,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

export function CausalDAG({
  initialNodes,
  initialEdges,
  onSelectNode,
  scrubProgress = 1,
}: CausalDAGProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [layoutReady, setLayoutReady] = useState(false);

  // Compute Dagre positions on mount or input change
  useEffect(() => {
    if (initialNodes.length === 0) return;

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );

    // Apply temporal scrubber: Reveal nodes in sequence
    const visibleCount = Math.max(1, Math.ceil(layoutedNodes.length * scrubProgress));
    const activeNodes = layoutedNodes.slice(0, visibleCount);
    const activeNodeIds = new Set(activeNodes.map((n) => n.id));
    const activeEdges = layoutedEdges.filter(
      (e) => activeNodeIds.has(e.source) && activeNodeIds.has(e.target)
    );

    setNodes(activeNodes);
    setEdges(activeEdges);

    // Smooth 3-phase initial entrance
    const timer = setTimeout(() => {
      setLayoutReady(true);
    }, 120);

    return () => clearTimeout(timer);
  }, [initialNodes, initialEdges, scrubProgress, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onSelectNode(node);
    },
    [onSelectNode]
  );

  const onPaneClick = useCallback(() => {
    onSelectNode(null);
  }, [onSelectNode]);

  return (
    <div className="w-full h-full relative bg-zinc-950 overflow-hidden select-none">
      <div
        className={`w-full h-full transition-opacity duration-300 ${
          layoutReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.4}
          maxZoom={1.6}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: "smoothstep",
            style: { stroke: "#52525b", strokeWidth: 1.5 },
            animated: true,
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="#27272a"
          />
          <Controls
            showInteractive={false}
            className="!bg-zinc-900 !border-zinc-800 !rounded !text-zinc-400 [&>button]:!border-zinc-800 [&>button]:!bg-zinc-900 [&>button:hover]:!bg-zinc-800 [&>button]:!text-zinc-400"
          />
        </ReactFlow>
      </div>

      {/* Watermark / Legend */}
      <div className="absolute top-3 left-4 pointer-events-none flex items-center gap-3 font-mono text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Root Cause
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Degraded Service
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-600" />
          Affected Downstream
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Healthy Baseline
        </span>
      </div>
    </div>
  );
}
