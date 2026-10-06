# Design Specification: The Actual Cause

Visual architecture, design tokens, and HUD interface contracts for the Next.js 15 frontend.

---

## 1. Design Philosophy

When engineers are dealing with a critical incident at 3 AM, they do not want marketing gloss, bloated illustrations, or slow animations. They need extreme visual clarity, immediate spatial orientation, and zero latency.

Every pixel in this interface serves one purpose: helping a human understand why the system collapsed, which commit broke it, and what command will restore uptime.

### Strict Design Constraints
* Zero purple slop: No violet gradients, no generic SaaS purple themes.
* Zero decorative fluff: Every badge, line, and pulse represents real graph topology or active telemetry.
* Pure dark void background: High contrast black slate base to prevent eye strain during long on-call sessions.
* Sub-millisecond feel: Micro-interactions must feel instant, tactile, and surgical.

---

## 2. Color System and Design Tokens

All colors use precise hex and alpha values tailored for high-contrast dark environments.

### Canvas and Surfaces
* Base Canvas: #060709 (Deep obsidian black)
* Surface Low: #0d1117 (Subtle card background)
* Surface Glass: rgba(13, 17, 23, 0.75) with 16px backdrop blur
* Glass Border: rgba(255, 255, 255, 0.08)
* Glass Border Active: rgba(6, 182, 212, 0.40)

### State and Semantic Colors
* Incident Root Cause: #ef4444 (Crimson red)
* Systemic Chokepoint: #f59e0b (Amber caution)
* Active Graph Traversal: #06b6d4 (Electric cyan)
* Verified Resolution: #10b981 (Emerald green)
* Secondary Infrastructure: #64748b (Slate gray)

### Typography Colors
* Text Primary: #f1f5f9 (High contrast off-white)
* Text Secondary: #94a3b8 (Medium contrast slate)
* Text Muted: #64748b (Low contrast metadata)
* Text Accent: #38bdf8 (Sky blue code highlighting)

---

## 3. Typography Stack

* Interface Font: Geist Sans or Inter (sans-serif, clean legibility at small sizes).
* Monospace Font: JetBrains Mono or Geist Mono (for commit hashes, Cypher queries, millisecond timers, and bash commands).
* Type Scales:
  * Display Header: 18px (semi-bold)
  * Section Title: 14px (medium)
  * Body Text: 13px (regular)
  * Code / Metadata: 11px to 12px (monospace, tabular figures)

---

## 4. Screen Layout and Spatial Hierarchy

The interface uses a full-viewport layout divided into five functional areas:

```
+----------------------------------------------------------------------------------------------------+
| TOP COMMAND BAR (Height: 52px)                                                                     |
| Breadcrumb: INC-7702 | Timer: 00:28.4 | Status: TRIAGING | [Simulate Golden Demo] | [WebSocket: OK] |
+------------------------------------+----------------------------------+----------------------------+
| LEFT TELEMETRY HUD (Width: 380px)  | CENTER 3D GRAPH CANVAS (Flex: 1) | RIGHT INSPECTOR (Width: 400px)
|                                    |                                  |                            |
| * Agent Alpha Stream               | Fullscreen Three.js WebGL scene  | Node Details:              |
|   (BFS blast radius, 0.42ms)       | Nodes glowing by health status   | PricingRedisCluster        |
|                                    | Directional photon pulses        | Type: Redis (In-Memory)    |
| * Agent Beta Stream                | Active camera focus on suspect   | Memory Usage: 99.8%        |
|   (PR #1482 by Elena, 0.61ms)      |                                  |                            |
|                                    |                                  | Git Diff View:             |
| * Agent Gamma Stream               |                                  | - maxmemory-policy allkeys |
|   (PB-REDIS-EVICTION match)        |                                  | + maxmemory-policy noevict |
|                                    |                                  |                            |
| * Live Cypher Query Feed           |                                  | [Execute 1-Click Hotpatch] |
+------------------------------------+----------------------------------+----------------------------+
| BOTTOM TELEMETRY STRIP (Height: 36px)                                                              |
| Top Fragility Index: OrderService (0.34) | Authoritative SME: Elena Rostova (Score: 0.91)          |
+----------------------------------------------------------------------------------------------------+
```

### Component Breakdown

#### 1. Top Command Bar
* Incident Identifier: High contrast badge displaying active incident ID (for example, INC-7702).
* MTTI Stop-Watch: Live timer tracking elapsed triage time from alert ingestion to mitigation.
* One-Click Scenario Trigger: Button labeled "Simulate Outage (The Silent Poison Migration)" to let hackathon judges run the complete demo instantly.
* Backend Connection Pulse: Live indicator verifying WebSocket connectivity to the FastAPI server.

#### 2. Center 3D Graph Canvas
* Implemented via react-force-graph-3d wrapped in Next.js dynamic import with ssr: false.
* Nodes render as high-visibility glowing spheres sized by dependency degree.
* Color mapped by node type:
  * Services: Cyan or Slate (turns Crimson when compromised)
  * Infrastructure: Deep Indigo or Slate
  * Commits and PRs: Violet slate or Amber
  * People: Teal or Emerald
* Links render with directional particle pulses (linkDirectionalParticles) that travel along caller-callee lines when an agent traverses them.

#### 3. Left Telemetry HUD (The Agent War Room)
* Displays real-time streaming thoughts from the Tri-Agent Swarm.
* Tabbed or chronological view showing Agent Alpha, Beta, and Gamma transitions.
* Microsecond execution badges for every Cypher query (for example, "GraphBLAS BFS completed in 0.42ms").
* Clean copyable Cypher snippets for technical judges who want to inspect the exact query.

#### 4. Right Inspector Drawer
* Deep inspection panel that updates whenever a node is clicked on the 3D canvas or selected by an agent.
* Displays service health metrics, error budget burn rates, and caller dependencies.
* Shows Git commit messages, PR titles, and unified code diff snippets.
* Contains the prominent "Execute 1-Click Mitigation" button when Agent Gamma identifies a validated playbook.

#### 5. Bottom Telemetry Strip
* Displays real-time GraphBLAS metrics:
  * Systemic Fragility Index: Top chokepoints computed via Betweenness Centrality.
  * Subject Matter Expert: Top technical authority computed via PageRank on Git authorship.

---

## 5. Next.js 15 Implementation Architecture

### Zero-Hydration Client Boundary
To guarantee zero hydration delay and avoid canvas reconciliation mismatches:
* `GraphCanvasWrapper.tsx` uses `next/dynamic` with `ssr: false`.
* While the WebGL canvas initializes in the browser, a lightweight dark skeleton renders instantly.
* All WebSocket state and active node selections are stored in a centralized Zustand store (`useSwarmStore`).

### File Manifest for Frontend
```
frontend/
|-- src/
|   |-- app/
|   |   |-- layout.tsx           # Dark theme root layout and font injection
|   |   |-- page.tsx             # Main HUD container mounting canvas and panels
|   |   `-- globals.css          # Tailwind base, dark void tokens, scrollbar styling
|   |-- components/
|   |   |-- canvas/
|   |   |   |-- GraphCanvasWrapper.tsx  # Dynamic client-only WebGL wrapper
|   |   |   `-- ForceGraph3DView.tsx    # Three.js force graph with particle pulses
|   |   |-- hud/
|   |   |   |-- TopCommandBar.tsx       # Incident timer, status, trigger button
|   |   |   |-- LeftTelemetryHUD.tsx    # Agent swarm thought stream and Cypher logs
|   |   |   |-- RightInspector.tsx      # Node attributes, git diffs, remediation CTA
|   |   |   `-- BottomTelemetryStrip.tsx# Fragility index and PageRank SME strip
|   |   `-- ui/
|   |       |-- Badge.tsx               # Status badges
|   |       `-- CodeBlock.tsx           # Monospace Cypher and bash command cards
|   |-- hooks/
|   |   `-- useWebSocketTelemetry.ts    # Real-time WebSocket event listener
|   `-- store/
|       `-- useSwarmStore.ts            # Zustand global state for active incident
|-- package.json
|-- tsconfig.json
`-- tailwind.config.ts
```
