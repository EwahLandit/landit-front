import type { BlockDefinition } from './types';

export const BLOCKS: Record<string, BlockDefinition> = {};

export function registerBlock<C>(def: BlockDefinition<C>): void {
  BLOCKS[def.type] = def as unknown as BlockDefinition;
}

export function getBlock(type: string): BlockDefinition | undefined {
  return BLOCKS[type];
}

export function getAllBlocks(): BlockDefinition[] {
  return Object.values(BLOCKS);
}
