import * as THREE from "three";
import { BaseScene } from "./BaseScene";

export class RunTimerScene extends BaseScene {
    private player = useGameStore().player;
    private runStore = useRunStore();

    constructor() {
        super();
    }
    
    public init(): void {
        // Initialize scene objects here
        console.log("InGameScene initializing...");

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 20, 0);
        this.camera.lookAt(0, 0, 0);

        // set color to gray
        this.scene.background = new THREE.Color(0x808080);

        this.createPlayer();

        // Example: Set world (if needed)
        this.setWorld(null); // Replace null with actual world object if available
    }
    
    public update(deltaTime: number): void {
        // render the player mesh position based on player position
        if (this.player.mesh) {
            this.player.mesh.position.copy(this.player.position);
        }

        // Tick the run
        this.runStore.tick(deltaTime);

        // display a grid on the ground
        if (!this.scene.getObjectByName("gridHelper")) {
            const gridHelper = new THREE.GridHelper(
                this.runStore.currentMap.bounds.xMax * 2,
                this.runStore.currentMap.bounds.xMax * 2
            );

            gridHelper.name = "gridHelper";
            this.scene.add(gridHelper);
        }
    }

    public dispose(): void {
        // Clean up resources here
        console.log("InGameScene disposed.");
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
