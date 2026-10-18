"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  ReactFlow,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { CauseNode } from "./CauseNode";
import { Icon } from "@iconify/react";
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
    nodesep: 45,
    ranksep: 95,
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
    ).map((edge) => {
      // Highlight root cause edges with vibrant signal rose styling
      const isRootEdge = edge.source === "commit-c92f8a1" || edge.target === "config-drift";
      return {
        ...edge,
        animated: true,
        style: {
          stroke: isRootEdge ? "#f43f5e" : "#293548",
          strokeWidth: isRootEdge ? 2 : 1.5,
        },
      };
    });

    setNodes(activeNodes);
    setEdges(activeEdges);

    // Smooth entrance prevents layout flash
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
    <div className="w-full h-full relative bg-[#000000] overflow-hidden select-none">
      <div
        className={`w-full h-full transition-opacity duration-300 relative z-10 ${
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
            style: { stroke: "#293548", strokeWidth: 1.5 },
            animated: true,
          }}
        >
          <Controls
            showInteractive={false}
            className="!bg-[#111827] !backdrop-blur-sm !border !border-[#293548] !rounded !text-slate-300 [&>button]:!border-[#293548] [&>button]:!bg-[#111827] [&>button:hover]:!bg-[#161f30] [&>button:hover]:!text-[#38bdf8]"
          />
        </ReactFlow>
      </div>

      {/* Sterile Technical Legend */}
      <div className="absolute top-3 left-4 pointer-events-none flex items-center gap-3.5 font-mono text-[10px] text-slate-300 bg-[#111827]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#293548] z-20">
        <span className="flex items-center gap-1.5 text-slate-100 font-medium">
          <Icon icon="solar:pulse-2-bold-duotone" className="w-3 h-3 text-[#38bdf8]" />
          <span>SIGNALS:</span>
        </span>
        <span className="flex items-center gap-1.5 text-[#f43f5e]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-pulse" />
          Root Cause
        </span>
        <span className="flex items-center gap-1.5 text-[#fbbf24]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
          Degraded
        </span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Affected
        </span>
        <span className="flex items-center gap-1.5 text-[#10b981]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          Healthy Baseline
        </span>
      </div>
    </div>
  );
}
