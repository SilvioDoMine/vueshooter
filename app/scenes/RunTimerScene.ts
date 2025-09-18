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
        // this.camera = new THREE.OrthographicCamera(
        //     window.innerWidth / -64,
        //     window.innerWidth / 64,
        //     window.innerHeight / 64,
        //     window.innerHeight / -64,
        //     0.1,
        //     100
        // );
        this.camera.position.set(0, 10, 0);
        this.camera.lookAt(0, 0, 0);

        // set color to gray
        this.scene.background = new THREE.Color(0x808080);

        this.createPlayer();

        // Example: Set world (if needed)
        this.setWorld(null); // Replace null with actual world object if available
    }
    
    public update(deltaTime: number, renderer: THREE.WebGLRenderer): void {
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
                opacity: 0.5,
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
            
            // Adiciona o mesh ao grupo do player
            playerGroup.add(mesh);
        });

        // Crio o player em formato de cubo
        const playerCube = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );

        playerGroup.add(playerCube);

        // Adiciona o group à cena
        this.scene.add(playerGroup);

        this.player.mesh = playerGroup;
    }

    private setWorld(world: any): void {
        // Set the game world for the scene
    }
}
