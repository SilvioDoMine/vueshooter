import type { Player } from "~/interfaces/types";

export type World = {
    player: Player;
    enemies: any[];
    projectiles: any[];
    time: number;
};

export type System = {
    update: (world: World, deltaTime: number) => void;
};

export class Engine {
    public world: World;
    public systems: System[] = [];

    constructor(world: World) {
        this.world = world;
    }

    add(system: any) {
        this.systems.push(system);
    }

    update(deltaTime: number) {
        for (const system of this.systems) {
            system.update(this.world, deltaTime);
        }
    }
}
