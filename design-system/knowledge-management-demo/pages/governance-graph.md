# Knowledge Review & Approval · Page Override

This page follows the project Master design system with these graph-specific rules:

- The canvas renders the complete descendant hierarchy from the selected directory scope: responsibility center → business domain → object → theme → metric. L1, L2 and L3 selections all include every lower-level instance and mapped metric.
- Responsibility center, business domain, object, theme and metric nodes each use a distinct, accessible color and remain circular.
- Single-clicking any graph node selects it and updates the right-side inspector; graph-node selection never changes the directory scope unexpectedly.
- Motion is restrained and functional: nodes fade in by sequence, relationship strokes flow to express direction, and the selected metric receives a subtle focus pulse. Disable all motion under `prefers-reduced-motion`.

- Three-pane desktop workspace: 248px directory tree, flexible graph canvas, 310px details inspector.
- L1–L4 directory hierarchy is the primary navigation and remains independently scrollable.
- Use the vendored AntV G6 renderer for the network and keep the relationship table as the semantic fallback.
- Theme-to-metric edges use quiet blue-gray strokes; metric-to-metric relationships use amber dashed directional edges.
- Use a restrained Neo4j-inspired visual language: circular directory, theme, and metric nodes with concentric halos, thin relationship lines, and compact labels inside each node.
- Render L1/L2/L3 scopes with G6's force-directed layout so the complete hierarchy can settle into readable clusters; theme views use a concentric layout.
- The graph stage supports pan, wheel/pinch zoom, node dragging, fit-to-view controls, animated layout entry, and direct node selection.
- Selected state uses a blue halo, stronger node fill, and high-contrast white labels; related and cross-theme metrics use amber accents.
- Node type, relationship direction and selection must be communicated with labels, shapes and line styles, not color alone.
- Every graph must include a keyboard-accessible relationship list/table as the semantic fallback.
- Clicking any directory or metric node updates the details inspector without opening a modal or leaving the graph context.
- Empty directory topics remain visible and show a factual empty state; never fabricate example metrics.
- On tablet, the details inspector moves below the graph. On narrow screens, directory, graph and details stack vertically while the SVG scrolls inside its panel.
