import * as THREE from "three";
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

        const speed = this.player.speed; // units per second

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

        // Smooth rotation based on movement direction
        if (this.player.velocity.length() > 0.1) {
            const targetAngle = Math.atan2(-this.player.velocity.x, -this.player.velocity.z);

            // Calculate shortest angular distance
            let angleDiff = targetAngle - this.player.rotation.y;

            // Normalize angle difference to [-π, π]
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

            // Apply smooth rotation using shortest path
            this.player.rotation.y += angleDiff * deltaTime * 5;
        }

        // Update the player's mesh position and rotation if it exists
        if (this.player.mesh) {
            this.player.mesh.position.copy(this.player.position);
            this.player.mesh.rotation.set(
                this.player.rotation.x,
                this.player.rotation.y,
                this.player.rotation.z
            );
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
