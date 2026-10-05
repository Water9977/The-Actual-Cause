import time
import json
import logging
from typing import Dict, Any, Optional, Callable, Awaitable
from backend.agents.arch_agent import ArchAgent
from backend.agents.code_agent import CodeAgent
from backend.agents.incident_agent import IncidentAgent
from backend.database.client import db_manager

logger = logging.getLogger("synapse.agents.swarm")

TelemetryCallback = Optional[Callable[[Dict[str, Any]], Awaitable[None]]]

class SwarmRouter:
    """
    Orchestrates the Tri-Agent Swarm (Alpha -> Beta -> Gamma) across FalkorDB,
    emitting granular, real-time WebSocket telemetry for HUD visual rendering.
    """

    def __init__(self):
        self.arch_agent = ArchAgent()
        self.code_agent = CodeAgent()
        self.incident_agent = IncidentAgent()

    async def run_triage(
        self,
        symptom_service: str,
        incident_id: str = "INC-7702",
        broadcast: TelemetryCallback = None
    ) -> Dict[str, Any]:
        """
        Executes the 30-Second Autonomous Triage Pipeline:
        1. Alpha: Blast Radius & Dependency Traversal
        2. Beta: Git Commit, PR Diff & PageRank SME Discovery
        3. Gamma: Remediation Playbook Matching & Postmortem Crystallization
        """
        start_overall = time.perf_counter()
        
        async def emit(event_type: str, data: Dict[str, Any]):
            payload = {
                "event": event_type,
                "incident_id": incident_id,
                "timestamp_ms": int(time.time() * 1000),
                "data": data
            }
            if broadcast:
                try:
                    await broadcast(payload)
                except Exception as e:
                    logger.warning(f"Telemetry broadcast failed: {e}")

        # Broadcast Swarm Launch
        await emit("swarm:started", {
            "symptom_service": symptom_service,
            "status": "TRIAGING",
            "message": f"Autonomous Swarm mobilized for P0 Alert on [{symptom_service}]"
        })

        # =====================================================================
        # STEP 1: AGENT ALPHA (Blast Radius & Topology)
        # =====================================================================
        await emit("agent:started", {
            "agent": "ALPHA",
            "codename": "BLAST-RADIUS",
            "role": "Topological & Dependency Specialist",
            "phase": "Executing GraphBLAS BFS traversal across FalkorDB..."
        })
        
        alpha_start = time.perf_counter()
        alpha_result = await self.arch_agent.analyze_blast_radius(symptom_service)
        alpha_duration = (time.perf_counter() - alpha_start) * 1000.0

        await emit("agent:completed", {
            "agent": "ALPHA",
            "duration_ms": round(alpha_duration, 2),
            "findings": alpha_result,
            "highlighted_nodes": alpha_result.get("highlighted_nodes", []),
            "message": f"Isolated root suspect node: [{alpha_result.get('suspect_origin_node')}]"
        })

        # =====================================================================
        # STEP 2: AGENT BETA (Code, PR & PageRank SME Archaeology)
        # =====================================================================
        suspect_node = alpha_result.get("suspect_origin_node", symptom_service)
        await emit("agent:started", {
            "agent": "BETA",
            "codename": "CODE-ARCHAEOLOGIST",
            "role": "Git Provenance & Decision Specialist",
            "phase": f"Excavating recent PRs and PageRank SME for [{suspect_node}]..."
        })

        beta_start = time.perf_counter()
        beta_result = await self.code_agent.investigate_code_provenance(suspect_node)
        beta_duration = (time.perf_counter() - beta_start) * 1000.0

        await emit("agent:completed", {
            "agent": "BETA",
            "duration_ms": round(beta_duration, 2),
            "findings": beta_result,
            "highlighted_nodes": beta_result.get("highlighted_nodes", []),
            "message": f"PR #{beta_result.get('root_cause_pr', {}).get('pr_number')} identified. SME: {beta_result.get('subject_matter_expert', {}).get('name')}"
        })

        # =====================================================================
        # STEP 3: AGENT GAMMA (Remediation & Episodic Memory)
        # =====================================================================
        await emit("agent:started", {
            "agent": "GAMMA",
            "codename": "REMEDIATION-SYNTHESIZER",
            "role": "Remediation & Memory Specialist",
            "phase": "Matching executable playbooks and synthesizing 1-click hotpatch..."
        })

        gamma_start = time.perf_counter()
        gamma_result = await self.incident_agent.synthesize_remediation(
            incident_id=incident_id,
            alpha_findings=alpha_result,
            beta_findings=beta_result
        )
        gamma_duration = (time.perf_counter() - gamma_start) * 1000.0

        await emit("agent:completed", {
            "agent": "GAMMA",
            "duration_ms": round(gamma_duration, 2),
            "findings": gamma_result,
            "highlighted_nodes": gamma_result.get("highlighted_nodes", []),
            "message": "Remediation plan ready for 1-click execution"
        })

        # =====================================================================
        # SWARM SUMMARY & CONCLUSION
        # =====================================================================
        total_seconds = round(time.perf_counter() - start_overall, 2)
        summary_payload = {
            "incident_id": incident_id,
            "symptom_service": symptom_service,
            "total_duration_seconds": total_seconds,
            "alpha": alpha_result,
            "beta": beta_result,
            "gamma": gamma_result,
            "remediation_ready": True
        }

        await emit("swarm:completed", {
            "total_duration_seconds": total_seconds,
            "summary": summary_payload,
            "message": f"Autonomous triage completed in {total_seconds}s. MTTI slashed from 45m to {total_seconds}s."
        })

        return summary_payload

swarm_router = SwarmRouter()
