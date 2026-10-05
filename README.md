# The Actual Cause

Autonomous incident triage and organizational memory on FalkorDB.

When production breaks at 3 AM, engineers do not lack alerts. They drown in them. A single database lock creates hundreds of cascading 500 errors across dozens of downstream services. The on-call engineer wakes up with an elevated heart rate, fumbles through multi-factor authentication, and stares at a wall of red charts in Datadog. 

Standard AI triage tools make this worse. They feed error messages into flat vector databases, retrieve an outdated Confluence runbook from 2022, and recommend restarting the service. The service restarts, hits the exact same blocked upstream dependency, and crashes again. Mean time to recovery stretches into hours.

The Actual Cause takes a fundamentally different path. It models your entire engineering ecosystem as a living, directed socio-technical graph in FalkorDB: physical services, databases, runtime alerts, git commits, pull requests, RFC decisions, teams, and authors. 

When an outage strikes, an autonomous tri-agent swarm explores this graph using GraphBLAS linear algebra. In under one second, it follows causal dependency chains three hops upstream, isolates the root-cause configuration change, runs PageRank to identify the engineer who understands the code, matches an existing operational playbook, and hands responders a one-click fix.

---

## The Core Problem: Why Incumbent Tools Fail

Production systems fail as cascading phenomena, but current tooling treats telemetry, version control, and people as isolated islands:

1. Telemetry tools like Datadog and Honeycomb show what broke, but cannot follow code provenance to explain why it broke or who pushed the change.
2. Alert routers like PagerDuty treat services as flat strings with webhooks. They page whoever happens to be scheduled on the rotation, even if that person joined two weeks ago and knows nothing about the failing subsystem.
3. Naive Vector RAG is topologically blind. Semantic text similarity cannot walk a directed dependency path from CheckoutService to OrderService to PricingRedisCluster. It returns text chunks that happen to share keywords, frequently recommending actions that accelerate the collapse.

---

## How It Works

The system operates around three specialized autonomous agents coordinated by an orchestrator over FalkorDB:

### 1. Agent Alpha (Blast Radius & Topology)
Starts at the alerting symptom node and runs native GraphBLAS Breadth-First Search (algo.BFS) across caller-callee and infrastructure edges. It filters out symptom noise, maps the blast radius, and locates the upstream resource that reached saturation.

### 2. Agent Beta (Code & Decision Archaeology)
Takes the suspect subsystem from Agent Alpha and traces its deployment history back through active commits, pull requests, code diffs, and RFC architectural decision records. It then executes GraphBLAS PageRank over the Git authorship graph to surface the authentic subject matter expert, bypassing stale on-call schedules.

### 3. Agent Gamma (Remediation & Episodic Memory)
Matches the failure signature against historical incident postmortems and operational playbooks stored in FalkorDB. It synthesizes a safe, concrete remediation command for human review, executes the hotpatch, and crystallizes the verified failure path into the master graph so the company never suffers the exact same outage twice.

---

## Technical Stack

* Database: FalkorDB (SuiteSparse GraphBLAS engine running sparse matrix-vector multiplication over semirings)
* Language & Backend: Python 3.11, FastAPI, Uvicorn, WebSockets
* Swarm Reasoning Engine: Google DeepMind Gemini 3.8 Flash via official google-genai SDK
* Graph Query Language: OpenCypher with FalkorDB graph algorithm extensions (algo.BFS, algo.pageRank, algo.betweenness)
* Frontend: Next.js 15 App Router, TypeScript, Tailwind CSS, Three.js 3D Force-Directed Graph canvas

---

## Repository Structure

```
.
|-- backend/
|   |-- agents/
|   |   |-- arch_agent.py        # Agent Alpha: Blast radius and BFS traversal
|   |   |-- code_agent.py        # Agent Beta: Git diffs, RFCs, and PageRank SME discovery
|   |   |-- incident_agent.py    # Agent Gamma: Playbooks and postmortem crystallization
|   |   `-- swarm_router.py      # Swarm coordinator with live WebSocket telemetry
|   |-- database/
|   |   |-- client.py            # FalkorDB multi-graph connection manager
|   |   |-- schema.py            # Range, full-text, and vector index initializers
|   |   `-- seed_data.py         # Golden Demo enterprise topology generator
|   |-- tools/
|   |   |-- cypher_runner.py     # Cypher execution with microsecond timing
|   |   `-- algo_runner.py       # GraphBLAS algorithm runner
|   |-- config.py                # Environment configuration
|   |-- main.py                  # FastAPI application and WebSocket router
|   `-- requirements.txt         # Python dependencies
|-- frontend/                    # Next.js 15 interactive 3D HUD (co-design in progress)
|-- architecture.md              # Living ground-truth system specification
|-- to-do.md                     # Active task tracker and milestone log
`-- INCIDENT_RESEARCH_DOSSIER.md # Deep SRE research dossier on cascading failures
```

---

## Quickstart

### 1. Configure Environment

Copy the example configuration file in the backend directory:

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and supply your credentials:

```ini
# FalkorDB Cloud connection URL (from app.falkordb.cloud)
FALKORDB_URL=falkors://username:password@host:port

# Google Gemini API key (for Gemini 3.8 Flash live inference)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install Backend Dependencies

Create a virtual environment and install the required packages:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. Seed Enterprise Topology

Populate your FalkorDB instance with the enterprise graph and Golden Demo scenario:

```bash
python -m database.seed_data
```

### 4. Start the Backend Server

Launch the FastAPI application:

```bash
uvicorn main:app --reload --port 8000
```

The API health check will be accessible at `http://localhost:8000/api/health`, and real-time swarm telemetry streams through `ws://localhost:8000/ws/telemetry`.

---

## License

Apache 2.0
