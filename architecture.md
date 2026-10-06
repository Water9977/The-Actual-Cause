# 🧠 SYNAPSE-OS: SYSTEM ARCHITECTURE SPECIFICATION
**Project**: SYNAPSE-OS (Autonomous Incident Triage & SRE Graph Memory)  
**Hackathon Target**: Graph Hacks 2026 by WeMakeDevs & FalkorDB  
**Target Tracks**: 
- **Track 02**: Agent Memory and Coordination (Grand Prize: PS5 with GTA VI)
- **Track 03**: Company Brain (Grand Prize: M6 Mac Mini)  
- **Side Prize**: Best Technical Blog Post (Grand Prize: AirPods 5)  
**Document Status**: Living Architectural Ground Truth  
**Last Updated**: October 6, 2026  

---

## 1. System Overview & The Core Pain Point

**SYNAPSE-OS** is an autonomous incident triage and organizational memory platform engineered for distributed cloud architectures. 

### The Core Problem (Validated via SRE Research)
During high-severity production outages (Sev-0/Sev-1), engineering teams lose critical time in the "first 15 minutes":
- **Alert Tsunami**: Upstream failures cascade into 500+ symptom-level alerts across dependent microservices.
- **Topological Blindness**: Vector search (flat embeddings) fails completely because it cannot traverse directed dependency chains ($O(0)$ hops vs $N$-hop pathfinding).
- **Tribal Knowledge Loss**: Key architectural decisions and postmortem playbooks rot in Notion/Confluence, leading to recurring repeat outages.

### The Synapse-OS Solution
SYNAPSE-OS unifies telemetry, Git history, system architecture, and incident post-mortems into a **FalkorDB Socio-Technical Hypergraph**. A coordinated tri-agent swarm uses **GraphBLAS linear algebra traversals** and **native graph algorithms** to trace cascading failures to their root-cause Git commit in sub-millisecond execution times.

---

## 2. High-Level Subsystems

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 15 FRONTEND                             │
│   [frontend/components/graph/Graph3DCanvas.tsx]                        │
│   • Three.js WebGL canvas with UnrealBloomPass glowing nodes.          │
│   • linkDirectionalParticles streaming energy pulses on active paths. │
│   [frontend/components/hud/TelemetryPanel.tsx & Inspector.tsx]         │
│   • Frosted glass HUD for live agent thoughts, Cypher logs & diffs.   │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ WebSocket (/ws/telemetry) & REST
┌───────────────────────────────────▼────────────────────────────────────┐
│                      FASTAPI PYTHON BACKEND                            │
│   [backend/main.py] Entry point, CORS, WebSockets, REST endpoints.     │
│   [backend/agents/swarm_router.py] Tri-Agent orchestrator.             │
│   [backend/agents/arch_agent.py] Agent Alpha: Blast radius BFS.       │
│   [backend/agents/code_agent.py] Agent Beta: Git & Decision trace.     │
│   [backend/agents/incident_agent.py] Agent Gamma: Playbook recall.     │
│   [backend/tools/cypher_runner.py] High-speed FalkorDB query runner.   │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ RESP Protocol (Port 6379)
┌───────────────────────────────────▼────────────────────────────────────┐
│                       FALKORDB GRAPH ENGINE                            │
│   [backend/database/client.py] Multi-graph connection manager.        │
│   • "enterprise_master": Canonical company knowledge graph.           │
│   • "incident:<id>": Ephemeral writable scratchpad for triage swarm.   │
│   • Native algorithms: algo.BFS, algo.pageRank, algo.betweenness.      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. FalkorDB Socio-Technical Graph Schema

Complete schema reference implemented in [backend/database/schema.py](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/database/schema.py) and populated by [backend/database/seed_data.py](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/database/seed_data.py).

### 3.1 Node Specifications
- `:Service` — Logical microservice/API boundary (`id`, `name`, `tier`, `repo_url`, `language`, `slo_target`, `systemic_fragility_index`).
- `:Infrastructure` — Physical or cloud resource (`id`, `name`, `type` [RDS, Redis, Kafka, Pod], `region`, `capacity_limit`).
- `:Alert` — Telemetry breach from observability (`id`, `name`, `severity` [P0..P4], `metric_name`, `threshold`, `observed_value`, `status`).
- `:Incident` — Declared operational outage (`id`, `title`, `severity`, `status` [TRIAGING, MITIGATED, RESOLVED], `started_at`).
- `:Commit` — Atomic Git commit (`hash`, `message`, `timestamp`, `lines_added`, `lines_deleted`, `changed_files`).
- `:PullRequest` — Merged PR (`number`, `title`, `repo`, `merged_at`, `diff_url`, `ast_change_summary`).
- `:Person` — Engineer or team member (`id`, `email`, `name`, `role`, `pagerduty_id`, `slack_handle`).
- `:Team` — Squad owning services (`id`, `name`, `slack_channel`, `oncall_rotation_id`).
- `:Decision` — Architectural decision or RFC (`id`, `rfc_number`, `title`, `status`, `rationale`).
- `:PostMortem` — Retrospective analysis (`id`, `incident_id`, `timeline_summary`, `lessons_learned`).
- `:Playbook` — Executable mitigation runbook (`id`, `title`, `target_service`, `automated_remediation_script`).

### 3.2 Directed Edge Specifications
- `(:Service)-[:CALLS]->(:Service)` — Synchronous/asynchronous RPC invocation (`protocol`, `timeout_ms`).
- `(:Service)-[:DEPENDS_ON]->(:Infrastructure)` — Cloud resource dependency (`pool_size`, `max_connections`).
- `(:Service)-[:DEPLOYED_FROM]->(:Commit)` — Currently running production version.
- `(:Alert)-[:FIRED_ON]->(:Service|:Infrastructure)` — Entity where anomaly was observed.
- `(:Incident)-[:TRIGGERED_BY]->(:Alert)` — Primary alert triggering the incident.
- `(:Commit)-[:PART_OF]->(:PullRequest)` — Commit to PR relationship.
- `(:PullRequest)-[:AUTHORED_BY]->(:Person)` — Authorship attribution.
- `(:PullRequest)-[:IMPLEMENTS]->(:Decision)` — Traceability back to approved RFC.
- `(:Team)-[:OWNS]->(:Service)` — Service ownership and accountability.
- `(:Person)-[:MEMBER_OF]->(:Team)` — Team membership.
- `(:Incident)-[:ROOT_CAUSED_BY]->(:Commit|:Infrastructure)` — Confirmed root-cause edge.
- `(:Playbook)-[:REMEDIES]->(:Service|:Infrastructure)` — Validated mitigation procedure.

### 3.3 Multi-Graph Isolation
- **Master Graph (`enterprise_master`)**: Read-only canonical source of truth for runtime topology and team context.
- **Incident Scratchpad (`incident:<id>`)**: Writable ephemeral sandbox created upon alert. The agent swarm writes hypotheses, tests paths, and crystallizes verified root causes without mutating production data.

---

## 4. Multi-Agent Swarm Specification (Track 02)

Implemented in [backend/agents/](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/agents/).

### 4.1 Swarm LLM Engine & Architecture
* **Primary LLM**: Google DeepMind **Gemini 3.8 Flash** (`gemini-3.8-flash` via official `google-genai` SDK) — specialized for agentic workflows, long-horizon multi-step reasoning, and sub-second token latency.
* **Inference Mode**: **Pure Live LLM Inference** (Zero pre-computed mock responses; real-time generation of agent thoughts, Cypher queries, and execution streaming).
* **Telemetry Channel**: Real-time WebSocket stream (`/ws/telemetry`) streaming thoughts, latency metrics, and 3D graph highlights to the Next.js HUD.

### 4.2 Agent Roles
1. **Agent Alpha (`Blast-Radius Specialist`)**:
   - Source: [backend/agents/arch_agent.py](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/agents/arch_agent.py)
   - Function: Executes GraphBLAS BFS (`algo.BFS`) starting from alerting service up to 4 hops upstream/downstream to locate degraded infrastructure.
2. **Agent Beta (`Code Archaeologist`)**:
   - Source: [backend/agents/code_agent.py](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/agents/code_agent.py)
   - Function: Inspects Git commit provenance (`DEPLOYED_FROM`, `AUTHORED_BY`) and RFC decisions (`IMPLEMENTS`) on degraded nodes, running PageRank (`algo.pageRank`) to discover the genuine technical SME.
3. **Agent Gamma (`Remediation & Memory Specialist`)**:
   - Source: [backend/agents/incident_agent.py](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/agents/incident_agent.py)
   - Function: Searches episodic incident memory, finds matching historical post-mortems, matches executable playbooks, and prepares the 1-click remediation command.
4. **Swarm Orchestrator**:
   - Source: [backend/agents/swarm_router.py](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/agents/swarm_router.py)
   - Function: Coordinates agent blackboard, streams thought tokens to WebSockets, and controls scratchpad lifecycle.

---

## 5. Built-in FalkorDB Algorithms & Causal Queries

Implemented in [backend/tools/algo_runner.py](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/tools/algo_runner.py).

### 5.1 Multi-Hop Blast-Radius BFS
```cypher
MATCH (start:Service {name: $service_name})
CALL algo.BFS(start, 4, ['CALLS', 'DEPENDS_ON'])
YIELD nodes, edges
RETURN [n IN nodes | n.name] AS TraversalPath;
```

### 5.2 Time-Decayed PageRank on Authorship (SME Discovery)
```cypher
CALL algo.pageRank('Person', 'AUTHORED_BY')
YIELD node, score
RETURN node.name AS Expert, node.slack_handle AS SlackHandle, score AS AuthorityScore
ORDER BY score DESC LIMIT 1;
```

### 5.3 Betweenness Centrality (Systemic Fragility Index)
```cypher
CALL algo.betweenness({nodeLabels: ['Service'], relationshipTypes: ['CALLS', 'DEPENDS_ON']})
YIELD node, score
RETURN node.name AS Service, score AS FragilityIndex
ORDER BY score DESC LIMIT 5;
```

---

## 6. Frontend Architecture (Next.js 15)

Implemented in [frontend/](file:///e:/Antigravity/Workspaces/Graph%20Hacks/frontend/).

### 6.1 Layout & Visual Theme
- **Theme**: Dark Obsidian Void (`#060709`).
- **HUD**: Glassmorphic panels with `backdrop-filter: blur(16px)`.
- **Canvas**: Full-screen 3D Force-Directed Graph (`react-force-graph-3d` + Three.js `UnrealBloomPass`).
- **Dynamic Particles**: `linkDirectionalParticles={4}` streaming neon energy packets along active causal paths.

### 6.2 Zero-Lag Hydration Guarantee
To avoid SSR hydration mismatches in Next.js, the 3D canvas is isolated via client-only dynamic loading:
- Implemented in [frontend/components/graph/GraphCanvasWrapper.tsx](file:///e:/Antigravity/Workspaces/Graph%20Hacks/frontend/components/graph/GraphCanvasWrapper.tsx).
- Uses `next/dynamic` with `ssr: false` and a dark skeleton fallback.

---

## 7. Backend API & WebSocket Contracts

Implemented in [backend/main.py](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/main.py).

### 7.1 Endpoints
* `GET /api/health` — Checks FalkorDB connection status and server health.
* `GET /api/graph/master` — Exports full node and edge topology for frontend 3D canvas initialization.
* `POST /api/incident/simulate` — Triggers the Golden Demo ("The Silent Poison Migration") simulated outage.
* `POST /api/incident/remediate` — Executes the 1-click playbook command.
* `WS /ws/telemetry` — Bidirectional real-time stream emitting:
  - `AGENT_THOUGHT`: Sub-goal analysis.
  - `CYPHER_EXEC`: Query text + execution latency in milliseconds.
  - `GRAPH_HIGHLIGHT`: Node/edge IDs for 3D camera tracking and particle activation.
  - `OUTAGE_RESOLVED`: Live mitigation event.

---

## 8. Directory & File Manifest

* [`architecture.md`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/architecture.md): Ground-truth system specification.
* [`DESIGN.md`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/DESIGN.md): Visual design system, HUD tokens, and layout specification.
* [`to-do.md`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/to-do.md): Real-time task tracker.
* [`INCIDENT_RESEARCH_DOSSIER.md`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/INCIDENT_RESEARCH_DOSSIER.md): Comprehensive SRE research dossier.
* [`backend/`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/): Python FastAPI backend.
  * [`requirements.txt`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/requirements.txt)
  * [`.env.example`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/.env.example)
  * [`config.py`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/config.py)
  * [`main.py`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/main.py)
  * [`database/client.py`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/database/client.py)
  * [`database/schema.py`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/database/schema.py)
  * [`database/seed_data.py`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/database/seed_data.py)
  * [`agents/swarm_router.py`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/agents/swarm_router.py)
  * [`agents/arch_agent.py`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/agents/arch_agent.py)
  * [`agents/code_agent.py`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/agents/code_agent.py)
  * [`agents/incident_agent.py`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/agents/incident_agent.py)
  * [`tools/cypher_runner.py`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/tools/cypher_runner.py)
  * [`tools/algo_runner.py`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/backend/tools/algo_runner.py)
* [`frontend/`](file:///e:/Antigravity/Workspaces/Graph%20Hacks/frontend/): Next.js 15 frontend application.
