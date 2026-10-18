# Knowledge Review & Approval · Page Override

This page follows the project Master design system with these graph-specific rules:

- The canvas is progressive from L1 to L4: responsibility center → business domain → object → theme → metric. Directory instances are first-class graph nodes, not only navigation controls.
- Selecting an object expands every child theme and every mapped metric on the same canvas. Selecting a theme focuses its metric subgraph while preserving visible cross-theme relations.
- Motion is restrained and functional: nodes fade in by sequence, relationship strokes flow to express direction, and the selected metric receives a subtle focus pulse. Disable all motion under `prefers-reduced-motion`.

- Three-pane desktop workspace: 248px directory tree, flexible graph canvas, 310px details inspector.
- L1–L4 directory hierarchy is the primary navigation and remains independently scrollable.
- Use SVG for the network because each topic contains fewer than 100 nodes.
- Theme-to-metric edges use quiet blue-gray strokes; metric-to-metric relationships use amber dashed directional edges.
- Use a restrained Neo4j-inspired visual language: circular directory, theme, and metric nodes with concentric halos, thin relationship lines, and compact labels inside each node.
- L1/L2 and theme views use deterministic radial layouts. Object views use a deterministic force-directed layout so shared metrics can connect naturally across theme clusters.
- Selected state uses a blue halo, stronger node fill, and high-contrast white labels; related and cross-theme metrics use amber accents.
- Node type, relationship direction and selection must be communicated with labels, shapes and line styles, not color alone.
- Every graph must include a keyboard-accessible relationship list/table as the semantic fallback.
- Clicking a metric updates the details inspector without opening a modal or leaving the graph context.
- Empty directory topics remain visible and show a factual empty state; never fabricate example metrics.
- On tablet, the details inspector moves below the graph. On narrow screens, directory, graph and details stack vertically while the SVG scrolls inside its panel.
