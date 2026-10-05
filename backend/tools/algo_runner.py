"""
algo_runner.py: High-level wrapper for FalkorDB native GraphBLAS algorithms
(algo.BFS, algo.pageRank, algo.betweenness).
"""
from typing import Dict, Any, Optional
from backend.tools.cypher_runner import CypherRunner

def run_bfs_blast_radius(start_service: str, max_depth: int = 4, graph_name: Optional[str] = None) -> Dict[str, Any]:
    """Execute GraphBLAS BFS to compute multi-hop blast radius."""
    return CypherRunner.run_bfs(start_service=start_service, max_depth=max_depth, graph_name=graph_name)

def run_authorship_pagerank(graph_name: Optional[str] = None) -> Dict[str, Any]:
    """Execute GraphBLAS PageRank over Person -> AUTHORED_BY -> PR to discover key SMEs."""
    return CypherRunner.run_pagerank(node_label="Person", edge_type="AUTHORED_BY", graph_name=graph_name)

def run_fragility_betweenness(graph_name: Optional[str] = None) -> Dict[str, Any]:
    """Execute GraphBLAS Betweenness Centrality to compute the Systemic Fragility Index."""
    return CypherRunner.run_betweenness(graph_name=graph_name)
