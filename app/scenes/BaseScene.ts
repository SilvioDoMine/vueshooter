import * as THREE from "three";

export abstract class BaseScene {
    protected scene: THREE.Scene;
    protected camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
    protected ready: boolean = false;

    abstract init(): void;
    abstract update(deltaTime: number, renderer?: THREE.WebGLRenderer): void;
    abstract dispose(): void;

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }
}
