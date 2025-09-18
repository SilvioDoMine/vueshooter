import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { BaseScene } from "./BaseScene";
import { CameraController } from "~/systems/CameraController";

export class RunTimerScene extends BaseScene {
    private player = useGameStore().player;
    private runStore = useRunStore();
    private cameraController!: CameraController;

    constructor() {
        super();
    }
    
    public init(): void {
        console.log("RunTimerScene initializing...");

        this.scene = new THREE.Scene();

        const aspect = window.innerWidth / window.innerHeight;

        // Criar controller de câmera
        this.cameraController = new CameraController(aspect, this.runStore.currentMap.bounds);
        this.camera = this.cameraController.getCamera();

        // Definir jogador como alvo da câmera
        this.cameraController.setTarget({
            x: this.player.position.x,
            z: this.player.position.z
        });

        // set color to black
        this.scene.background = new THREE.Color(0x000000);

        this.createPlayer();

        // Example: Set world (if needed)
        this.setWorld(null); // Replace null with actual world object if available

        // Display grid baseado nos bounds do mapa (grid maior que o viewport)
        if (!this.scene.getObjectByName("gridHelper")) {
            const mapBounds = this.runStore.currentMap.bounds;
            const gridSize = Math.max(
                mapBounds.xMax - mapBounds.xMin,
                mapBounds.zMax - mapBounds.zMin
            );

            const gridHelper = new THREE.GridHelper(gridSize, Math.min(gridSize, 50));
            gridHelper.name = "gridHelper";

            // Centralizar o grid no centro do mapa
            gridHelper.position.set(
                (mapBounds.xMin + mapBounds.xMax) / 2,
                0,
                (mapBounds.zMin + mapBounds.zMax) / 2
            );

            this.scene.add(gridHelper);
        }
    }
    
    public update(deltaTime: number, renderer: THREE.WebGLRenderer): void {
        // render the player mesh position based on player position
        if (this.player.mesh) {

            // Atualiza a posição do grupo do player
            this.player.mesh.position.copy(this.player.position);

            // Atualiza rotação do group do player
            this.player.mesh.rotation.set(
                this.player.rotation.x,
                this.player.rotation.y,
                this.player.rotation.z
            );

            // Atualizar posição alvo da câmera
            this.cameraController.setTarget({
                x: this.player.position.x,
                z: this.player.position.z
            });

            // Atualizar câmera
            this.cameraController.update();
        }

        // Tick the run
        this.runStore.tick(deltaTime);
    }

    public dispose(): void {
        // Clean up resources here
        if (this.cameraController) {
            this.cameraController.dispose();
        }
        console.log("RunTimerScene disposed.");
    }

    /**
     * Atualiza a configuração da câmera para um novo aspect ratio
     */
    public updateCameraForResize(aspect: number): void {
        if (this.cameraController) {
            this.cameraController.updateForResize(aspect);
        }
    }

    /** 
     * Create player with hitbox and collider, add it to scene.
     */
    private createPlayer(): void {
        // Cria o grupo do player
        const playerGroup = new THREE.Group();

        // Cria a capsula de colisão deitada
        const hitboxes = this.player.hitbox;

        // Adiciona cada cillinder do hitbox ao grupo do player
        hitboxes.cillinders.forEach((cillinder, index) => {
            // Cria a geometria da cápsula
            const geometry = new THREE.CapsuleGeometry(
                cillinder.radius,
                cillinder.height - 2 * cillinder.radius,
                4,
                8
            );

            const material = new THREE.MeshBasicMaterial({
                color: index === 0 ? 0x00ff00 : 0x0000ff,
                wireframe: true,
                opacity: 0,
                transparent: true
            });
    
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(
                cillinder.offsetX,
                0,
                cillinder.offsetZ
            );

            // rotaciona a capsula de colisão para ficar deitada
            mesh.rotation.z = Math.PI / 2; // Converte graus para radianos
            mesh.rotation.y = cillinder.rotation; // Deita a capsula

            // Define o nome do mesh para identificação futura
            mesh.name = `hitbox_cillinder_${index}`;

            playerGroup.scale.set(0.8, 0.8, 0.8); // Ajuste o tamanho conforme necessário
            
            // Adiciona o mesh ao grupo do player
            playerGroup.add(mesh);
        });

        // Importo o modelo 3D do player ship
        const loader = new GLTFLoader();
        loader.load("/models/ship.glb", (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1); // Ajuste o tamanho conforme necessário
            model.rotation.y = Math.PI; // Rotaciona o modelo para frente
            model.rotation.z = Math.PI / 2; // Deita o modelo
            model.position.y = 0; // Ajusta a altura do modelo conforme necessário
            model.position.x = -0.165;
            playerGroup.add(model);
        }, undefined, (error) => {
            console.log(error);
            console.error("Error loading player model:", error);
        });

        // Define a posição inicial do grupo do player
        playerGroup.position.copy(this.player.position);

        // Define rotação do group do player
        playerGroup.rotation.set(
            this.player.rotation.x,
            this.player.rotation.y,
            this.player.rotation.z
        );    

        // Adiciona o group à cena
        this.scene.add(playerGroup);

        this.player.mesh = playerGroup;
    }

    private setWorld(world: any): void {
        // Set the game world for the scene
    }
}
