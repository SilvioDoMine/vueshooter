import * as THREE from "three";
import { BaseScene } from "./BaseScene";

export class MainMenuScene extends BaseScene {
    constructor() {
        super();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        // change background color to green
        this.scene.background = new THREE.Color(0x00ff00);
    }
    
    init(): void {
        // Initialize scene objects here
        console.log("MainMenuScene initializing...");
    }

    update(deltaTime: number): void {
        // Update scene objects here
        
    }

    dispose(): void {
        // Clean up resources here
        console.log("MainMenuScene disposed.");
    }
}
