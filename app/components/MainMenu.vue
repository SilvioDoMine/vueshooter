<script setup lang="ts">
import { useGameStore } from "~/stores/game";
import { useInputStore } from "~/stores/input";
import { GameStateEnum } from "~/interfaces/types";

const inputStore = useInputStore();
const gameStateStore = useGameStore();

watch(() => inputStore.state.keyboard, (keys: { keys: string[] }) => {
  if (keys.keys.has(" ") || keys.keys.has("Enter")) {
    if (gameStateStore.state === GameStateEnum.MAIN_MENU) {
      gameStateStore.state = GameStateEnum.LOBBY;
    }
  }
}, { deep: true });
</script>

<template>
  <div
    v-if="gameStateStore.state === GameStateEnum.MAIN_MENU"
    class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center"
    >
    <h1 class="text-white text-4xl animate-pulse">Press Enter to continue</h1>
  </div>
</template>
