import * as THREE from "three";
import type { System } from "~/core/engine";
import { useGameStore } from "~/stores/game";
import { useInputStore } from "~/stores/input";
import { GameStateEnum } from "~/interfaces/types";

export class MovementSystem implements System {
    private gameStore = useGameStore();
    private player = useGameStore().player;
    private inputStore = useInputStore();
    private runStore = useRunStore();

    update(world: any, deltaTime: number): void {
        if (! this.canMoveGeneral()) {
            return;
        }

        const speed = this.player.speed; // units per second

        // Reset velocity
        this.player.velocity.set(0, 0, 0);

        // Joystick input (takes priority over keyboard)
        if (this.inputStore.state.joystick.isActive) {
            const joystickX = this.inputStore.state.joystick.x;
            const joystickY = this.inputStore.state.joystick.y;

            // Convert joystick input to velocity (Y is inverted for correct direction)
            this.player.velocity.x = joystickX * speed;
            this.player.velocity.z = joystickY * speed;

            // Apply bounds checking for joystick movement
            const newX = this.player.position.x + this.player.velocity.x * deltaTime;
            const newZ = this.player.position.z + this.player.velocity.z * deltaTime;

            if (newX <= this.runStore.currentMap.bounds.xMin || newX >= this.runStore.currentMap.bounds.xMax) {
                this.player.velocity.x = 0;
            }
            if (newZ <= this.runStore.currentMap.bounds.zMin || newZ >= this.runStore.currentMap.bounds.zMax) {
                this.player.velocity.z = 0;
            }
        } else {
            // Keyboard input (fallback when joystick is not active)
            if (this.inputStore.state.keyboard.keys.has("w") || this.inputStore.state.keyboard.keys.has("ArrowUp")) {
                // check bounds
                if (this.player.position.z <= this.runStore.currentMap.bounds.zMin) {
                    this.player.position.z = this.runStore.currentMap.bounds.zMin;
                } else {
                    this.player.velocity.z -= speed;
                }
            }
            if (this.inputStore.state.keyboard.keys.has("s") || this.inputStore.state.keyboard.keys.has("ArrowDown")) {
                if (this.player.position.z >= this.runStore.currentMap.bounds.zMax) {
                    this.player.position.z = this.runStore.currentMap.bounds.zMax;
                } else {
                    this.player.velocity.z += speed;
                }
            }
            if (this.inputStore.state.keyboard.keys.has("a") || this.inputStore.state.keyboard.keys.has("ArrowLeft")) {
                if (this.player.position.x <= this.runStore.currentMap.bounds.xMin) {
                    this.player.position.x = this.runStore.currentMap.bounds.xMin;
                } else {
                    this.player.velocity.x -= speed;
                }
            }
            if (this.inputStore.state.keyboard.keys.has("d") || this.inputStore.state.keyboard.keys.has("ArrowRight")) {
                if (this.player.position.x >= this.runStore.currentMap.bounds.xMax) {
                    this.player.position.x = this.runStore.currentMap.bounds.xMax;
                } else {
                    this.player.velocity.x += speed;
                }
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

            const turningSpeed = 10; // radians per second

            // Apply smooth rotation using shortest path
            this.player.rotation.y += angleDiff * deltaTime * turningSpeed;
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
