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
  levels: Record<number, IMapLevel>;
}
