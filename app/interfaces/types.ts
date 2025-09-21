import { Vector3, Group } from "three";

export enum GameStateEnum {
    MAIN_MENU = "MainMenu",
    LOBBY = "Lobby",
    IN_GAME = "InGame",
    IN_GAME_1 = "World1", // --- IGNORE ---
    IN_GAME_2 = "World2", // --- IGNORE ---
};

export type Cillinders = {
    x: number;
    z: number;
    radius: number;
    height: number;
}

export type HitboxCillinder = {
    offsetX: number; // Offset from the player's position
    offsetZ: number; // Offset from the player's position
    radius: number; // Radius of the cillinder
    height: number; // Total height of the cillinder
    rotation: number; // Rotation angle in degrees
}

export type Hitbox = {
    fromX: number;
    fromZ: number;
    cillinders: HitboxCillinder[];
};

export type Player = {
    id: string;
    position: Vector3;
    rotation: Vector3;
    velocity: Vector3;
    speed: number;
    mesh: Group | null; // Placeholder for Three.js Group, Mesh or Object3D
    hitbox: Hitbox;
    [key: string]: any; // Allow additional properties
    hp: number;
    maxHp: number;
};
