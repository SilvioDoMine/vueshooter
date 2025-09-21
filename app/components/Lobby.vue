<script setup lang="ts">
import { useGameStore } from "~/stores/game";
import { useInputStore } from "~/stores/input";
import { GameStateEnum } from "~/interfaces/types";

const inputStore = useInputStore();
const gameStateStore = useGameStore();
const runStore = useRunStore();
</script>

<template>
  <div v-if="gameStateStore.state === GameStateEnum.LOBBY" class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
   
    <UCard>
      <template #header>
        <h2 class="text-2xl font-bold">Spaceshooter!</h2>
      </template>

      <div class="flex flex-col gap-4">
        <div class="flex flex-row items-center justify-between">
          <p class="text-sm font-bold">Fase 1</p>
          <button class="bg-blue-500 font-bold text-white text-sm px-4 py-0.5 rounded hover:bg-blue-600" @click="runStore.start(1)">INICIAR</button>
        </div>

        <div class="flex flex-row items-center justify-between">
          <p class="text-sm font-bold">Fase 2</p>
          <button class="bg-blue-500 font-bold text-white text-sm px-4 py-0.5 rounded hover:bg-blue-600" @click="runStore.start(2)">INICIAR</button>
        </div>
      </div>
      
      <template #footer>
        <p class="text-sm text-gray-500">Game Version 1.0.1</p>
      </template>
    </UCard>


  </div>
</template>
