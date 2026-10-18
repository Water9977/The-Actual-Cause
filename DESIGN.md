# Design Specification: The Actual Cause

Visual architecture, design tokens, anti-AI-slop discipline, and component contracts for the Next.js incident triage console.
Engineered with principles from TypeUI, Taste Skill, Design Motion Principles, Impeccable, and reverse-engineered telemetry patterns from Skyvern and Crawl4AI.

---

## 1. Design Read and Aesthetic Dials (Taste Skill Framework)

### 1.1 Brief Inference
Reading this as: Tactical SRE incident investigation console for high-stress on-call engineers at 3:00 AM, with a Linear-grade minimalist language, leaning toward a pitch-zinc void palette, orthographic Causal DAG (`@xyflow/react` + Dagre), and purely functional motion.

### 1.2 Core Aesthetic Dials
* Design Variance: 6 / 10 (High structural discipline with asymmetrical telemetry density)
* Motion Intensity: 4 / 10 (Restrained, functional transitions; zero playful bounce or hover zooms)
* Visual Density: 8 / 10 (SRE workbench density; high-information HUD with tabular monospace metrics)

### 1.3 Anti-AI-Slop Directives (The 7 Inversions)
1. Color Palette: Pure monochromatic graphite base (Zinc `#09090b`), zero purple or indigo gradients, zero radial mesh glows. Signal colors are strictly functional (Crimson for root causes, Amber for degraded components, Emerald for verified healthy baselines).
2. Elimination of Card Clutter: No rounded rectangles inside rounded rectangles. Containers are replaced by 1px hairline dividers (`border-zinc-800`), typography hierarchy, and tabular data rows.
3. Operational Workbench: No centered hero headlines, no pill badges, and no marketing copy. The user drops directly into an operational split-pane investigation console.
4. Asymmetric Urgency: Visual weight focuses immediately on the culprit node and broken invariants; healthy background dependencies remain muted.
5. Purely Functional Motion: Glassmorphism, glowing borders, and cards scaling on hover are banned. Motion is limited to timeline scrubbing and smooth DAG position calculation.
6. Real Engineering Telemetry: Zero round numbers like 99.9% or fictional testimonials. Real Kubernetes pod anomalies, memory eviction stack traces, git commit SHAs, and live Cypher execution timings.
7. Product-Specific Graph Identity: Every screen element is directly tethered to FalkorDB Graph Nodes, Relationships, and Causal Paths.

---

## 2. Color System and Design Tokens

Calibrated high-contrast palette based on user specification (https://coolors.co/palette/000000-14213d-fca311-e5e5e5-ffffff).

### 2.1 Palette Definition
* Deep Base Canvas: #000000 (Pitch black void)
* Primary Surface / Navigation: #14213d (Oxford blue / midnight navy)
* Elevated Navy Surface: #192746 (Intermediate workbench panel surface)
* Hairline Navy Border: #24355a (Structural divider)
* Hero Accent / Highlights: #fca311 (Vibrant safety amber / gold)
* Secondary / Body Typography: #e5e5e5 (Platinum light gray)
* Primary Heading Typography: #ffffff (Pure white)

### 2.2 Semantic State Mapping
* Incident Root Cause & Culprits: #fca311 (Vibrant safety amber with pulsing beacon)
* Systemic Degradation: #fca311/80 (Medium amber for cache miss spikes and connection pool pressure)
* Verified Baseline & Passing Nodes: #ffffff (Pure white outline with solid baseline)
* Affected Microservices: #e5e5e5 (Platinum gray indicating impacted downstream nodes)
* Background Topology Edges: #24355a (Subtle structural links)
* Root Cause Causal Edges: #fca311 (2px amber highlighted flow)

### 2.3 Typography Colors
* Text Headings & Hero Brand: #ffffff (Maximum contrast)
* Text Secondary & Monospace Telemetry: #e5e5e5 (Crisp readability against Oxford blue)
* Text Muted & Metadata: #e5e5e5/60 (Subtle secondary information)
* Accent Syntax & Agent Thought Codename: #fca311 (Focused amber highlight)

---

## 3. Typography Stack

* Interface Font: Geist Sans (sans-serif, clean legibility at small sizes).
* Monospace Font: Geist Mono (for commit hashes, Cypher queries, millisecond timers, and bash commands).
* Type Scales:
  * Top Bar Title: 13px (medium)
  * Section Header: 11px (semi-bold uppercase, tracking-wider)
  * Node Label: 13px (medium)
  * Monospace Telemetry: 11px (regular)
  * Metadata / Timestamps: 10px (regular)

---

## 4. Reverse Engineered Architectural Patterns

### 4.1 From Skyvern
* DAG Orchestration: Pair `@xyflow/react` with `@dagrejs/dagre` for automatic left-to-right orthogonal node alignment.
* 3-Phase Layout Lifecycle: Nodes stay invisible (`opacity: 0`) during initial Dagre coordinate calculation to prevent layout snapping, then transition smoothly into place.
* Command Palette: Integrated `cmdk` for immediate `Cmd+K` keyboard shortcuts.

### 4.2 From Crawl4AI
* Telemetry Strip: Real-time status bar tracking live FalkorDB connectivity, node counts, relationship counts, and microsecond query latencies.
* Tabular Evidence: Clean layout without card nesting.

### 4.3 From HolmesGPT
* 4-Group Evidence Taxonomy: Clear classification of system components into:
  1. Affected Components (broken invariants, HTTP 504s).
  2. Checked, Healthy Baselines (passing dependencies).
  3. Changed Elsewhere (unrelated deployments and cron jobs).
  4. Not Checked (isolated subsystems).

---

## 5. Screen Layout Contract

* Header (44px): Brand identifier, active incident title, FalkorDB connection status, live graph statistics, and Command Palette trigger.
* Main Viewport (Split Pane):
  * Left (65% width): Causal DAG canvas with interactive node inspection and status highlights.
  * Right (35% width): Evidence Drawer with HolmesGPT taxonomy, FalkorDB Cypher viewer, and 1-Click Remediation trigger.
* Bottom Toolbar (56px): Temporal Incident Scrubber with milestone markers from T-15m to T+0m, replaying graph state as the failure propagates.
