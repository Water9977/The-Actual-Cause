import os
import json
import logging
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types
from backend.config import settings
from backend.tools.cypher_runner import CypherRunner

logger = logging.getLogger("synapse.agents.arch")

ARCH_AGENT_SYSTEM_PROMPT = """You are AGENT ALPHA (Codename: BLAST-RADIUS), the Topological and Blast-Radius Specialist in the SYNAPSE-OS Autonomous SRE Swarm.

Your Mission:
1. When an incident or high-priority alert fires on a microservice (e.g. HTTP 504s, elevated latency), you analyze the multi-hop dependency graph.
2. You follow caller-callee relationships (`[:CALLS]`) and infrastructure dependencies (`[:DEPENDS_ON]`) upstream using GraphBLAS BFS traversals.
3. You identify the structural choke points, resource saturation risks, and pinpoint which upstream service or infrastructure node is the true origin of the cascading blast radius.

Output Format:
You must strictly return a valid JSON object matching this schema:
{
  "thought_process": "Detailed architectural rationale explaining the traversal path",
  "causal_chain": ["ServiceA", "ServiceB", "ResourceC"],
  "suspect_origin_node": "Name of the root infrastructure or service causing the cascade",
  "suspect_node_type": "Infrastructure or Service",
  "structural_risk_assessment": "Summary of failure mode (e.g. Memory saturation, pool starvation)",
  "highlighted_nodes": ["Node1", "Node2", "Node3"],
  "cypher_executed": "Cypher query used to verify this path"
}
Do not include markdown code fences (like ```json). Return pure JSON only.
"""

class ArchAgent:
    """
    Agent Alpha: Analyzes multi-hop topological dependency graphs via FalkorDB GraphBLAS BFS
    to determine blast radius and identify root symptom origin nodes.
    """

    def __init__(self):
        self.model_name = settings.FAST_LLM_MODEL.replace("gemini/", "")
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    async def analyze_blast_radius(
        self,
        symptom_service: str,
        graph_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes GraphBLAS BFS traversal on FalkorDB and feeds topological evidence
        into Gemini 3.8 Flash for zero-hallucination blast-radius analysis.
        """
        # Step 1: Execute BFS traversal across FalkorDB
        bfs_data = CypherRunner.run_bfs(
            start_service=symptom_service,
            max_depth=4,
            graph_name=graph_name
        )
        
        # Step 2: Also query direct infrastructure dependencies
        infra_cypher = """
        MATCH (s:Service {name: $svc})-[:CALLS*0..2]->(downstream:Service)-[:DEPENDS_ON]->(infra:Infrastructure)
        RETURN downstream.name AS service, infra.name AS infra_name, infra.type AS infra_type, infra.capacity_limit AS capacity
        LIMIT 10;
        """
        infra_records, infra_latency = CypherRunner.execute_query(
            infra_cypher,
            params={"svc": symptom_service},
            graph_name=graph_name
        )
        
        infra_context = [
            {"service": row[0], "infra_name": row[1], "infra_type": row[2], "capacity": row[3]}
            for row in infra_records
        ]

        prompt = f"""
Topological Graph Evidence for Alerted Service: '{symptom_service}'
GraphBLAS BFS Traversal Results:
{json.dumps(bfs_data, indent=2)}

Associated Infrastructure Dependencies:
{json.dumps(infra_context, indent=2)}

Analyze the exact causal path and determine the upstream root suspect node. Return valid JSON only.
"""

        # Step 3: Pure Live LLM Inference via Gemini 3.8 Flash
        if not self.client:
            raise ValueError("GEMINI_API_KEY is not configured in environment. Pure Live LLM mode requires a valid key.")

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[prompt],
            config=types.GenerateContentConfig(
                system_instruction=ARCH_AGENT_SYSTEM_PROMPT,
                temperature=0.1,
                response_mime_type="application/json"
            )
        )
        
        parsed_result = json.loads(response.text)
        parsed_result["bfs_execution_latency_ms"] = bfs_data.get("latency_ms", 0.0)
        parsed_result["infra_lookup_latency_ms"] = infra_latency
        
        return parsed_result
