import * as THREE from "three";
import type { System, World } from "~/core/engine";
import { GameStateEnum } from "~/interfaces/types";
import type { BaseScene } from "./BaseScene";
import { MainMenuScene } from "./MainMenuScene";
import { LobbyScene } from "./LobbyScene";
import { InGameScene } from "./InGameScene";
import { RunTimerScene } from "./RunTimerScene";
import { RunRoomScene } from "./RunRoomScene";

export class SceneManager implements System {
    private scenes: Map<GameStateEnum, BaseScene> = new Map();
    private currentScene!: BaseScene;
    private ready: boolean = false;

    private renderer: THREE.WebGLRenderer;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        // Precisamos receber o canvas do componente
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });

        // blue background
        this.renderer.setClearColor(0x0000ff, 1);

        // populate all available scenes
        this.loadScenes();
    }

    update(world: World, deltaTime: number): void {
        if (
            ! this.ready 
            || ! this.currentScene
        ) {
            return;
        }

        // Render the current scene
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Update the current scene
        this.currentScene.update(deltaTime, this.renderer);

        // Render the current scene
        this.renderer.render(this.currentScene.getScene(), this.currentScene.getCamera());
    }

    setScene(state: GameStateEnum): void {
        this.currentScene?.dispose();
        this.currentScene = this.scenes.get(state)!;
        this.currentScene.init();
    }

    private loadScenes(): void {
        if (this.ready) return;

        this.scenes.set(GameStateEnum.MAIN_MENU, new MainMenuScene());
        this.scenes.set(GameStateEnum.LOBBY, new LobbyScene());
        this.scenes.set(GameStateEnum.IN_GAME, new InGameScene());

        this.scenes.set(GameStateEnum.IN_GAME_1, new RunTimerScene());
        this.scenes.set(GameStateEnum.IN_GAME_2, new RunRoomScene());

        this.ready = true;
        this.setScene(GameStateEnum.MAIN_MENU);

        // Dynamically import scenes
        // 1. Get all enum values
        // const sceneStates = Object.values(GameStateEnum);

        // 2. For each state, import the corresponding scene dynamically `${stateString}Scene`
        // 3. Instantiate the scene and store it in the map
        // 4. Mark scenes as ready
        // Promise.all(sceneStates.map(async (state) => {
        //     const module = await import(`./${state}Scene`);
        //     const SceneClass = module[`${state}Scene`];
        //     const sceneInstance: BaseScene = new SceneClass();
        //     this.scenes.set(state as GameStateEnum, sceneInstance);
        // })).then(() => {
        //     this.ready = true;
        //     this.setScene(GameStateEnum.MAIN_MENU);
        // });
    }
}
