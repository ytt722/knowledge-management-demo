# Knowledge Management Demo · Design System

**Direction:** Minimalism & Swiss Style + Data-Dense Dashboard + Fluent 2 + restrained Glassmorphism
**Density:** 8/10 · **Motion:** 2/10 · **Variance:** 3/10

## Design hierarchy

1. **Swiss foundation:** strict 8px spacing rhythm, strong alignment, restrained color, typography-led hierarchy, no decorative clutter.
2. **Data-dense workspace:** compact 36px table headers, 42px rows, sticky headers, tabular numerals, 11–13px operational type.
3. **Fluent 2 behavior:** semantic status colors, clear selected/hover/focus states, 6px controls, 8px cards, consistent icon treatment.
4. **Glass as an accent only:** translucent blur is limited to the global header, sticky navigation layers, menus and modals. Content cards and tables remain opaque.

## Core tokens

| Role | Value |
|---|---|
| Primary | `#2563EB` |
| Primary hover | `#1D4ED8` |
| Primary soft | `#EFF6FF` |
| Canvas | `#F4F6F9` |
| Surface | `#FFFFFF` |
| Foreground | `#172033` |
| Muted text | `#667085` |
| Border | `#DFE4EB` |
| Success | `#08775D` on `#DDF7ED` |
| Warning | `#935B0C` on `#FFF2D7` |
| Danger | `#AE3838` on `#FEE8E7` |
| Control radius | `6px` |
| Card radius | `8px` |
| Overlay radius | `10px` |
| Card shadow | `0 1px 2px rgba(16,24,40,.035)` |
| Overlay shadow | `0 12px 32px rgba(16,36,68,.13)` |

## Typography and spacing

- Font stack: `Inter, PingFang SC, Microsoft YaHei, system-ui, sans-serif`.
- Page title: 22px / 700. Section title: 17px / 700. Card title: 12–13px / 700.
- Body and operational labels: 11–13px. Avoid text below 9px.
- Use 4, 8, 12, 16, 20, 24, 32px spacing increments.
- Use tabular numerals for metrics and tables.

## Component rules

- Cards are opaque white with a 1px border. No glass, gradients or large shadows in data regions.
- Primary buttons are solid blue; secondary buttons are white with a neutral border. Hover must not shift layout.
- Tables use sticky neutral headers, compact rows, subtle hover and a pale-blue selected state.
- Side navigation uses a pale-blue selected fill with a 3px blue rail; icons are consistent line SVGs.
- Status indicators use semantic tinted pills; never rely on color alone when a text label is available.
- Forms use 36px minimum control height on desktop and visible 2px keyboard focus rings.
- Menus, dialogs and sticky bars may use 10–14px blur only when contrast remains readable.

## Responsive rules

- `1440px`: 236px sidebar, 22px page gutters, full data density.
- `1024px`: collapse navigation to 68px icon rail, keep tables horizontally scrollable inside their panel.
- `768px`: stack multi-column workbenches where necessary; preserve key actions above the fold.
- `375px`: 54px icon rail, 10px page gutters, no document-level horizontal overflow, 16px form text where needed to prevent mobile zoom.

## Motion and accessibility

- Interaction transitions: 150–220ms, primarily color/border/opacity.
- Avoid scale and large translate hover effects.
- Respect `prefers-reduced-motion`.
- Maintain WCAG AA contrast, visible focus, semantic labels and minimum 32px desktop / 40px mobile interaction targets.

## Anti-patterns

- No glass cards inside dense content regions.
- No oversized marketing hero, neon glow, excessive gradients or floating decorations.
- No emoji icons, hidden focus states, layout-shifting hover, or low-contrast gray-on-gray text.
- Do not trade scanability for spaciousness: this is an operational SaaS workspace.
