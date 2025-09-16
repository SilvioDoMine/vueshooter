import * as THREE from "three";
import { BaseScene } from "./BaseScene";

export class InGameScene extends BaseScene {
    constructor() {
        super();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
    }
    
    public init(): void {
        // Initialize scene objects here
    }
    
    public update(deltaTime: number): void {
        // Update scene objects here
        console.log("InGameScene updating", deltaTime);
    }

    public dispose(): void {
        // Clean up resources here
    }

    private setWorld(world: any): void {
        // Set the game world for the scene
    }
}
