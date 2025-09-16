<script setup lang="ts">
import { useGameStore } from "~/stores/game";
import { GameStateEnum } from "~/interfaces/types";

const gameStateStore = useGameStore();
</script>

<template>
    <div v-if="gameStateStore.state === GameStateEnum.IN_GAME" class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <h1 class="text-white text-4xl animate-pulse">HUD Component - To be implemented</h1>

        <!-- Create absolute div that display axys X Y Z on the screen to help me -->
        <div class="absolute top-2 left-2 text-white">
            <p>X: {{ gameStateStore.player.position.x }}</p>
            <p>Y: {{ gameStateStore.player.position.y }}</p>
            <p>Z: {{ gameStateStore.player.position.z }}</p>
        </div>
    </div>
</template>
