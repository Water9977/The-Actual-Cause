import os
import json
import logging
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types
from backend.config import settings
from backend.tools.cypher_runner import CypherRunner

logger = logging.getLogger("synapse.agents.incident")

INCIDENT_AGENT_SYSTEM_PROMPT = """You are AGENT GAMMA (Codename: REMEDIATION-SYNTHESIZER), the Remediation, Playbook & Episodic Memory Specialist in the SYNAPSE-OS Autonomous SRE Swarm.

Your Mission:
1. You take the upstream blast radius from Agent Alpha and the code/RFC root-cause attribution from Agent Beta.
2. You search FalkorDB for relevant historical playbooks and verified post-mortems.
3. You formulate a safe, concrete, 1-click executable remediation command (e.g. CLI hot-patch, config rollback, or traffic shift).
4. You construct the Cypher transaction to crystallize this verified root-cause memory into the Master Enterprise Knowledge Graph, ensuring the organization never repeats this exact outage.

Output Format:
You must strictly return a valid JSON object matching this schema:
{
  "thought_process": "Strategic remediation rationale balancing uptime, data integrity, and blast radius",
  "matched_playbook": {
    "playbook_id": "PB-REDIS-EVICTION",
    "title": "Redis Dynamic Eviction Recovery",
    "historical_success_rate": 0.98
  },
  "remediation_action": {
    "execution_type": "CLI_COMMAND",
    "command": "redis-cli -h pricing-redis.internal CONFIG SET maxmemory-policy allkeys-lru",
    "rollback_command": "redis-cli -h pricing-redis.internal CONFIG SET maxmemory-policy noeviction",
    "safety_risk_level": "LOW",
    "estimated_recovery_seconds": 5
  },
  "crystallization_cypher": "CREATE (:IncidentMemory {id: 'INC-7702', root_cause: 'RFC-308 maxmemory-policy exhaustion', verified_by: 'Swarm'})...",
  "postmortem_summary": "Concise executive briefing on what failed, why it cascaded, and how it was neutralized",
  "highlighted_nodes": ["PB-REDIS-EVICTION", "IncidentMemory"]
}
Do not include markdown code fences (like ```json). Return pure JSON only.
"""

class IncidentAgent:
    """
    Agent Gamma: Formulates executable remediation actions from historical playbooks
    and crystallizes verified postmortems into FalkorDB episodic memory.
    """

    def __init__(self):
        self.model_name = settings.FAST_LLM_MODEL.replace("gemini/", "")
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    async def synthesize_remediation(
        self,
        incident_id: str,
        alpha_findings: Dict[str, Any],
        beta_findings: Dict[str, Any],
        graph_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Retrieves matching playbooks from FalkorDB, synthesizes safe remediation via Gemini 3.8 Flash,
        and produces the postmortem crystallization graph update.
        """
        # Step 1: Query matching playbooks
        suspect_origin = alpha_findings.get("suspect_origin_node", "")
        playbook_cypher = """
        MATCH (pb:Playbook)
        WHERE pb.target_service CONTAINS $target OR pb.title CONTAINS 'Redis' OR pb.title CONTAINS 'Recovery'
        RETURN pb.id AS pb_id,
               pb.title AS title,
               pb.automated_remediation_script AS script,
               pb.target_service AS target
        LIMIT 5;
        """
        records, pb_latency = CypherRunner.execute_query(
            playbook_cypher,
            params={"target": suspect_origin},
            graph_name=graph_name
        )

        playbooks = []
        for r in records:
            playbooks.append({
                "playbook_id": r[0],
                "title": r[1],
                "script": r[2],
                "target_service": r[3]
            })

        prompt = f"""
Active Incident ID: '{incident_id}'
Agent Alpha Findings (Blast Radius & Topology):
{json.dumps(alpha_findings, indent=2)}

Agent Beta Findings (Code & Decision Provenance):
{json.dumps(beta_findings, indent=2)}

Available Historical Playbooks in FalkorDB:
{json.dumps(playbooks, indent=2)}

Synthesize a safe 1-click remediation command and the graph crystallization statement. Return valid JSON only.
"""

        if not self.client:
            raise ValueError("GEMINI_API_KEY is not configured in environment. Pure Live LLM mode requires a valid key.")

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[prompt],
            config=types.GenerateContentConfig(
                system_instruction=INCIDENT_AGENT_SYSTEM_PROMPT,
                temperature=0.1,
                response_mime_type="application/json"
            )
        )

        parsed_result = json.loads(response.text)
        parsed_result["playbook_lookup_latency_ms"] = pb_latency

        return parsed_result
