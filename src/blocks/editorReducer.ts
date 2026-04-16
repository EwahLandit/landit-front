import type { EditorState, BlockInstance, Viewport, SiteMeta, Theme } from './types';

export type EditorAction =
  | { type: 'LOAD'; payload: Pick<EditorState, 'site' | 'theme' | 'blocks'> }
  | { type: 'ADD_BLOCK'; payload: BlockInstance }
  | { type: 'REMOVE_BLOCK'; payload: { blockId: string } }
  | { type: 'DUPLICATE_BLOCK'; payload: { blockId: string } }
  | { type: 'UPDATE_BLOCK_CONFIG'; payload: { blockId: string; path: string; value: unknown } }
  | { type: 'UPDATE_BLOCK_MOBILE_CONFIG'; payload: { blockId: string; path: string; value: unknown } }
  | { type: 'TOGGLE_VISIBLE'; payload: { blockId: string } }
  | { type: 'REORDER'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'SELECT'; payload: { blockId: string | null } }
  | { type: 'SET_VIEWPORT'; payload: Viewport }
  | { type: 'SET_THEME'; payload: Partial<Theme> }
  | { type: 'SET_SITE_META'; payload: Partial<SiteMeta> }
  | { type: 'MARK_SAVED' }
  | { type: 'MARK_DIRTY' }
  | { type: 'SET_LIBRARY_OPEN'; payload: boolean };

export const INITIAL_STATE: EditorState = {
  site: { title: '', favicon: null, seo: { meta_title: '', meta_description: '', og_image: null } },
  theme: { accent: '#0057ff', bg: '#ffffff', text: '#111111', font_display: 'Syne', font_body: 'DM Sans' },
  blocks: [],
  selectedBlockId: null,
  viewport: 'desktop',
  libraryOpen: false,
  dirty: false,
  saving: false,
};

/**
 * Immutable deep set via dot-path string ("key", "key.nested", "key.0.field").
 * Returns a new object — does not mutate the original.
 */
export function setIn(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const keys = path.split('.');
  const result = { ...obj };
  let cur: Record<string, unknown> = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const existing = cur[k];
    cur[k] = Array.isArray(existing)
      ? [...existing]
      : { ...(existing as Record<string, unknown> ?? {}) };
    cur = cur[k] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
  return result;
}

function makeId(): string {
  return `blk_${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`;
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'LOAD':
      return {
        ...INITIAL_STATE,
        site: action.payload.site,
        theme: action.payload.theme,
        blocks: action.payload.blocks,
        dirty: false,
      };

    case 'ADD_BLOCK':
      return {
        ...state,
        blocks: [...state.blocks, action.payload],
        dirty: true,
      };

    case 'REMOVE_BLOCK': {
      const blocks = state.blocks.filter(b => b.id !== action.payload.blockId);
      return {
        ...state,
        blocks,
        selectedBlockId: state.selectedBlockId === action.payload.blockId ? null : state.selectedBlockId,
        dirty: true,
      };
    }

    case 'DUPLICATE_BLOCK': {
      const idx = state.blocks.findIndex(b => b.id === action.payload.blockId);
      if (idx === -1) return state;
      const original = state.blocks[idx];
      const clone: BlockInstance = {
        ...original,
        id: makeId(),
        config: { ...original.config },
        mobile_config: original.mobile_config ? { ...original.mobile_config } : undefined,
      };
      const blocks = [
        ...state.blocks.slice(0, idx + 1),
        clone,
        ...state.blocks.slice(idx + 1),
      ];
      return { ...state, blocks, dirty: true };
    }

    case 'UPDATE_BLOCK_CONFIG': {
      const blocks = state.blocks.map(b => {
        if (b.id !== action.payload.blockId) return b;
        return {
          ...b,
          config: setIn(b.config, action.payload.path, action.payload.value),
        };
      });
      return { ...state, blocks, dirty: true };
    }

    case 'UPDATE_BLOCK_MOBILE_CONFIG': {
      const blocks = state.blocks.map(b => {
        if (b.id !== action.payload.blockId) return b;
        const mc = (b.mobile_config ?? {}) as Record<string, unknown>;
        return {
          ...b,
          mobile_config: setIn(mc, action.payload.path, action.payload.value),
        };
      });
      return { ...state, blocks, dirty: true };
    }

    case 'TOGGLE_VISIBLE': {
      const blocks = state.blocks.map(b =>
        b.id === action.payload.blockId ? { ...b, visible: !b.visible } : b,
      );
      return { ...state, blocks, dirty: true };
    }

    case 'REORDER': {
      const { fromIndex, toIndex } = action.payload;
      if (fromIndex === toIndex) return state;
      const blocks = [...state.blocks];
      const [moved] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, moved);
      return { ...state, blocks, dirty: true };
    }

    case 'SELECT':
      return { ...state, selectedBlockId: action.payload.blockId };

    case 'SET_VIEWPORT':
      return { ...state, viewport: action.payload };

    case 'SET_THEME':
      return { ...state, theme: { ...state.theme, ...action.payload }, dirty: true };

    case 'SET_SITE_META':
      return { ...state, site: { ...state.site, ...action.payload }, dirty: true };

    case 'MARK_SAVED':
      return { ...state, dirty: false, saving: false };

    case 'MARK_DIRTY':
      return { ...state, dirty: true };

    case 'SET_LIBRARY_OPEN':
      return { ...state, libraryOpen: action.payload };

    default:
      return state;
  }
}
