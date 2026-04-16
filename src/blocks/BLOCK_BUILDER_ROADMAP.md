# Block Builder Roadmap

> Execution target: Sonnet agent. Read this whole document before touching code. Every file path is absolute from the repo root. All new CSS must live in `<style>{`...`}</style>` tags inside the component (no CSS files, no Tailwind, no CSS modules). Never use hardcoded colors; always use the design tokens (`--accent`, `--bg`, etc.). Do not add `console.log` or install npm packages.

## Summary of findings

The LandIt block builder is a React/TypeScript editor composed of three main panels (BlockList, ConfigPanel, BlockRenderer) driven by a `useReducer`-based `EditorState`. It is functional but has four confirmed UX bugs (scroll, re-click behavior, auto-select on add/duplicate, missing edit icon) and needs a coherent set of improvements: hidden-block rendering with overlay in preview, a starred-colors palette in the color picker, a curated 10-font picker with live preview and real `@import` loading, improved field spacing with logical section separators, add/remove/reorder/hide animations in the block list, subtle entrance animations in the preview, a less aggressive library slide-in, and a block-by-block audit fixing i18n-key leftovers in `hero`, `header`, `footer` plus several missing configs (countdown timezone, contact form button polish, logo strip pause-on-hover, embed aspect ratio, floating button offsets). All required changes are local to `front/src/blocks/**` and `front/src/pages/dashboard/EditorPage.tsx`; no backend changes.

---

## Phase 1 — Bug fixes (do first, no new features)

### 1.1 Block list not scrollable

**Files:**
- `front/src/blocks/BlockList.tsx`
- `front/src/pages/dashboard/EditorPage.tsx` (verify only; should be fine)

**Problem:**
`.blk-list-wrap` uses `display: flex; flex-direction: column; overflow: hidden;` but never receives `flex: 1` or `height: 100%` from its parent. In `EditorPage.tsx`, `.admin-panel-body` is `flex: 1; display: flex; flex-direction: column`, so `.blk-list-wrap` is rendered as a single flex child but does not itself take `flex: 1` nor `min-height: 0`. The `.blk-list-items` child sets `overflow-y: auto; flex: 1;` but cannot scroll because the parent chain has no constrained height.

**Fix:**
In `BlockList.tsx`, change the `.blk-list-wrap` CSS rule:

Before:
```css
.blk-list-wrap { display: flex; flex-direction: column; overflow: hidden; }
```

After:
```css
.blk-list-wrap { display: flex; flex-direction: column; overflow: hidden; flex: 1; min-height: 0; height: 100%; }
.blk-list-header { flex-shrink: 0; }
.blk-list-items { overflow-y: auto; overflow-x: hidden; padding: 4px 8px 8px; flex: 1 1 auto; min-height: 0; }
```

The `min-height: 0` on the wrap and on `.blk-list-items` is mandatory: without it, flex children default to `min-height: auto` which prevents `overflow: auto` from activating. `flex: 1 1 auto` + `min-height: 0` is the canonical flex-overflow pattern.

---

### 1.2 Clicking an already-selected block does not switch tabs

**Files:**
- `front/src/pages/dashboard/EditorPage.tsx`

**Problem:**
The effect that switches the admin tab to `config` fires on `state.selectedBlockId` change only:
```tsx
useEffect(() => {
  if (state.selectedBlockId) setAdminTab('config');
}, [state.selectedBlockId]);
```
If a block is already selected and the user clicks it again, React's dispatch is a no-op at the state level (reducer `SELECT` returns a new object but `selectedBlockId` is identical), so the effect does not re-fire.

**Fix:**
Bypass the reducer/effect dance for re-clicks. Pass an explicit `onSelect` callback from `EditorPage` into `BlockList` that always sets the tab, regardless of whether selection changed.

Step 1: In `EditorPage.tsx`, create a handler above the JSX:
```tsx
function handleSelectBlock(blockId: string) {
  dispatch({ type: 'SELECT', payload: { blockId } });
  setAdminTab('config');
}
```

Step 2: Remove the existing `useEffect` on `state.selectedBlockId` entirely (lines 38–40).

Step 3: Pass `handleSelectBlock` to `BlockList`:
```tsx
<BlockList
  state={state}
  dispatch={dispatch}
  onAddBlock={() => dispatch({ type: 'SET_LIBRARY_OPEN', payload: true })}
  onSelectBlock={handleSelectBlock}
/>
```

Step 4: In `BlockList.tsx`, add `onSelectBlock: (id: string) => void` to `BlockListProps`, and in the `map(...)` callback change:
```tsx
onSelect={() => dispatch({ type: 'SELECT', payload: { blockId: block.id } })}
```
to:
```tsx
onSelect={() => onSelectBlock(block.id)}
```

Do the same plumbing for the new pencil/edit icon in bug 1.4.

---

### 1.3 ADD_BLOCK and DUPLICATE_BLOCK auto-select new block (unwanted)

**Files:**
- `front/src/blocks/editorReducer.ts`

**Problem:**
`ADD_BLOCK` sets `selectedBlockId: action.payload.id`; `DUPLICATE_BLOCK` sets `selectedBlockId: clone.id`. The user does NOT want the config tab to snap open when adding or duplicating.

**Fix:**
Remove the `selectedBlockId` assignment from both cases. Preserve the current selection.

Before (`ADD_BLOCK`):
```ts
case 'ADD_BLOCK':
  return {
    ...state,
    blocks: [...state.blocks, action.payload],
    selectedBlockId: action.payload.id,
    dirty: true,
  };
```

After:
```ts
case 'ADD_BLOCK':
  return {
    ...state,
    blocks: [...state.blocks, action.payload],
    dirty: true,
  };
```

Before (`DUPLICATE_BLOCK` last line):
```ts
return { ...state, blocks, selectedBlockId: clone.id, dirty: true };
```

After:
```ts
return { ...state, blocks, dirty: true };
```

Note: this interacts with bug 1.2. Since neither add nor duplicate now changes `selectedBlockId`, any remaining effect hooks that depend on `selectedBlockId` will not misfire. This is correct.

---

### 1.4 No pencil/edit icon on block rows

**Files:**
- `front/src/blocks/BlockList.tsx`

**Problem:**
`BlockRow` shows toggle-visibility, duplicate, and delete actions, but there is no explicit "edit" affordance. The user wants a pencil icon that both selects the block AND switches to the config tab (same semantics as clicking the row itself should have per bug 1.2).

**Fix:**
Add a pencil button to `.blk-row-actions`, placed first in the action group (before the eye icon). The button calls `onEdit` which wraps `onSelectBlock(block.id)`.

Step 1: Add `onEdit: () => void` to `BlockRow`'s props type.

Step 2: Insert this button JSX at the top of `.blk-row-actions`, before the visibility toggle button:
```tsx
<button className="blk-row-btn" title="Editar" onClick={e => { e.stopPropagation(); onEdit(); }}>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
  </svg>
</button>
```

Step 3: In the `.map` in `BlockList`, wire `onEdit={() => onSelectBlock(block.id)}`.

Step 4: Make `.blk-row-actions` always visible on selected rows (it already is), and make the pencil button visible on hover the same way the others are. No CSS changes needed.

Also: since clicking the row background already selects+switches-to-config (bug 1.2 fix), the pencil is slightly redundant but still required per spec. Position order in actions: pencil → eye → duplicate → delete.

---

## Phase 2 — Core UX improvements

### 2.1 Hidden blocks rendered in preview with dark overlay + badge (feature A)

**Files:**
- `front/src/blocks/BlockRenderer.tsx`

**Implementation:**
Instead of `const visible = blocks.filter(b => b.visible);`, render all blocks but wrap hidden ones in an editor-only wrapper.

Full replacement for the `return` block in `BlockRenderer.tsx`:
```tsx
return (
  <div data-br-scope={scopeId}>
    <style>{themeToScopedVars(theme, scopeId)}</style>
    <style>{`
      .br-hidden-wrap { position: relative; }
      .br-hidden-wrap::before {
        content: ''; position: absolute; inset: 0;
        background: rgba(0,0,0,.55);
        z-index: 2; pointer-events: none;
        transition: background .2s var(--ease-out);
      }
      .br-hidden-badge {
        position: absolute; top: 10px; right: 10px; z-index: 3;
        background: rgba(0,0,0,.75); color: #fff;
        font-family: var(--font-display); font-weight: 700;
        font-size: .62rem; letter-spacing: .08em; text-transform: uppercase;
        padding: 5px 10px; border-radius: var(--radius-full);
        display: inline-flex; align-items: center; gap: 6px;
        pointer-events: none;
      }
      .br-hidden-badge svg { width: 12px; height: 12px; }
    `}</style>
    {blocks.map(block => {
      const def = getBlock(block.type);
      if (!def) return <MissingBlock key={block.id} type={block.type} />;
      const { Component } = def;
      const inner = (
        <Component
          blockId={block.id}
          config={block.config as never}
          mobileConfig={block.mobile_config as never}
          viewport={viewport}
        />
      );
      if (!block.visible) {
        return (
          <div key={block.id} className="br-hidden-wrap">
            <span className="br-hidden-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              Oculto
            </span>
            {inner}
          </div>
        );
      }
      return <div key={block.id}>{inner}</div>;
    })}
  </div>
);
```

**Important:** This is editor-only behavior. The public renderer used in `PublicLandingPage` is a different render path — confirm by searching for `BlockRenderer` imports. If `BlockRenderer` is used by the public page too, add a prop `editorMode?: boolean` (default `false`) and only render the overlay/badge when `editorMode === true`. Then in `EditorPage.tsx` pass `editorMode` when calling `<BlockRenderer ... editorMode />`.

---

### 2.2 Color picker — starred/favorites palette (feature B)

**Files:**
- `front/src/blocks/controls/ColorPicker.tsx`

**Implementation:**

Store favorites under `localStorage` key `landit-fav-colors` as a JSON array of hex strings. Cap at 8 entries. FIFO when exceeded (oldest first out).

Add a `useState` hydrated from `localStorage` and a helper to persist:

```tsx
import { useState, useEffect, useCallback } from 'react';

const FAV_KEY = 'landit-fav-colors';
function loadFavs(): string[] {
  try { const raw = localStorage.getItem(FAV_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveFavs(favs: string[]): void {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch {}
}
```

Inside `ColorPicker`:
```tsx
const [favs, setFavs] = useState<string[]>(() => loadFavs());
// Sync across ColorPicker instances on the page
useEffect(() => {
  const handler = (e: StorageEvent) => { if (e.key === FAV_KEY) setFavs(loadFavs()); };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}, []);
function star() {
  if (!value || favs.includes(value)) return;
  const next = [value, ...favs].slice(0, 8);
  setFavs(next); saveFavs(next);
}
function removeFav(c: string) {
  const next = favs.filter(f => f !== c);
  setFavs(next); saveFavs(next);
}
const isStarred = favs.includes(value);
```

JSX changes: add a star button next to the hex input, and render the favorites row below `.ctrl-color-row`. Right-click or a long press (500ms) removes.

Append to the existing `<style>` block:
```css
.ctrl-color-star { background: none; border: none; cursor: pointer; padding: 6px; color: var(--text-muted); display: flex; align-items: center; border-radius: 8px; transition: color .15s, background .15s; }
.ctrl-color-star:hover { color: var(--accent); background: var(--accent-subtle); }
.ctrl-color-star.on { color: var(--accent); }
.ctrl-color-favs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.ctrl-color-fav { width: 22px; height: 22px; border-radius: 6px; border: 1.5px solid var(--border-strong); cursor: pointer; padding: 0; transition: transform .12s var(--ease-out), box-shadow .12s; }
.ctrl-color-fav:hover { transform: scale(1.12); box-shadow: var(--shadow-sm); }
```

Inside `.ctrl-color-row` after the hex input, add:
```tsx
<button type="button" className={`ctrl-color-star${isStarred ? ' on' : ''}`} title={isStarred ? 'Ya guardado' : 'Guardar color'} onClick={star}>
  <svg width="16" height="16" viewBox="0 0 24 24" fill={isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
</button>
```

After `.ctrl-color-row` add:
```tsx
{favs.length > 0 && (
  <div className="ctrl-color-favs">
    {favs.map(c => (
      <button
        key={c}
        type="button"
        className="ctrl-color-fav"
        title={`${c} (click derecho para quitar)`}
        style={{ background: c }}
        onClick={() => onChange(c)}
        onContextMenu={e => { e.preventDefault(); removeFav(c); }}
      />
    ))}
  </div>
)}
```

No long-press implementation required beyond `onContextMenu` — the spec says "long-pressing or right-clicking"; right-click covers desktop and long-press on touch devices natively fires a contextmenu event in most browsers.

---

### 2.3 Curated 10-font picker with live preview and loader (feature C)

**Files:**
- `front/src/blocks/types.ts` (no change — `FontField.options` already supported)
- `front/src/blocks/editorReducer.ts` (update INITIAL_STATE theme)
- `front/src/blocks/controls/renderControl.tsx` (replace SelectField fallback with new `FontField` component)
- `front/src/blocks/controls/FontField.tsx` (new file)
- `front/src/blocks/BlockRenderer.tsx` (inject `<link>` tags for fonts used)

**Curated list (use exactly these 10 Google Fonts):**
```ts
export const CURATED_FONTS: { value: string; label: string; stack: string; weights: string }[] = [
  { value: 'Inter',               label: 'Inter',               stack: "'Inter', sans-serif",               weights: '400;500;600;700' },
  { value: 'Plus Jakarta Sans',   label: 'Plus Jakarta Sans',   stack: "'Plus Jakarta Sans', sans-serif",   weights: '400;500;600;700;800' },
  { value: 'Outfit',              label: 'Outfit',              stack: "'Outfit', sans-serif",              weights: '400;500;600;700' },
  { value: 'Bricolage Grotesque', label: 'Bricolage Grotesque', stack: "'Bricolage Grotesque', sans-serif", weights: '400;500;600;700;800' },
  { value: 'Space Grotesk',       label: 'Space Grotesk',       stack: "'Space Grotesk', sans-serif",       weights: '400;500;600;700' },
  { value: 'Manrope',             label: 'Manrope',             stack: "'Manrope', sans-serif",             weights: '400;500;600;700;800' },
  { value: 'DM Sans',             label: 'DM Sans',             stack: "'DM Sans', sans-serif",             weights: '400;500;600;700' },
  { value: 'Syne',                label: 'Syne',                stack: "'Syne', sans-serif",                weights: '400;500;600;700;800' },
  { value: 'Raleway',             label: 'Raleway',             stack: "'Raleway', sans-serif",             weights: '400;500;600;700;800' },
  { value: 'Fraunces',            label: 'Fraunces',            stack: "'Fraunces', serif",                 weights: '400;500;600;700' },
];
```

Place this list in a new file `front/src/blocks/controls/fonts.ts` and export `CURATED_FONTS` and a helper `buildFontLink(families: string[]): string`:
```ts
export function buildFontLink(families: string[]): string {
  const unique = Array.from(new Set(families)).map(name => {
    const f = CURATED_FONTS.find(x => x.value === name);
    if (!f) return null;
    return `family=${encodeURIComponent(name).replace(/%20/g, '+')}:wght@${f.weights}`;
  }).filter(Boolean).join('&');
  return `https://fonts.googleapis.com/css2?${unique}&display=swap`;
}
```

**New file `front/src/blocks/controls/FontField.tsx`:**
```tsx
import { useEffect } from 'react';
import { CURATED_FONTS, buildFontLink } from './fonts';

interface FontFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  description?: string;
}

// Load ALL curated fonts once when any FontField mounts, so previews render correctly.
let injected = false;
function ensureAllFontsLoaded() {
  if (injected) return;
  injected = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = buildFontLink(CURATED_FONTS.map(f => f.value));
  link.dataset.landitFonts = 'preview';
  document.head.appendChild(link);
}

export default function FontField({ label, value, onChange, description }: FontFieldProps) {
  useEffect(() => { ensureAllFontsLoaded(); }, []);
  return (
    <div className="ctrl-font-wrap">
      <style>{`
        .ctrl-font-wrap { margin-bottom: 14px; }
        .ctrl-label { display: block; font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 5px; }
        .ctrl-desc { font-size: .7rem; color: var(--text-muted); margin-bottom: 5px; line-height: 1.4; }
        .ctrl-font-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .ctrl-font-opt { padding: 10px 12px; border: 1.5px solid var(--border-strong); background: var(--bg); border-radius: 10px; cursor: pointer; transition: all .15s var(--ease-out); text-align: left; font-size: 1rem; color: var(--text); }
        .ctrl-font-opt:hover { border-color: var(--accent); background: var(--accent-subtle); }
        .ctrl-font-opt.active { border-color: var(--accent); background: var(--accent-subtle); box-shadow: var(--shadow-sm); }
        .ctrl-font-opt-name { display: block; font-size: .62rem; color: var(--text-muted); font-family: var(--font-display); letter-spacing: .06em; text-transform: uppercase; margin-top: 4px; }
      `}</style>
      <label className="ctrl-label">{label}</label>
      {description && <p className="ctrl-desc">{description}</p>}
      <div className="ctrl-font-grid">
        {CURATED_FONTS.map(f => (
          <button
            key={f.value}
            type="button"
            className={`ctrl-font-opt${value === f.value ? ' active' : ''}`}
            style={{ fontFamily: f.stack, fontWeight: 600 }}
            onClick={() => onChange(f.value)}
          >
            {f.label}
            <span className="ctrl-font-opt-name">{f.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Update `renderControl.tsx`:**
Replace the existing `case 'font':` block with:
```tsx
case 'font':
  return <FontField {...base} value={(value as string) ?? ''} onChange={onChange as (v: string) => void} />;
```
Add the import `import FontField from './FontField';` at the top.

**Update `editorReducer.ts` INITIAL_STATE theme:**
Change:
```ts
theme: { accent: '#0057ff', bg: '#ffffff', text: '#111111', font_display: 'Syne', font_body: 'DM Sans' },
```
Keep the same defaults (Syne + DM Sans are both in the curated list) — no change needed to values, but confirm both strings are present in the curated list.

**Update `BlockRenderer.tsx`:**
Inject a single `<link>` inside the scope for the currently-selected display/body fonts so the preview renders with real fonts loaded (not just the editor). Add near the scope style injection:

```tsx
import { buildFontLink, CURATED_FONTS } from './controls/fonts';

// in the component body, before return:
const fontsToLoad = [theme.font_display, theme.font_body].filter(f =>
  CURATED_FONTS.some(c => c.value === f),
);
```

Render (inside the returned tree, next to the existing `<style>`):
```tsx
{fontsToLoad.length > 0 && (
  <link rel="stylesheet" href={buildFontLink(fontsToLoad)} />
)}
```

React does permit `<link>` in tree; it will be hoisted. If hoisting flicks, move to an imperative `useEffect` that injects a `<link>` into `document.head` and cleans up on unmount.

---

### 2.4 ConfigPanel — section separators and spacing (feature D)

**Files:**
- `front/src/blocks/types.ts`
- `front/src/blocks/ConfigPanel.tsx`
- Every block file in `front/src/blocks/blocks/*.tsx` (add `section` on fields per Phase 4.3)

**Approach (chosen): add an optional `section` property to `ConfigFieldSchema`.**
This is cleaner than inferring by kind because:
- Blocks like `hero` have text AND images in "Contenido" but also text (`min_height: '80vh'`) that is stylistic.
- Kind-based inference would misclassify fields.
- Opt-in means existing blocks with ≤5 fields need no changes and keep the flat layout.

**Step 1 — types.ts:** Add `section?: string` to `ConfigFieldBase`:
```ts
interface ConfigFieldBase {
  key: string;
  label: string;
  kind: ConfigFieldKind;
  description?: string;
  section?: string; // Optional logical group. Rendered as a section header in ConfigPanel.
}
```

**Step 2 — standard section names (Spanish, reuse these verbatim across all blocks):**
- `'Contenido'`
- `'Estilo'`
- `'Espaciado'`
- `'Avanzado'`
- For specific blocks only: `'Botones'` (hero/cta_banner), `'Navegación'` (header/footer), `'Barra de anuncio'` (header), `'Multimedia de fondo'` (hero), `'Boletín'` (footer), `'Redes sociales'` (footer), `'Cuenta regresiva'` (countdown/announcement_bar), `'Móvil'` (header mobile options).

**Step 3 — ConfigPanel.tsx:** Replace the `.cfg-fields` render with section-aware logic.

Replace the existing render block:
```tsx
<div className="cfg-fields">
  {schema.map(field =>
    renderControl(field, config[field.key], value => onChange(field.key, value), websiteId)
  )}
</div>
```

With:
```tsx
<div className="cfg-fields">
  {(() => {
    // Group consecutive fields by section. Fields with no section render as "Sin grupo" (no header).
    const sections: { name: string | null; fields: typeof schema }[] = [];
    let currentName: string | null = null;
    let currentFields: typeof schema = [];
    for (const f of schema) {
      const s = f.section ?? null;
      if (s !== currentName) {
        if (currentFields.length) sections.push({ name: currentName, fields: currentFields });
        currentName = s;
        currentFields = [f];
      } else {
        currentFields.push(f);
      }
    }
    if (currentFields.length) sections.push({ name: currentName, fields: currentFields });
    // If schema has 5 or fewer fields total and only one section (or none), render flat without headers.
    const hasMultipleSections = sections.filter(s => s.name).length >= 2;
    const shouldShowHeaders = schema.length > 5 && hasMultipleSections;
    return sections.map((sec, i) => (
      <div key={sec.name ?? `_nogroup_${i}`} className="cfg-section">
        {shouldShowHeaders && sec.name && (
          <div className="cfg-section-header">
            <span className="cfg-section-label">{sec.name}</span>
            <span className="cfg-section-line" />
          </div>
        )}
        {sec.fields.map(field =>
          renderControl(field, config[field.key], value => onChange(field.key, value), websiteId)
        )}
      </div>
    ));
  })()}
</div>
```

Update the panel `<style>` — replace the `.cfg-fields` rule with:
```css
.cfg-fields { flex: 1; overflow-y: auto; padding: 20px 16px 40px; display: flex; flex-direction: column; gap: 20px; }
.cfg-section { display: flex; flex-direction: column; gap: 20px; }
.cfg-section-header { display: flex; align-items: center; gap: 10px; margin-top: 28px; }
.cfg-section:first-child .cfg-section-header { margin-top: 0; }
.cfg-section-label { font-size: .68rem; font-family: var(--font-display); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); white-space: nowrap; }
.cfg-section-line { flex: 1; height: 1px; background: var(--border); }
```

**Note:** Each individual control still has its own `margin-bottom: 14px`. Override to `0` within sections so the `gap: 20px` on `.cfg-section` drives spacing cleanly. Add this rule:
```css
.cfg-section > .ctrl-text-wrap,
.cfg-section > .ctrl-textarea-wrap,
.cfg-section > .ctrl-num-wrap,
.cfg-section > .ctrl-toggle-wrap,
.cfg-section > .ctrl-select-wrap,
.cfg-section > .ctrl-color-wrap,
.cfg-section > .ctrl-img-wrap,
.cfg-section > .ctrl-url-wrap,
.cfg-section > .ctrl-spacing-wrap,
.cfg-section > .ctrl-rep-wrap,
.cfg-section > .ctrl-font-wrap { margin-bottom: 0; }
```

Per-block `section` assignments are listed in Phase 4.3.

---

## Phase 3 — Visual polish & animations

### 3.1 Block list — add/duplicate/delete/hide animations (feature E)

**Files:**
- `front/src/blocks/BlockList.tsx`

**Implementation:**

**3.1.a Enter animation (add + duplicate):**
Use CSS animation on mount. React re-mounts the row with its unique `block.id` as key, so a CSS `@keyframes` on `.blk-row` fires automatically on mount.

Append to the existing `.blk-row`-scoped `<style>` block:
```css
@keyframes blk-row-enter {
  from { transform: translateX(-8px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
.blk-row { animation: blk-row-enter .2s var(--ease-out); }
```

**3.1.b Exit animation (delete):**
Plain React rendering removes the DOM node immediately; we need to delay the reducer dispatch until the CSS exit finishes.

In `BlockRow`, add local exit state:
```tsx
const [exiting, setExiting] = useState(false);
function requestDelete() {
  setExiting(true);
  setTimeout(() => onDelete(), 180); // must be <= animation duration
}
```
Change the delete button's `onClick={...onDelete()}` to `onClick={e => { e.stopPropagation(); requestDelete(); }}`.

Toggle a class:
```tsx
className={`blk-row${selected ? ' selected' : ''}${!block.visible ? ' hidden' : ''}${exiting ? ' exiting' : ''}`}
```

CSS:
```css
@keyframes blk-row-exit {
  from { transform: scale(1); opacity: 1; }
  to   { transform: scale(.92); opacity: 0; }
}
.blk-row.exiting { animation: blk-row-exit .18s var(--ease-out) forwards; pointer-events: none; }
```

**3.1.c Hide animation (visibility toggle):**
`.blk-row.hidden` already has `opacity: .45`. Add smooth transition and a slight background tint:
```css
.blk-row { transition: opacity .2s var(--ease-out), background .2s var(--ease-out), border-color .12s, box-shadow .12s; }
.blk-row.hidden { background: var(--bg-alt); }
```
Keep existing `.blk-row.hidden { opacity: .45; }`.

**3.1.d Drop indicator always visible during drag:**
The current CSS gates the indicator behind `display: var(--dnd-indicator, none)`. `useListDnd` sets `--dnd-indicator: 'block'` on dragover. Ensure the `::before`/`::after` lines have adequate visibility by bumping height to `3px` and adding a pulse:
```css
.blk-row[style*="top"]::before,
.blk-row[style*="bottom"]::after {
  height: 3px;
  box-shadow: 0 0 0 2px var(--accent-glow);
}
```
No logic change required; just visual reinforcement. Verify `useListDnd.ts` sets `style="--dnd-indicator: block"` and a `top`/`bottom` inline style attribute on the row during dragover.

---

### 3.2 Preview animations (feature F)

**Files:**
- `front/src/blocks/BlockRenderer.tsx`
- `front/src/pages/dashboard/EditorPage.tsx`

**3.2.a Block entrance in preview:**
Inside `BlockRenderer`, wrap each block in a `<div>` with an entrance animation. Since blocks use `block.id` as key, remount fires the animation on add.

Add to `BlockRenderer.tsx` `<style>`:
```css
@keyframes br-block-enter {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
[data-br-scope] > div { animation: br-block-enter .25s var(--ease-out); }
```

Caveat: this applies to the hidden-wrap div from 2.1 too, which is correct.

**3.2.b Viewport switch transition:**
In `EditorPage.tsx`, replace the `.preview-frame.mobile { max-width: 390px; ... }` rule to include a transition. Update the base `.preview-frame`:
```css
.preview-frame {
  width: 100%;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.06);
  min-height: 400px;
  transition: max-width .3s var(--ease-out), border-radius .3s var(--ease-out), box-shadow .3s var(--ease-out);
}
```

---

### 3.3 Block library — refined slide-in + checkmark on add (feature G)

**Files:**
- `front/src/blocks/BlockLibrary.tsx`

**3.3.a Refined slide-in:**
Replace the existing `@keyframes lib-slide-in`:
```css
@keyframes lib-slide-in {
  from { transform: translateX(-20px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
```
Keep duration at `.2s var(--ease-out)` on `.lib-panel`. The overlay fade can also use `animation: lib-overlay-fade .2s var(--ease-out);` with a `from { opacity: 0 } to { opacity: 1 }` keyframe for smoothness.

**3.3.b Checkmark on add:**
Convert `BlockCard` to have a short confirmation state:
```tsx
function BlockCard({ def, onAdd }: { def: BlockDefinition; onAdd: () => void }) {
  const [confirming, setConfirming] = useState(false);
  function handle() {
    if (confirming) return;
    setConfirming(true);
    setTimeout(() => onAdd(), 220);
  }
  return (
    <div className={`lib-block-card${confirming ? ' confirming' : ''}`} onClick={handle}>
      {/* existing icon, info, and add-icon markup */}
      <svg className="lib-add-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        {confirming
          ? <polyline points="20 6 9 17 4 12"/>
          : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>
        }
      </svg>
    </div>
  );
}
```
Add CSS:
```css
.lib-block-card.confirming { background: var(--accent-subtle); border-color: var(--accent); }
.lib-block-card.confirming .lib-add-icon { opacity: 1; color: var(--accent); animation: lib-check-pop .22s var(--ease-spring); }
@keyframes lib-check-pop { 0% { transform: scale(.6); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
```
Remember: `setState` import needed — add `import { useState } from 'react';` (already imported at top of the file).

Note: since `ADD_BLOCK` no longer auto-selects (bug 1.3), the library flow is: click card → checkmark flashes → 220ms → `onAdd` dispatches `ADD_BLOCK` and calls `onClose`. The user stays on the Blocks tab with the new block visible.

---

## Phase 4 — Block audit findings

### 4.1 Naming standardization (i18n keys → plain Spanish)

Three block files currently use i18n keys for `label`/`description`. The builder itself is Spanish-only (per CLAUDE.md: "i18n is on frontend landing only, not the builder"). Standardize all to plain Spanish strings.

| File | Current `label` | Current `description` | Corrected `label` | Corrected `description` |
|---|---|---|---|---|
| `front/src/blocks/blocks/header.tsx` | `'blocks.header.label'` | `'blocks.header.description'` | `'Encabezado'` | `'Barra superior con logo, navegación, búsqueda y barra de anuncio opcional.'` |
| `front/src/blocks/blocks/footer.tsx` | `'blocks.footer.label'` | `'blocks.footer.description'` | `'Pie de página'` | `'Pie con logo, columnas de enlaces, redes sociales y suscripción al boletín.'` |
| `front/src/blocks/blocks/hero.tsx` | `'blocks.hero.label'` | `'blocks.hero.description'` | `'Hero'` | `'Sección principal con título, subtítulo, botones de acción y fondo multimedia opcional.'` |

All other blocks already use plain Spanish — no changes.

Also update the comment in `types.ts` on `BlockDefinition.label`/`description` from `// i18n key` to `// Plain Spanish string (builder is Spanish-only)`.

---

### 4.2 Missing config fields

For each block below, add the listed fields to the `defaultConfig`, the `schema`, and (when a `Component` reads them) the component logic. Use the design tokens for any default colors.

| Block | Missing field | Field kind | Suggested default | Notes |
|---|---|---|---|---|
| `countdown` | `timezone` | `select` | `'local'` | Options: `local`, `America/Argentina/Buenos_Aires`, `America/Mexico_City`, `America/Santiago`, `America/Bogota`, `America/Lima`, `UTC`. Used when parsing `target` so different regions don't mis-target. |
| `countdown` | `show_labels` | `toggle` | `true` | Whether to render `Días / Horas / Min / Seg` below digits. |
| `announcement_bar` | `dismissible` | `toggle` | `false` | Adds an `×` to close per session (use `sessionStorage`). |
| `announcement_bar` | `sticky` | `toggle` | `true` | If false, bar scrolls with page. |
| `contact_form` | `submit_loading_label` | `text` | `'Enviando…'` | Shown while the request is in flight. |
| `contact_form` | `redirect_url` | `url` | `''` | If set, redirect on success instead of showing `success_message`. |
| `logo_strip` | `pause_on_hover` | `toggle` | `true` | Pause marquee when hovered. |
| `logo_strip` | `direction` | `select` | `'left'` | Options: `left`, `right`. |
| `embed` | `aspect_ratio` | `select` | `'16x9'` | Options: `'free'` (uses `height`), `'16x9'`, `'4x3'`, `'1x1'`, `'21x9'`. Overrides `height` when not `'free'`. |
| `embed` | `allow_fullscreen` | `toggle` | `true` | Adds `allowfullscreen` to the iframe. |
| `floating_button` | `offset_x` | `number` (min 8, max 80, step 4) | `20` | px offset from the chosen edge. |
| `floating_button` | `offset_y` | `number` (min 8, max 120, step 4) | `24` | px offset from bottom. |
| `floating_button` | `size` | `select` | `'md'` | Options: `sm`, `md`, `lg`. Changes the button diameter (48/56/64 px). |
| `floating_button` | `show_label_on_desktop` | `toggle` | `false` | If true, renders the tooltip/label inline next to the icon. |
| `footer` | `show_logo` | `toggle` | `true` | Allow hiding logo independently from brand name. |
| `footer` | `newsletter_success_message` | `text` | `'¡Gracias por suscribirte!'` | Currently unconfigurable. |
| `hero` | `eyebrow_color` | `color` | `'#0057ff'` (accent) | Eyebrow uses accent hardcoded; make it configurable. |
| `hero` | `cta_style` | `select` | `'solid'` | Options: `solid`, `outline`, `ghost`. Drives button styling for both CTAs. |
| `cta_banner` | `alignment` | `select` | `'center'` | Options: `left`, `center`, `right`. Aligns title/description/buttons. |
| `cta_banner` | `cta_style` | `select` | `'solid'` | Matches hero. |
| `divider` | `width_unit` | `select` | `'percent'` | Options: `'percent'`, `'px'`. Replaces free-text `width`. (Optional refactor.) |
| `divider` | `thickness` | `number` (min 1, max 20, step 1) | `1` | px line thickness. |
| `text_image` | `image_width` | `select` | `'50'` | Options: `40`, `50`, `60` (% of row). |
| `text_image` | `image_rounded` | `toggle` | `true` | Apply `border-radius`. |
| `video_block` | `aspect_ratio` | `select` | `'16x9'` | Same options as `embed`. |
| `video_block` | `show_controls` | `toggle` | `true` | For self-hosted (`<video controls>`). |
| `feature_grid` | `icon_style` | `select` | `'emoji'` | Options: `emoji`, `circle` (icon in colored circle), `square`. Visual bump. |
| `feature_list` | `image_position` | `select` | `'alternating'` | Options: `alternating`, `left-always`, `right-always`. |
| `stats` | `columns` | `select` | `'auto'` | Options: `auto`, `2`, `3`, `4`. |
| `testimonials` | `layout` | `select` | `'grid'` | Options: `grid`, `carousel`, `masonry`. |
| `pricing_table` | `highlight_featured` | `toggle` | `true` | Whether featured tier gets elevated styling. |
| `pricing_table` | `billing_toggle` | `toggle` | `false` | Show monthly/yearly toggle (requires `price_yearly_usd` per tier — future). |
| `faq` | `open_first` | `toggle` | `true` | Open the first question by default. |
| `faq` | `allow_multiple_open` | `toggle` | `false` | If false, behaves like accordion. |
| `heading` | `max_width` | `text` | `'720px'` | For constraining line length. |
| `spacer` | (sufficient) | — | — | Keep as is. |
| `image_block` | `shadow` | `toggle` | `false` | Apply `var(--shadow-lg)`. |
| `steps` | `layout` | `select` | `'vertical'` | Options: `vertical`, `horizontal`. |
| `steps` | `numbered` | `toggle` | `true` | Hide numbers for a cleaner look. |
| `header` | `transparent_on_top` | `toggle` | `false` | Transparent when scroll=0, solid after. Useful on hero pages. |

**Defaults quality flagged (needs better placeholder copy/values):**
- `announcement_bar.countdown_target` default is empty — set to an ISO string 7 days ahead via a helper: `new Date(Date.now() + 7*86400000).toISOString().slice(0,16)`.
- `contact_form.fields` should default to 3 sample fields: `Nombre / Email / Mensaje` with `Mensaje` as `textarea` (if not already — verify in `contact_form.tsx` defaultConfig and correct).
- `feature_grid.items` should default to at least 3 items with real-looking placeholder copy (e.g. "Rápido / Seguro / Escalable").
- `pricing_table.tiers` should default to 3 tiers (Básico / Pro / Enterprise) with realistic USD prices (9 / 29 / 99).
- `testimonials.items` should default to 2 items so the grid renders a reasonable preview.
- `stats.items` should default to 3 stats with suggestive numbers (+10k / 99% / 24/7).
- `countdown.post_text` default should be `'¡Tiempo agotado!'` instead of empty.
- `floating_button.label` default should be `'¿Necesitás ayuda?'` for WhatsApp.

---

### 4.3 Schema grouping recommendations

Blocks with >5 fields need section assignments. Assign the `section` property on each field per the table. For blocks with ≤5 fields, leave unchanged.

| Block file | Total fields | Section assignments |
|---|---|---|
| `announcement_bar.tsx` | 8 (after 4.2) | `messages`: `'Contenido'`. `bg_color`, `text_color`, `animation`: `'Estilo'`. `countdown_enabled`, `countdown_target`: `'Cuenta regresiva'`. `dismissible`, `sticky`: `'Avanzado'`. |
| `contact_form.tsx` | 9 (after 4.2) | `title`, `description`, `fields`: `'Contenido'`. `submit_label`, `submit_loading_label`, `success_message`, `redirect_url`: `'Formulario'`. `bg_color`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `countdown.tsx` | 10 (after 4.2) | `title`, `target`, `timezone`: `'Contenido'`. `bg_color`, `text_color`, `show_labels`: `'Estilo'`. `post_action`, `post_text`, `post_url`: `'Al expirar'`. `spacing`: `'Espaciado'`. |
| `cta_banner.tsx` | 12 (after 4.2) | `title`, `description`, `alignment`: `'Contenido'`. `primary_cta_label`, `primary_cta_url`, `secondary_cta_label`, `secondary_cta_url`, `cta_style`: `'Botones'`. `bg_color`, `text_color`, `bg_image_url`, `overlay_opacity`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `divider.tsx` | 6 (after 4.2) | `style`, `color`, `thickness`, `width`, `width_unit`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `embed.tsx` | 6 (after 4.2) | `url`, `title`: `'Contenido'`. `aspect_ratio`, `height`, `allow_fullscreen`: `'Visualización'`. `spacing`: `'Espaciado'`. |
| `faq.tsx` | 6 (after 4.2) | `title`, `items`: `'Contenido'`. `open_first`, `allow_multiple_open`: `'Comportamiento'`. `bg_color`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `feature_grid.tsx` | 7 (after 4.2) | `title`, `subtitle`, `items`: `'Contenido'`. `columns`, `icon_style`, `bg_color`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `feature_list.tsx` | 5 (after 4.2) | `title`, `items`: `'Contenido'`. `image_position`, `bg_color`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `floating_button.tsx` | 11 (after 4.2) | `type`, `phone`, `message`, `url`, `label`, `show_label_on_desktop`: `'Contenido'`. `position`, `offset_x`, `offset_y`, `size`, `bg_color`: `'Estilo'`. |
| `footer.tsx` | 13 (after 4.2) | `logo_url`, `show_logo`, `brand_name`, `tagline`, `copyright`: `'Contenido'`. `columns`: `'Navegación'`. `social_links`: `'Redes sociales'`. `newsletter_enabled`, `newsletter_placeholder`, `newsletter_btn_label`, `newsletter_success_message`: `'Boletín'`. `bg_color`, `text_color`: `'Estilo'`. |
| `header.tsx` | ~20 | `logo_url`, `logo_size`, `brand_name`, `brand_name_color`, `brand_name_font`, `brand_image_url`: `'Contenido'`. `nav_links`: `'Navegación'`. `desktop_logo_placement`, `desktop_sticky`, `desktop_search`, `transparent_on_top`: `'Escritorio'`. `mobile_center_logo`, `mobile_search`: `'Móvil'`. `announcement_enabled`, `announcement_bg_color`, `announcement_text_color`, `announcement_animation`, `announcement_messages`: `'Barra de anuncio'`. `bg_color`, `text_color`: `'Estilo'`. |
| `heading.tsx` | 8 (after 4.2) | `text`, `body_text`: `'Contenido'`. `level`, `alignment`, `font_size`, `color`, `max_width`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `hero.tsx` | 16 (after 4.2) | `eyebrow`, `title`, `subtitle`: `'Contenido'`. `primary_cta_label`, `primary_cta_url`, `secondary_cta_label`, `secondary_cta_url`, `cta_style`: `'Botones'`. `media_type`, `media_url`, `overlay_opacity`: `'Multimedia de fondo'`. `alignment`, `bg_color`, `text_color`, `eyebrow_color`, `min_height`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `image_block.tsx` | 8 (after 4.2) | `url`, `alt`, `link`, `caption`: `'Contenido'`. `rounded`, `shadow`, `max_width`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `logo_strip.tsx` | 8 (after 4.2) | `title`, `logos`: `'Contenido'`. `grayscale`, `scroll_speed`, `direction`, `pause_on_hover`, `bg_color`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `pricing_table.tsx` | 7 (after 4.2) | `title`, `subtitle`, `tiers`: `'Contenido'`. `ars_mode`, `billing_toggle`, `highlight_featured`, `bg_color`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `spacer.tsx` | 2 | No sections needed. |
| `stats.tsx` | 5 (after 4.2) | `items`: `'Contenido'`. `columns`, `bg_color`, `text_color`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `steps.tsx` | 7 (after 4.2) | `title`, `subtitle`, `steps`: `'Contenido'`. `layout`, `numbered`, `bg_color`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `testimonials.tsx` | 5 (after 4.2) | `title`, `items`: `'Contenido'`. `layout`, `bg_color`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `text_image.tsx` | 10 (after 4.2) | `title`, `text`, `image_url`: `'Contenido'`. `cta_label`, `cta_url`: `'Botones'`. `image_side`, `image_width`, `image_rounded`, `bg_color`: `'Estilo'`. `spacing`: `'Espaciado'`. |
| `video_block.tsx` | 9 (after 4.2) | `url`, `title`, `poster_url`: `'Contenido'`. `aspect_ratio`, `autoplay`, `loop`, `muted`, `show_controls`: `'Reproducción'`. `spacing`: `'Espaciado'`. |

**Pattern for all edits:** For each field object, add `section: '<name>'`. Keep fields in schema array ordered so all fields of the same section are contiguous — the ConfigPanel grouping logic above walks the schema in order and starts a new section whenever the section name changes.

---

## Execution checklist for Sonnet

Do phases in order. Do not skip Phase 1.

- [ ] 1.1 Fix block list scroll CSS
- [ ] 1.2 Route `onSelectBlock` through `EditorPage`, remove the effect
- [ ] 1.3 Remove `selectedBlockId` writes from `ADD_BLOCK` and `DUPLICATE_BLOCK`
- [ ] 1.4 Add pencil button to `BlockRow`
- [ ] 2.1 Hidden-block overlay in `BlockRenderer` (editor-only mode)
- [ ] 2.2 Star/favorites palette in `ColorPicker`
- [ ] 2.3 Create `fonts.ts` + `FontField.tsx`, wire into `renderControl`, load in `BlockRenderer`
- [ ] 2.4 Add `section` to `ConfigFieldBase`, update `ConfigPanel` grouping logic + CSS
- [ ] 3.1 Block list enter/exit/hide animations + drop indicator polish
- [ ] 3.2 Block entrance in preview + viewport transition
- [ ] 3.3 Library slide-in refinement + checkmark on add
- [ ] 4.1 Replace i18n keys in `header`, `footer`, `hero` with plain Spanish
- [ ] 4.2 Add all missing config fields (and default improvements) per the table
- [ ] 4.3 Add `section` property to fields per the table

After each phase, `npm run build` (from `front/`) to catch TypeScript issues. Do not commit.
