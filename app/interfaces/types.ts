import { Vector3 } from "three";

export enum GameStateEnum {
    MAIN_MENU = "MainMenu",
    LOBBY = "Lobby",
    IN_GAME = "InGame",
};

export type Player = {
    id: string;
    position: Vector3;
    velocity: Vector3;
    mesh: any; // Placeholder for Three.js Mesh or Object3D
    [key: string]: any; // Allow additional properties
    hp: number;
    maxHp: number;
};
