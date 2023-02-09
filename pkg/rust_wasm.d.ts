/* tslint:disable */
/* eslint-disable */
/**
*/
export enum Direction {
  UP,
  DOWN,
  RIGHT,
  LEFT,
}
/**
*/
export enum WorldState {
  RUNNING,
  LOSS,
  WON,
}
/**
*/
export class Snake {
  free(): void;
}
/**
*/
export class World {
  free(): void;
/**
* @param {number} world_size
* @param {WorldCell} snake_spawn_coords
* @param {number} snake_size
* @returns {World}
*/
  static new(world_size: number, snake_spawn_coords: WorldCell, snake_size: number): World;
/**
* @param {number} world_size
* @returns {WorldCell}
*/
  static gen_reward_cell(world_size: number): WorldCell;
/**
* @returns {WorldCell}
*/
  reward_cell(): WorldCell;
/**
* @returns {number}
*/
  size(): number;
/**
* @returns {number}
*/
  snake_direction(): number;
/**
* @param {number} direction
*/
  snake_set_direction(direction: number): void;
/**
* @returns {any}
*/
  snake_body(): any;
/**
* @returns {number}
*/
  static snake_cell_len(): number;
/**
* @returns {number}
*/
  snake_body_length(): number;
/**
* @returns {number}
*/
  state(): number;
/**
*/
  set_reward(): void;
/**
*/
  snake_step(): void;
}
/**
*/
export class WorldCell {
  free(): void;
/**
* @param {number} x
* @param {number} y
*/
  constructor(x: number, y: number);
/**
*/
  x: number;
/**
*/
  y: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_worldcell_free: (a: number) => void;
  readonly __wbg_get_worldcell_x: (a: number) => number;
  readonly __wbg_set_worldcell_x: (a: number, b: number) => void;
  readonly __wbg_get_worldcell_y: (a: number) => number;
  readonly __wbg_set_worldcell_y: (a: number, b: number) => void;
  readonly worldcell_new: (a: number, b: number) => number;
  readonly __wbg_snake_free: (a: number) => void;
  readonly __wbg_world_free: (a: number) => void;
  readonly world_new: (a: number, b: number, c: number) => number;
  readonly world_gen_reward_cell: (a: number) => number;
  readonly world_reward_cell: (a: number) => number;
  readonly world_snake_direction: (a: number) => number;
  readonly world_snake_set_direction: (a: number, b: number) => void;
  readonly world_snake_body: (a: number) => number;
  readonly world_snake_cell_len: () => number;
  readonly world_snake_body_length: (a: number) => number;
  readonly world_state: (a: number) => number;
  readonly world_set_reward: (a: number) => void;
  readonly world_snake_step: (a: number) => void;
  readonly world_size: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
