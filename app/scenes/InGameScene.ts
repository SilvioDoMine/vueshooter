import * as THREE from "three";
import { BaseScene } from "./BaseScene";

export class InGameScene extends BaseScene {
    private player = useGameStore().player;

    constructor() {
        super();
    }
    
    public init(): void {
        // Initialize scene objects here
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.createPlayer();

        // Example: Set world (if needed)
        this.setWorld(null); // Replace null with actual world object if available
    }
    
    public update(deltaTime: number): void {
        // render the player mesh position based on player position
        if (this.player.mesh) {
            this.player.mesh.position.copy(this.player.position);
        }

        // display a grid on the ground
        if (!this.scene.getObjectByName("gridHelper")) {
            const gridHelper = new THREE.GridHelper(100, 100);
            gridHelper.name = "gridHelper";
            this.scene.add(gridHelper);
        }

        // display a grid on the other axis
        if (!this.scene.getObjectByName("gridHelperY")) {
            const gridHelperY = new THREE.GridHelper(100, 100);
            gridHelperY.rotation.x = Math.PI / 2;
            gridHelperY.name = "gridHelperY";
            // must be red
            gridHelperY.material.color.set(0xff0000);
            this.scene.add(gridHelperY);
        }
    }

    public dispose(): void {
        // Clean up resources here
    }

    private createPlayer(): void {
        // Create the player square and add to scene at correct position
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const playerMesh = new THREE.Mesh(geometry, material);
        playerMesh.position.copy(this.player.position);
        this.player.mesh = playerMesh; // Store reference to mesh
        this.scene.add(playerMesh);
    }

    private setWorld(world: any): void {
        // Set the game world for the scene
    }
}
