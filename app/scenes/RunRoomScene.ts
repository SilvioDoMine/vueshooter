import * as THREE from "three";
import { BaseScene } from "./BaseScene";
import { CameraController } from "~/systems/CameraController";

export class RunRoomScene extends BaseScene {
    private player = useGameStore().player;
    private runStore = useRunStore();
    private cameraController!: CameraController;

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

        const aspect = window.innerWidth / window.innerHeight;
        this.cameraController = new CameraController(aspect, this.runStore.currentMap.bounds);

        // set color to pink
        this.scene.background = new THREE.Color(0xffc0cb);

        // display a grid on the other axis
        if (!this.scene.getObjectByName("gridHelperY")) {
            const gridHelperY = new THREE.GridHelper(100, 100);
            gridHelperY.rotation.x = Math.PI / 2;
            gridHelperY.name = "gridHelperY";
            // must be red
            gridHelperY.material.color.set(0xff0000);
            this.scene.add(gridHelperY);
        }

        this.createPlayer();

        // Example: Set world (if needed)
        this.setWorld(null); // Replace null with actual world object if available
    }

    public updateCameraForResize(aspect: number): void {
        this.cameraController?.updateForResize(aspect);
    }
    
    public update(deltaTime: number): void {
        // render the player mesh position based on player position
        if (this.player.mesh) {
            this.player.mesh.position.copy(this.player.position);
        }

        // Tick the run
        this.runStore.tick(deltaTime);

        this.cameraController.setTarget({
            x: this.player.position.x,
            z: this.player.position.z
        });

        this.cameraController.update();

        // display a grid on the ground
        if (!this.scene.getObjectByName("gridHelper")) {
            const gridHelper = new THREE.GridHelper(100, 100);
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
