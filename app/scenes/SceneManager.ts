import * as THREE from "three";
import type { System, World } from "~/core/engine";
import { GameStateEnum } from "~/interfaces/types";
import type { BaseScene } from "./BaseScene";

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
        this.currentScene.update(deltaTime);

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

        // Dynamically import scenes
        // 1. Get all enum values
        const sceneStates = Object.values(GameStateEnum);

        // 2. For each state, import the corresponding scene dynamically `${stateString}Scene`
        // 3. Instantiate the scene and store it in the map
        // 4. Mark scenes as ready
        Promise.all(sceneStates.map(async (state) => {
            const module = await import(`./${state}Scene`);
            const SceneClass = module[`${state}Scene`];
            const sceneInstance: BaseScene = new SceneClass();
            this.scenes.set(state as GameStateEnum, sceneInstance);
        })).then(() => {
            this.ready = true;
            this.setScene(GameStateEnum.MAIN_MENU);
        });
    }
}
