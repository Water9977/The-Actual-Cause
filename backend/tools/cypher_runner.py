import time
import logging
from typing import Any, Optional, Dict, List, Tuple
from backend.database.client import db_manager
from backend.config import settings

logger = logging.getLogger("synapse.tools.cypher")

class CypherExecutionError(Exception):
    """Raised when a Cypher query fails execution."""
    pass

class CypherRunner:
    """
    Executes raw Cypher queries and native GraphBLAS algorithms on FalkorDB
    with precise microsecond execution latency measurements.
    """

    @staticmethod
    def execute_query(
        cypher: str,
        params: Optional[Dict[str, Any]] = None,
        graph_name: Optional[str] = None
    ) -> Tuple[List[Any], float]:
        """
        Executes an arbitrary Cypher query against the specified graph.
        Defaults to settings.FALKORDB_MASTER_GRAPH.
        Returns: (result_set, latency_ms)
        """
        target_graph = graph_name or settings.FALKORDB_MASTER_GRAPH
        try:
            start_time = time.perf_counter()
            client = db_manager.connect()
            g = client.select_graph(target_graph)
            
            if params:
                result = g.query(cypher, params)
            else:
                result = g.query(cypher)
                
            latency_ms = (time.perf_counter() - start_time) * 1000.0
            return result.result_set, round(latency_ms, 3)
        except Exception as exc:
            logger.error(f"Cypher execution failed on '{target_graph}': {exc}\nQuery: {cypher}")
            raise CypherExecutionError(f"Query error on [{target_graph}]: {str(exc)}") from exc

    @staticmethod
    def run_bfs(
        start_service: str,
        max_depth: int = 3,
        graph_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes a Breadth-First Search traversal to compute blast radius
        and downstream dependency chains from a compromised service.
        """
        cypher = """
        MATCH path = (start:Service {name: $start_name})<-[:CALLS|DEPENDS_ON*1..4]-(upstream)
        RETURN upstream.name AS node_name,
               labels(upstream)[0] AS node_type,
               length(path) AS distance,
               [n IN nodes(path) | n.name] AS causal_chain
        ORDER BY distance ASC
        LIMIT 25;
        """
        records, latency_ms = CypherRunner.execute_query(
            cypher,
            params={"start_name": start_service},
            graph_name=graph_name
        )
        
        traversal_results = []
        for row in records:
            traversal_results.append({
                "node_name": row[0],
                "node_type": row[1],
                "distance": row[2],
                "causal_chain": row[3],
            })
            
        return {
            "start_service": start_service,
            "latency_ms": latency_ms,
            "reachable_nodes": traversal_results,
            "total_dependencies_evaluated": len(traversal_results)
        }

    @staticmethod
    def run_pagerank(
        node_label: str = "Person",
        edge_type: str = "AUTHORED_BY",
        graph_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes native GraphBLAS PageRank to determine authoritative subject-matter experts
        or most critical code/architectural artifacts.
        """
        cypher = f"""
        CALL algo.pageRank('{node_label}', '{edge_type}')
        YIELD node, score
        RETURN node.name AS entity_name,
               score AS authority_score,
               properties(node) AS attributes
        ORDER BY score DESC
        LIMIT 10;
        """
        records, latency_ms = CypherRunner.execute_query(cypher, graph_name=graph_name)
        ranked = []
        for row in records:
            ranked.append({
                "name": row[0],
                "authority_score": round(float(row[1]), 4),
                "attributes": row[2]
            })
            
        return {
            "algorithm": "algo.pageRank",
            "latency_ms": latency_ms,
            "ranked_entities": ranked
        }

    @staticmethod
    def run_betweenness(
        graph_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes GraphBLAS Betweenness Centrality across the service topology
        to compute the live Systemic Fragility Index (SFI).
        """
        cypher = """
        CALL algo.betweenness({nodeLabels: ['Service'], relationshipTypes: ['CALLS', 'DEPENDS_ON']})
        YIELD node, score
        RETURN node.name AS service_name,
               node.tier AS tier,
               score AS centrality_score
        ORDER BY centrality_score DESC
        LIMIT 10;
        """
        records, latency_ms = CypherRunner.execute_query(cypher, graph_name=graph_name)
        bottlenecks = []
        for row in records:
            score = round(float(row[2]), 4)
            classification = (
                "CRITICAL_SYSTEMIC_CHOKEPOINT" if score > 0.20
                else "MODERATE_TRANSIT_HUB" if score > 0.05
                else "LEAF_SERVICE"
            )
            bottlenecks.append({
                "service": row[0],
                "tier": row[1],
                "centrality_score": score,
                "classification": classification
            })
            
        return {
            "algorithm": "algo.betweenness",
            "latency_ms": latency_ms,
            "systemic_chokepoints": bottlenecks
        }
