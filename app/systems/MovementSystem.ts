import type { System } from "~/core/engine";
import { useGameStore } from "~/stores/game";
import { useInput } from "~/composables/useInput";

export class MovementSystem implements System {
    private player = useGameStore().player;
    private input = useInput();

    update(world: any, deltaTime: number): void {
        const speed = 5; // units per second

        console.log("MovementSystem updating", deltaTime);

        // Reset velocity
        this.player.velocity.set(0, 0, 0);

        // check input state
        if (this.input.state.keyboard.keys.has("w") || this.input.state.keyboard.keys.has("ArrowUp")) {
            this.player.velocity.z -= speed;
        }
        if (this.input.state.keyboard.keys.has("s") || this.input.state.keyboard.keys.has("ArrowDown")) {
            this.player.velocity.z += speed;
        }
        if (this.input.state.keyboard.keys.has("a") || this.input.state.keyboard.keys.has("ArrowLeft")) {
            this.player.velocity.x -= speed;
        }
        if (this.input.state.keyboard.keys.has("d") || this.input.state.keyboard.keys.has("ArrowRight")) {
            this.player.velocity.x += speed;
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
}
    