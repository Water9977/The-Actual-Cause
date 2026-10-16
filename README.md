# The Actual Cause (SYNAPSE-OS)

Autonomous incident triage and organizational memory engine on FalkorDB.  
Submissions for WeMakeDevs & FalkorDB Graph Hacks Hackathon:
* Track 02: Agent Memory & Coordination
* Track 03: Company Brain

---

## Executive Overview

When production breaks at 3 AM, engineers do not lack alerts; they drown in them. A single cache configuration change causes hundreds of cascading 500 errors across dozens of downstream services. The on-call engineer wakes up, fumbles through multi-factor authentication, and stares at a wall of red charts.

Standard AI triage tools make this worse. They feed error messages into flat vector databases, retrieve an outdated runbook from two years ago, and recommend restarting the frontmost microservice. The service restarts, hits the exact same blocked upstream dependency, and crashes again. Mean time to recovery stretches into hours.

The Actual Cause takes a fundamentally different path. It models an entire engineering organization as a living, directed socio-technical graph in FalkorDB:
* Physical services, databases, and message queues.
* Active runtime alerts and latency thresholds.
* Git commits, pull requests, and configuration diffs.
* Architectural decisions (RFCs) and design rationales.
* Teams, engineers, on-call schedules, and Git authorship centrality.

When an outage strikes, an autonomous tri-agent swarm explores this graph using GraphBLAS linear algebra. In under one second, it traverses causal dependency chains three hops upstream, isolates the root-cause configuration change, runs PageRank to identify the engineer who understands the code, matches an existing operational playbook, and hands responders a verified one-click fix.

---

## Architecture

```
+-------------------------------------------------------------------------------+
|                    NEXT.JS 16 TACTICAL SRE WORKBENCH                          |
|  - Orthographic Causal DAG Canvas (@xyflow/react + @dagrejs/dagre)            |
|  - Temporal Timeline Scrubber (T-15m to T+0m step replay)                     |
|  - HolmesGPT 4-Group Evidence Ledger (Affected, Healthy, Changed, Unchecked)  |
|  - Live FalkorDB Cypher Traversal Viewer & 1-Click Remediation Action         |
|  - High-Density Monospace Telemetry Strip (Crawl4AI pattern)                  |
+-------------------------------------------------------------------------------+
                                      |
                     REST APIs & WebSocket Stream (/ws/telemetry)
                                      |
+-------------------------------------------------------------------------------+
|                       FASTAPI SWARM INTELLIGENCE ROUTER                       |
|  - 30-Second Bounded Triage Pipeline & Handoff Coordinator                    |
|  - Real-Time JSON Telemetry Broadcaster (Thoughts, Cypher, Highlights)        |
+-------------------------------------------------------------------------------+
       |                              |                              |
       v                              v                              v
+---------------+             +---------------+             +---------------+
|  AGENT ALPHA  |             |  AGENT BETA   |             |  AGENT GAMMA  |
| Blast Radius  |             |  Code & RFC   |             | Remediation & |
|  & Topology   |             |  Archaeology  |             | Memory Engine |
+---------------+             +---------------+             +---------------+
       |                              |                              |
       +------------------------------+------------------------------+
                                      |
                           OpenCypher & GraphBLAS
                                      |
+-------------------------------------------------------------------------------+
|                     FALKORDB GRAPHBLAS DATABASE ENGINE                        |
|  - Sparse Matrix Linear Algebra Traversal over Semirings                      |
|  - Multi-Graph Isolation: enterprise_master vs scratchpad_{incident_id}       |
|  - Native Graph Algorithms: algo.BFS, algo.pageRank, algo.betweenness         |
|  - Range, Full-Text, and Vector Indexes                                       |
+-------------------------------------------------------------------------------+
```

---

## The Tri-Agent Swarm

The system deploys three specialized autonomous agents coordinated by a centralized swarm router:

### 1. Agent Alpha: Blast Radius & Topology Specialist
Starts at the alerting symptom node (for example, `CheckoutService`) and executes native GraphBLAS Breadth-First Search (`algo.BFS`) across caller-callee and infrastructure edges. It filters out symptom noise, maps the cascading blast radius, and isolates the upstream resource that reached saturation (`PricingRedisCluster`).

### 2. Agent Beta: Code & Decision Archaeology Specialist
Takes the saturated subsystem from Agent Alpha and traces its deployment history back through active commits, pull requests, code diffs, and RFC architectural decision records. It traverses to commit `c92f8a1` (PR #1482) and links it directly to `RFC-308`. It then executes GraphBLAS PageRank over the Git authorship and playbook authorship graph to surface the authentic subject matter expert (`Elena Rostova`, Staff Systems Architect, PageRank 0.91), bypassing stale on-call rotations.

### 3. Agent Gamma: Remediation & Episodic Memory Specialist
Matches the failure signature against historical incident records and verified operational playbooks stored in FalkorDB (`PB-REDIS-EVICTION`). It synthesizes a safe, concrete remediation command (`CONFIG SET maxmemory-policy allkeys-lru`) for human review. Once executed, it crystallizes the verified failure path into the master graph so the company never suffers the exact same outage twice.

---

## Quantitative Benchmark: FalkorDB GraphBLAS vs Flat Vector RAG

We evaluated The Actual Cause against standard Vector RAG across three canonical production incident scenarios.

Benchmark script: `benchmarks/compare_rag.py`  
Full report: `benchmarks/BENCHMARK_RESULTS.md`

| Metric Dimension | The Actual Cause (FalkorDB GraphBLAS) | Flat Vector RAG (Semantic Chunks) | Advantage |
|---|---|---|---|
| **S1: Blast Radius Query Latency** | 1.09 ms | 45.35 ms | **41.6x faster execution** |
| **S1: Multi-Hop Context Recall** | 100.0% | 33.3% | **+66.7% complete topology** |
| **S1: Traversal Depth** | 4 hops (full dependency tree) | 1 hop (stalled at boundary) | **Full causal reach** |
| **S1: Root Cause Detection** | 100% deterministic (Commit c92f8a1) | 0% (Missed in chunk boundary) | **Zero missed commits** |
| **S1: Hallucination Rate** | 0.0% | 100.0% (Fabricated DB timeout) | **Zero hallucinations** |
| **S1: LLM Prompt Tokens** | 92 tokens | 406 tokens | **77.3% token reduction** |
| **S2: RFC Provenance Latency** | 0.88 ms | 38.3 ms | **Sub-millisecond retrieval** |
| **S2: Reviewer Identification** | Elena Rostova (100% precision) | Unknown (Ambiguous in text) | **Explicit relationship traversal** |
| **S3: SME Discovery Latency** | 0.95 ms | 41.26 ms | **Instant algebraic centrality** |
| **S3: Target SME Paged** | Elena Rostova (Staff Architect) | Dave Chen (Junior Engineer) | **Correct escalation** |
| **S3: SME Selection Accuracy** | 100.0% (PageRank 0.91) | 0.0% (Wrong engineer paged) | **Avoids alert fatigue** |

### Why Flat Vector RAG Fails
Vector search relies on cosine similarity between unstructured text chunks. A query for "CheckoutService latency spike" matches checkout alerts, but has zero cosine similarity to a Redis `maxmemory-policy` commit message. Vector RAG stalls after one hop, misses the root cause, and consumes 4.4x more prompt tokens feeding irrelevant log chunks to the model.

---

## One-Command Quickstart (Docker Compose)

The entire platform (FalkorDB, FastAPI backend, and Next.js frontend) is packaged as a self-contained, free, local stack requiring zero cloud subscriptions.

```bash
# Clone the repository
git clone https://github.com/Water9977/The-Actual-Cause.git
cd The-Actual-Cause

# Launch the complete platform
docker compose up --build
```

Once running:
* **Tactical SRE Workbench**: Open `http://localhost:3000`
* **FastAPI Backend Documentation**: Open `http://localhost:8000/docs`
* **Health & Status Check**: `curl http://localhost:8000/api/health`
* **FalkorDB Instance**: Accessible directly at `localhost:6379`

The backend automatically initializes indexes and seeds the enterprise incident topology into FalkorDB on boot.

---

## Local Development (Without Docker)

### 1. Prerequisites
* Python 3.11+
* Node.js 20+
* Docker (for local FalkorDB container) or FalkorDB Cloud free tier account

### 2. Run FalkorDB Locally
```bash
docker run -p 6379:6379 -it --rm falkordb/falkordb:latest
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# Linux / macOS:
source venv/bin/activate
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Seed the enterprise knowledge graph
python -m database.seed_data

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` to interact with the console.

### 5. Running the Quantitative Benchmark
```bash
# Run with in-memory GraphBLAS simulation (zero prerequisites)
python benchmarks/compare_rag.py --offline

# Run against live local FalkorDB instance
python benchmarks/compare_rag.py --live
```

---

## Golden Demo Incident Walkthrough

1. **Trigger Incident Triage**: Click **RUN SWARM TRIAGE** in the header or press `Cmd+K` and select **Trigger Swarm Triage**.
2. **Observe Agent Coordination**:
   * Agent Alpha executes BFS: `CheckoutService -> OrderService -> PricingService -> PricingRedisCluster`.
   * Agent Beta identifies git commit `c92f8a1` (`PR #1482`), links it to `RFC-308`, and executes PageRank to surface Staff Architect Elena Rostova.
   * Agent Gamma queries historical postmortems, matches `PB-REDIS-EVICTION`, and computes the rollback command.
3. **Inspect the Evidence**: Click the **Evidence Drawer** at the bottom right to review the HolmesGPT 4-group classification:
   * **Affected**: CheckoutService (Critical), PricingService (Critical), PricingRedisCluster (Memory Exhaustion).
   * **Checked Healthy**: AuthGateway, InventoryService, OrderPostgresPrimary.
   * **Changed Elsewhere**: PR #1482 by Dave Chen (`maxmemory-policy: noeviction`).
   * **Not Checked**: RecommendationEngine, AnalyticsPipeline.
4. **Scrub the Timeline**: Drag the **Incident Timeline** slider to scrub through the incident progression from `T-15m` (silent migration) to `T+0m` (symptom alert).
5. **Execute 1-Click Remediation**: Click **EXECUTE REMEDIATION (ROLLBACK NOEVICTION)**. The command executes, FalkorDB crystallizes an `IncidentRecord` node connected to the service and commit, and the system baseline returns to green.

---

## Repository Structure

```
.
|-- backend/
|   |-- agents/
|   |   |-- arch_agent.py          # Agent Alpha: Blast radius and BFS traversal
|   |   |-- code_agent.py          # Agent Beta: Git diffs, RFCs, and PageRank SME discovery
|   |   |-- incident_agent.py      # Agent Gamma: Playbooks and postmortem crystallization
|   |   `-- swarm_router.py        # Swarm coordinator with live WebSocket telemetry
|   |-- database/
|   |   |-- client.py              # FalkorDB multi-graph connection manager
|   |   |-- schema.py              # Range, full-text, and vector index initializers
|   |   `-- seed_data.py           # Enterprise topology generator
|   |-- tools/
|   |   |-- cypher_runner.py       # Cypher execution with microsecond timing
|   |   `-- algo_runner.py         # GraphBLAS algorithm runner
|   |-- Dockerfile                 # Backend container definition
|   |-- config.py                  # Environment settings
|   `-- main.py                    # FastAPI application and WebSocket router
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- CausalDAG.tsx          # Orthographic DAG canvas with Dagre layout
|   |   |   |-- CauseNode.tsx          # Custom node with typed badges & signal status
|   |   |   |-- TimelineScrubber.tsx   # Interactive incident temporal scrubber
|   |   |   |-- EvidenceDrawer.tsx     # HolmesGPT 4-group drawer & Cypher viewer
|   |   |   |-- CommandPalette.tsx     # cmdk keyboard navigation modal
|   |   |   `-- Header.tsx             # Crawl4AI-inspired monospace telemetry strip
|   |   |-- app/
|   |   |   |-- globals.css            # Pitch-zinc dark theme tokens
|   |   |   `-- page.tsx               # Main SRE incident workbench page
|   |   `-- types/index.ts             # Domain models & telemetry types
|   `-- Dockerfile                     # Frontend container definition
|-- benchmarks/
|   |-- compare_rag.py             # Quantitative benchmark harness
|   `-- BENCHMARK_RESULTS.md       # Comparative precision, recall, and latency matrix
|-- docker-compose.yml             # 1-command local orchestration
|-- DESIGN.md                      # Anti-slop UI design system tokens & specification
|-- architecture.md                # System specification & GraphBLAS algorithms
|-- INCIDENT_RESEARCH_DOSSIER.md   # Deep SRE research on cascading failure topologies
`-- to-do.md                       # Active sprint task tracker
```

---

## Hackathon Track Mapping

### Track 02: Agent Memory and Coordination
* **Ephemeral Scratchpad Isolation**: Each active incident spins up an isolated scratchpad graph (`scratchpad_{incident_id}`) in FalkorDB where agents coordinate hypotheses, store candidate paths, and vote on root causes.
* **Episodic Memory Crystallization**: Upon incident mitigation, Agent Gamma writes a verified `IncidentRecord` node back into the `enterprise_master` graph with causal edges linking the symptom, commit, and resolution command, permanently updating organizational memory.

### Track 03: Company Brain
* **Unified Socio-Technical Topology**: Synthesizes siloed enterprise data (Git commits, PRs, RFC documents, team structures, PagerDuty schedules, and microservice infrastructure) into a single living graph.
* **GraphBLAS Algebraic Centrality**: Replaces static escalation policies with dynamic PageRank centrality to identify true subject matter experts during active outages.

---

## License

Apache 2.0
