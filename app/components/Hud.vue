<script setup lang="ts">
import { useGameStore } from "~/stores/game";
import { useRunStore } from "~/stores/run";
import { GameStateEnum } from "~/interfaces/types";

const gameStateStore = useGameStore();
const runStore = useRunStore();
</script>

<template>
    <div v-if="[GameStateEnum.IN_GAME_1, GameStateEnum.IN_GAME_2].includes(gameStateStore.state)" class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <h1 class="text-white text-4xl animate-pulse">HUD Component - To be implemented</h1>

        <!-- Create absolute div that display axys X Y Z on the screen to help me -->
        <div class="absolute top-2 left-2 text-white text-xs p-2 bg-black/50 rounded">
            <p>X: {{ gameStateStore.player.position.x.toFixed(10) }}</p>
            <p>Y: {{ gameStateStore.player.position.y.toFixed(10) }}</p>
            <p>Z: {{ gameStateStore.player.position.z.toFixed(10) }}</p>
            <p>Elapsed Time: {{ runStore.elapsedTime.toFixed(2) }}</p>
        </div>
    </div>
</template>
