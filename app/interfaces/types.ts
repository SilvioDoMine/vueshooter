import { Vector3 } from "three";

export enum GameStateEnum {
    MAIN_MENU = "MainMenu",
    LOBBY = "Lobby",
    IN_GAME = "InGame",
    IN_GAME_1 = "World1", // --- IGNORE ---
    IN_GAME_2 = "World2", // --- IGNORE ---
};

export type Player = {
    id: string;
    position: Vector3;
    rotation: Vector3;
    velocity: Vector3;
    mesh: any; // Placeholder for Three.js Mesh or Object3D
    [key: string]: any; // Allow additional properties
    hp: number;
    maxHp: number;
};
