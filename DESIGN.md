# Design Specification: The Actual Cause

Visual architecture, design tokens, motion choreography, and HUD interface contracts for the Next.js 15 frontend.
Engineered with principles from TypeUI, Taste Skill, Design Motion Principles, and Impeccable.

---

## 1. Design Read and Aesthetic Dials (Taste Skill Framework)

### 1.1 Brief Inference
Reading this as: Mission-critical SRE incident triage war room for high-stress engineering teams, with a Linear-clean dark-tech language, leaning toward OKLCH dark void palette, Three.js force-directed graph canvas, and restrained purposeful motion.

### 1.2 Core Aesthetic Dials
* Design Variance: 6 / 10 (High structural discipline with asymmetrical telemetry density)
* Motion Intensity: 6 / 10 (Restrained, functional physics; photon pulses on active Cypher traversals; zero playful bounce)
* Visual Density: 8 / 10 (Cockpit telemetry density; high-information HUD with tabular monospace figures)

### 1.3 Anti-Default Discipline (Impeccable & Taste Skill Rules)
* Hard ban on AI-purple gradients, generic violet accents, and dark mesh backgrounds.
* Hard ban on decorative floating background blobs or cards nested inside cards.
* Hard ban on animating image or static icon elements on hover.
* Every animated particle represents real database edge traversal or active WebSocket telemetry.

---

## 2. Color System and Design Tokens (TypeUI & Impeccable Contrast)

All colors use calibrated OKLCH values mapped to high-contrast dark environments. Body text guarantees greater than 6.5:1 contrast against base void surfaces, exceeding WCAG 2.2 AA standards.

### 2.1 Canvas and Surfaces
* Base Canvas: #060709 (Deep obsidian black, oklch(0.12 0.01 260))
* Surface Low: #0d1117 (Subtle panel background, oklch(0.15 0.01 260))
* Surface Glass: rgba(13, 17, 23, 0.75) with 16px backdrop-filter blur
* Glass Border: rgba(255, 255, 255, 0.08)
* Glass Border Hover: rgba(255, 255, 255, 0.16)
* Glass Border Active: rgba(6, 182, 212, 0.40)

### 2.2 State and Semantic Colors
* Incident Root Cause: #ef4444 (Crimson red, oklch(0.63 0.24 25))
* Systemic Chokepoint: #f59e0b (Amber caution, oklch(0.75 0.18 70))
* Active Graph Traversal: #06b6d4 (Electric cyan, oklch(0.72 0.16 210))
* Verified Resolution: #10b981 (Emerald green, oklch(0.70 0.17 155))
* Secondary Infrastructure: #64748b (Slate gray, oklch(0.55 0.03 250))

### 2.3 Typography Colors
* Text Primary: #f1f5f9 (Off-white, 14.8:1 contrast, oklch(0.96 0.01 250))
* Text Secondary: #94a3b8 (Medium slate, 7.2:1 contrast, oklch(0.72 0.02 250))
* Text Muted: #64748b (Low contrast metadata, 4.8:1 contrast, oklch(0.55 0.03 250))
* Text Accent: #38bdf8 (Sky cyan code highlighting, oklch(0.78 0.14 220))

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

---

## 6. Motion Choreography (Design Motion Principles Framework)

Following the Emil Kowalski and Jakub Krehel restraint guidelines: every animation must have an engineering purpose, run on GPU-accelerated properties (transform, opacity, stroke-dashoffset), and provide an instant reduced-motion fallback.

### 6.1 Transition Curves
* Panel Slide-In / Out: `cubic-bezier(0.16, 1, 0.3, 1)` (expo ease-out, duration: 240ms).
* Telemetry Feed Item Ingestion: `cubic-bezier(0.25, 1, 0.5, 1)` (quart ease-out, duration: 180ms, translateY: 6px to 0px).
* Hover State Feedback: `cubic-bezier(0.4, 0, 0.2, 1)` (fast standard curve, duration: 120ms).

### 6.2 3D Force-Graph Physics and Pulses
* Camera Target Orbit: Spring curve with stiffness 280 and damping 32. Smoothly centers the suspect node without disorienting the engineer.
* Photon Particles: Particle flow along graph edges is idle (0 particles/sec) until an active Cypher query traverses that dependency. During query execution, 4 photon particles traverse the link at speed 0.006 with electric cyan glow, then dissolve into the target node.
* Node Pulse: Compromised nodes pulse between scale 1.0 and 1.15 using a gentle 1800ms sine cycle, illuminating their immediate 1-hop blast radius.

### 6.3 Accessibility Fallback
Every animation respects `@media (prefers-reduced-motion: reduce)`:
* Particle streams are disabled; edges illuminate statically with solid color.
* Camera position transitions jump instantly to the target coordinates.
* Panels appear via instantaneous opacity switch without slide offsets.

---

## 7. Component State Matrix (TypeUI System Standards)

Every interactive HUD element adheres to strict state contracts:

| Element | Default State | Hover State | Active / Investigating State | Failure / Alert State | Focus Visible State |
|---|---|---|---|---|---|
| Service Node | Slate fill, 0.08 border | Cyan rim glow, pointer | Pulsing cyan photons, scale 1.1 | Crimson glow, red label | 2px Cyan outline offset |
| Remediation CTA | Emerald background | 10% brightness boost | Spinning progress track, disabled | Amber warning banner | 2px Emerald ring |
| Telemetry Card | Surface Low, 0.08 border | Surface Glass, 0.16 border | Cyan left accent bar | Red left accent bar | 1px Cyan border |
| Graph Filter Tab | Slate text, transparent bg | Text Primary, 0.05 bg | Cyan text, cyan bottom bar | N/A | 2px White ring offset |

