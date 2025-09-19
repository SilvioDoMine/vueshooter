<script setup lang="ts">
import { useGameStore } from "~/stores/game";
import { useInputStore, type InputState } from "~/stores/input";
import { GameStateEnum } from "~/interfaces/types";

const inputStore = useInputStore();
const gameStateStore = useGameStore();

const unwatch = watch(() => inputStore.state, (inputState: InputState) => {
  if (gameStateStore.state !== GameStateEnum.MAIN_MENU) return;

  if (inputState.keyboard.keys.size > 0 || inputState.mouse.isDown ) {
    gameStateStore.state = GameStateEnum.LOBBY;
  }
}, {deep: true});


onUnmounted(() => {
  unwatch();
});
</script>

<template>
  <div
    v-if="gameStateStore.state === GameStateEnum.MAIN_MENU"
    class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center"
    >
    <h1 class="text-white text-4xl animate-pulse">Press anything to start...</h1>
  </div>
</template>
