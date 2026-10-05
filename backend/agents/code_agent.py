import os
import json
import logging
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types
from backend.config import settings
from backend.tools.cypher_runner import CypherRunner

logger = logging.getLogger("synapse.agents.code")

CODE_AGENT_SYSTEM_PROMPT = """You are AGENT BETA (Codename: CODE-ARCHAEOLOGIST), the Code, PR & Decision Provenance Specialist in the SYNAPSE-OS Autonomous SRE Swarm.

Your Mission:
1. When Agent Alpha isolates a suspect service or infrastructure node (e.g. PricingRedisCluster or PricingService), you excavate the recent commit history, pull requests, AST diffs, and Architectural Decision Records (ADRs/RFCs).
2. You correlate the physical failure mode with specific code or configuration changes deployed within the temporal window.
3. You run FalkorDB PageRank over the Git Authorship Graph to discover the genuine Subject Matter Expert (SME) who authored the code, bypassing stale on-call schedules.

Output Format:
You must strictly return a valid JSON object matching this schema:
{
  "thought_process": "Archaeological analysis connecting commit diffs and RFC decisions to the failure",
  "root_cause_pr": {
    "pr_number": 1482,
    "title": "PR Title",
    "author": "Author Name",
    "merged_at": "Timestamp or relative time",
    "diff_summary": "Summary of critical config change"
  },
  "rfc_decision": {
    "rfc_id": "RFC-308",
    "title": "Decision title",
    "rationale": "Business or architectural justification that created the latent trap"
  },
  "subject_matter_expert": {
    "name": "Engineer Name",
    "slack_handle": "@handle",
    "authority_score": 0.91,
    "pagerank_rank": 1
  },
  "latent_defect_mechanism": "Explanation of how this code change interacted with traffic to trigger the cascade",
  "highlighted_nodes": ["PR1482", "Elena Rostova", "RFC-308"],
  "cypher_executed": "Cypher query used for provenance discovery"
}
Do not include markdown code fences (like ```json). Return pure JSON only.
"""

class CodeAgent:
    """
    Agent Beta: Excavates Git commits, PRs, diffs, and RFC decisions linked to suspect nodes,
    and runs GraphBLAS PageRank to locate authentic Subject Matter Experts.
    """

    def __init__(self):
        self.model_name = settings.FAST_LLM_MODEL.replace("gemini/", "")
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    async def investigate_code_provenance(
        self,
        suspect_node: str,
        graph_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Queries deployment provenance and Git authorship PageRank on FalkorDB,
        then analyzes the findings via Gemini 3.8 Flash.
        """
        # Step 1: Trace Commit -> PR -> Decision provenance
        provenance_cypher = """
        MATCH (target)
        WHERE target.name = $suspect_name
        OPTIONAL MATCH (target)<-[:DEPENDS_ON*0..1]-(s:Service)-[:DEPLOYED_FROM]->(c:Commit)<-[:PART_OF]-(pr:PullRequest)
        OPTIONAL MATCH (pr)-[:AUTHORED_BY]->(author:Person)
        OPTIONAL MATCH (pr)-[:IMPLEMENTS]->(rfc:Decision)
        RETURN c.hash AS commit_hash,
               c.message AS commit_msg,
               pr.number AS pr_num,
               pr.title AS pr_title,
               author.name AS author_name,
               author.slack_handle AS slack_handle,
               rfc.rfc_number AS rfc_num,
               rfc.title AS rfc_title,
               rfc.rationale AS rfc_rationale
        LIMIT 5;
        """
        records, prov_latency = CypherRunner.execute_query(
            provenance_cypher,
            params={"suspect_name": suspect_node},
            graph_name=graph_name
        )

        provenance_data = []
        for r in records:
            provenance_data.append({
                "commit_hash": r[0],
                "commit_message": r[1],
                "pr_number": r[2],
                "pr_title": r[3],
                "author": r[4],
                "slack_handle": r[5],
                "rfc_number": r[6],
                "rfc_title": r[7],
                "rfc_rationale": r[8]
            })

        # Step 2: Run FalkorDB PageRank over Git Authorship
        pagerank_data = CypherRunner.run_pagerank(
            node_label="Person",
            edge_type="AUTHORED_BY",
            graph_name=graph_name
        )

        prompt = f"""
Suspect Subsystem: '{suspect_node}'
Recent Deployment & Code Provenance:
{json.dumps(provenance_data, indent=2)}

FalkorDB PageRank Authorship Authority Ranking:
{json.dumps(pagerank_data, indent=2)}

Connect the recent code changes and RFC decisions to the failure mechanism, and identify the true SME. Return valid JSON only.
"""

        if not self.client:
            raise ValueError("GEMINI_API_KEY is not configured in environment. Pure Live LLM mode requires a valid key.")

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[prompt],
            config=types.GenerateContentConfig(
                system_instruction=CODE_AGENT_SYSTEM_PROMPT,
                temperature=0.1,
                response_mime_type="application/json"
            )
        )

        parsed_result = json.loads(response.text)
        parsed_result["provenance_lookup_latency_ms"] = prov_latency
        parsed_result["pagerank_latency_ms"] = pagerank_data.get("latency_ms", 0.0)

        return parsed_result
