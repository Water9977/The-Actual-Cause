# The Actual Cause: Task Tracker and Execution Log
Sprint Window: October 5 to October 18, 2026
Repository: https://github.com/Water9977/The-Actual-Cause

Status Legend:
* [x] Completed
* [-] In Progress
* [ ] Pending / Up Next
* [?] Discussion / Decision Required from User

---

## Active Sprint Phases

### Phase 1: Research, Architecture and Specification (Completed)
* [x] Task 1.1: Deep research and scraping of WeMakeDevs Graph Hacks hackathon portal, rules, dates, and $20,000 prize pool.
* [x] Task 1.2: Scrape and analyze FalkorDB documentation, Cypher extensions, GraphBLAS linear algebra engine, and built-in graph algorithms.
* [x] Task 1.3: Scrape and analyze FalkorDB GenAI tools (GraphRAG-SDK, MCP Server, Graphiti and Cognee agent memory frameworks).
* [x] Task 1.4: Clone core falkordb repository locally into workspace for technical reference.
* [x] Task 1.5: Select winning tracks: Track 02 (Agent Memory and Coordination) and Track 03 (Company Brain).
* [x] Task 1.6: Author comprehensive hackathon dossier (GRAPH_HACKS_DOSSIER.md).
* [x] Task 1.7: Formulate project vision: The Actual Cause (Autonomous Incident Triage and Organizational Memory).
* [x] Task 1.8: Create ground-truth system specification (architecture.md).
* [x] Task 1.9: Initialize master task tracker (to-do.md).
* [x] Task 1.10: Author exhaustive incident triage, cascading failure, and graph-based SRE memory dossier (INCIDENT_RESEARCH_DOSSIER.md).
* [x] Task 1.11: Initialize private GitHub repository (Water9977/The-Actual-Cause) and push project baseline.

---

### Phase 2: Database Layer and Enterprise Knowledge Graph Schema
* [-] Task 2.1: Provision FalkorDB Cloud free instance (app.falkordb.cloud) and configure credentials in backend/.env.
* [x] Task 2.2: Implement Python database connection manager (backend/database/client.py) supporting FalkorDB Cloud URL, SSL, and multi-graph isolation (enterprise_master vs ephemeral scratchpads).
* [x] Task 2.3: Implement schema and index initialization script (backend/database/schema.py) configuring Range, Full-Text, and Vector indexes.
* [x] Task 2.4: Create realistic synthetic enterprise dataset generator (backend/database/seed_data.py):
  * Services: CheckoutService, OrderService, PricingService, InventoryService, AuthService.
  * Infrastructure: PricingRedisCluster, OrderPostgresPrimary, InventoryPostgresPrimary.
  * People and Teams: Elena Rostova, Dave Miller, Sarah Chen, SRE Squad, Core Platform.
  * Commits and PRs: PR #1482 by Elena Rostova (changing maxmemory-policy to noeviction).
  * Decisions: RFC-308 (Enforce Strict Price Accuracy).
  * Playbooks: PB-REDIS-EVICTION (CONFIG SET maxmemory-policy allkeys-lru).
* [-] Task 2.5: Verify native graph algorithms (algo.pageRank, algo.betweenness, algo.BFS) on the seed graph once cloud credentials are provided.

---

### Phase 3: Backend and Multi-Agent Swarm Engine (Python / FastAPI)
* [x] Task 3.1: Scaffold FastAPI application with CORS and environment configuration (backend/main.py, backend/config.py).
* [x] Task 3.2: Implement Cypher and GraphBLAS algorithm execution tools with microsecond timing (backend/tools/cypher_runner.py, backend/tools/algo_runner.py).
* [x] Task 3.3: Implement Agent Alpha (backend/agents/arch_agent.py): Blast Radius and Topological BFS Specialist powered by Gemini 3.8 Flash.
* [x] Task 3.4: Implement Agent Beta (backend/agents/code_agent.py): Git Provenance, RFC Decisions and PageRank SME Specialist powered by Gemini 3.8 Flash.
* [x] Task 3.5: Implement Agent Gamma (backend/agents/incident_agent.py): Remediation Playbook and Episodic Memory Crystallization Specialist powered by Gemini 3.8 Flash.
* [x] Task 3.6: Implement Swarm Orchestrator (backend/agents/swarm_router.py) managing 30-second triage pipeline and agent coordination.
* [x] Task 3.7: Implement real-time WebSocket telemetry channel (/ws/telemetry) streaming thoughts, Cypher queries, graph node highlights, and agent handoffs.

---

### Phase 4: Next.js Frontend Foundation and Anti-Slop Design System
* [?] Task 4.1: Create DESIGN.md in direct co-design session with user to lock in typography, palette, and HUD wireframe.
* [ ] Task 4.2: Initialize Next.js 15 App Router project in frontend/ with TypeScript and Tailwind CSS.
* [ ] Task 4.3: Configure OKLCH dark void theme tokens, typography clamp ceilings, and frosted glass classes.
* [ ] Task 4.4: Implement zero-hydration WebGL wrapper pattern (GraphCanvasWrapper.tsx with ssr: false).
* [ ] Task 4.5: Implement global Zustand state stores for swarm telemetry, active queries, and graph selection.

---

### Phase 5: 3D Force-Graph Canvas and Cinematic HUD
* [ ] Task 5.1: Integrate react-force-graph-3d with Three.js scene setup.
* [ ] Task 5.2: Add UnrealBloomPass for neon node glow and node category coloring.
* [ ] Task 5.3: Implement linkDirectionalParticles to visualize active agent traversal pulses along edges.
* [ ] Task 5.4: Build Glassmorphic Left Telemetry HUD (live agent chat, thought stream, Cypher execution timing).
* [ ] Task 5.5: Build Glassmorphic Right Inspector Drawer (node attributes, document markdown, git diffs, citations).
* [ ] Task 5.6: Build Top Command Bar with query suggestions, domain filters, and 1-click algorithm triggers.

---

### Phase 6: End-to-End Integration, Benchmarking and Proof
* [ ] Task 6.1: Connect Next.js frontend to FastAPI WebSocket and REST endpoints.
* [ ] Task 6.2: Test multi-hop causal enterprise queries end-to-end with live 3D graph camera tracking.
* [ ] Task 6.3: Build Quantitative Benchmark module:
  * Question 1: Cross-system blast radius.
  * Question 2: Historical decision provenance.
  * Question 3: Key expert discovery via PageRank.
  * Side-by-side comparison: Flat Vector RAG (hallucination and missing context) vs The Actual Cause (100% precision).

---

### Phase 7: Hackathon Submission Polish and Deliverables
* [ ] Task 7.1: Write 1-command Docker Compose setup for judge execution.
* [ ] Task 7.2: Deploy live frontend to Vercel and backend to cloud host.
* [ ] Task 7.3: Maintain clean, humanized GitHub README.md with clear architectural diagrams.
* [ ] Task 7.4: Record crisp 2-minute video walkthrough showcasing the agent swarm and 3D graph in action.
* [ ] Task 7.5: Draft high-signal technical blog post targeting the AirPods 5 Side Prize.

---

## Discussion and User Decisions Backlog

| Item ID | Topic / Decision | Locked Selection / User Directive | Status |
|---|---|---|---|
| DEC-01 | FalkorDB Running Mode | FalkorDB Cloud (Managed Free Tier): User will provision on app.falkordb.cloud and configure host/port/credentials or FALKORDB_URL in .env. | [x] Locked |
| DEC-02 | LLM Swarm Model | Gemini 3.8 Flash (Google DeepMind workhorse for agentic coding and reasoning, released Sept 2026) with future Gemini 4 Argon compatibility. | [x] Locked |
| DEC-03 | Execution Mode | Pure Live LLM Inference: Real-time generation of agent thoughts, Cypher queries, and execution streaming. | [x] Locked |
| DEC-04 | Frontend Co-Design | Strict User Collaboration: Assistant will not write frontend layout independently; user and assistant co-design DESIGN.md first. | [x] Locked |
| DEC-05 | Writing Style & Repo | Private GitHub repo The-Actual-Cause; zero em dashes, zero emojis, zero hashtags, completely humanized text. | [x] Locked |
