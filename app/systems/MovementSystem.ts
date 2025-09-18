import type { System } from "~/core/engine";
import { useGameStore } from "~/stores/game";
import { useInput } from "~/composables/useInput";
import { GameStateEnum } from "~/interfaces/types";

export class MovementSystem implements System {
    private gameStore = useGameStore();
    private player = useGameStore().player;
    private input = useInput();
    private runStore = useRunStore();

    update(world: any, deltaTime: number): void {
        if (! this.canMoveGeneral()) {
            return;
        }

        const speed = 5; // units per second

        // Reset velocity
        this.player.velocity.set(0, 0, 0);

        // check input state with bounds
        if (this.input.state.keyboard.keys.has("w") || this.input.state.keyboard.keys.has("ArrowUp")) {
            // check bounds
            if (this.player.position.z <= this.runStore.currentMap.bounds.zMin) {
                this.player.position.z = this.runStore.currentMap.bounds.zMin;
            } else {
                this.player.velocity.z -= speed;
            }
        }
        if (this.input.state.keyboard.keys.has("s") || this.input.state.keyboard.keys.has("ArrowDown")) {
            if (this.player.position.z >= this.runStore.currentMap.bounds.zMax) {
                this.player.position.z = this.runStore.currentMap.bounds.zMax;
            } else {
                this.player.velocity.z += speed;
            }
        }
        if (this.input.state.keyboard.keys.has("a") || this.input.state.keyboard.keys.has("ArrowLeft")) {
            if (this.player.position.x <= this.runStore.currentMap.bounds.xMin) {
                this.player.position.x = this.runStore.currentMap.bounds.xMin;
            } else {
                this.player.velocity.x -= speed;
            }
        }
        if (this.input.state.keyboard.keys.has("d") || this.input.state.keyboard.keys.has("ArrowRight")) {
            if (this.player.position.x >= this.runStore.currentMap.bounds.xMax) {
                this.player.position.x = this.runStore.currentMap.bounds.xMax;
            } else {
                this.player.velocity.x += speed;
            }
        }

        // Normalize diagonal movement
        if (this.player.velocity.length() > speed) {
            this.player.velocity.normalize().multiplyScalar(speed);
        }

        // Update position based on velocity and deltaTime
        this.player.position.addScaledVector(this.player.velocity, deltaTime);

        // Update the player's mesh position if it exists
        if (this.player.mesh) {
            this.player.mesh.position.copy(this.player.position);
        }
    }

    private canMoveGeneral(): boolean {
        // Only process movement if in the InGame state
        if (this.gameStore.state in [GameStateEnum.MAIN_MENU, GameStateEnum.LOBBY]) {
            return false;
        }

        // If the game is paused, do not update movement
        if (this.runStore.isPaused) {
            return false;
        }

        return true;
    }
}
