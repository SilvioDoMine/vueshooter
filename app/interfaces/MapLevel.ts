export enum MapLevelType {
  START = "start",
  WAVE = "wave",
  TRANSITION = "transition",
  BOSS = "boss",
}

export interface IMapLevel {
  type: MapLevelType;
  enemies?: number;
}

export interface IMap {
  bounds: { xMin: number; xMax: number; zMin: number; zMax: number };
  levels: Record<number, IMapLevel>;
}
