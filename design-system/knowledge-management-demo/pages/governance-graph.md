# Knowledge Review & Approval · Page Override

This page follows the project Master design system with these graph-specific rules:

- Knowledge review and approval open on their original pending-work queues; no graph is shown before a knowledge set is selected.
- Raw/original knowledge sets retain the list-based review and approval workflow. Structured knowledge sets open the graph workbench.
- The selected structured knowledge set is shown above the graph, and the page always provides a clear return action to its pending-work queue.
- Structured review keeps the directory and graph focused by omitting the directory-helper footer and the collapsed relationship-list explanation; structured approval retains its supporting review context.
- The canvas renders the complete descendant hierarchy from the selected directory scope: responsibility center → business domain → object → theme → metric. L1, L2 and L3 selections all include every lower-level instance and mapped metric.
- Responsibility center, business domain, object, theme and metric nodes each use a distinct, accessible color and remain circular.
- Single-clicking any graph node selects it and updates the right-side inspector; graph-node selection never changes the directory scope unexpectedly.
- Motion is restrained and functional: nodes fade in by sequence, relationship strokes flow to express direction, and the selected metric receives a subtle focus pulse. Disable all motion under `prefers-reduced-motion`.

- Two-column desktop workspace: a compact directory tree and a flexible, visually dominant graph canvas.
- L1–L4 directory hierarchy is the primary navigation and remains independently scrollable.
- Use the vendored AntV G6 renderer for the network and keep the relationship table as the semantic fallback.
- Theme-to-metric edges use quiet blue-gray strokes; metric-to-metric relationships use amber solid directional edges. Every node outline and graph edge remains solid.
- Use a restrained Neo4j-inspired visual language: circular directory, theme, and metric nodes with concentric halos, thin relationship lines, and compact labels inside each node.
- Render L1/L2/L3 scopes with G6's force-directed layout so the complete hierarchy can settle into readable clusters; theme views use a concentric layout.
- The graph stage supports pan, wheel/pinch zoom, node dragging, fit-to-view controls, animated layout entry, and direct node selection.
- Selected state uses a blue halo and stronger emphasis. All metric nodes share one visual style, including cross-theme metrics; relationship edges communicate their linkage.
- Node type, relationship direction and selection must be communicated with labels, shapes and line styles, not color alone.
- Every graph must include a keyboard-accessible relationship list/table as the semantic fallback.
- Clicking any graph node opens a details drawer from the graph stage's right edge without changing the directory scope or pushing content below the graph.
- The inspector drawer overlays the graph, has an explicit close action, supports Escape, and gives its content area independent vertical scrolling for long field sets.
- Empty directory topics remain visible and show a factual empty state; never fabricate example metrics.
- On tablet and narrow screens, the inspector remains an in-canvas overlay and expands to near-full graph width; it never stacks beneath the graph.
