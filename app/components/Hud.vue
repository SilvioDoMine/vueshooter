<script setup lang="ts">
import { useGameStore } from "~/stores/game";
import { useRunStore } from "~/stores/run";
import { GameStateEnum } from "~/interfaces/types";

const gameStateStore = useGameStore();
const runStore = useRunStore();

// Detecta se está em modo PWA usando o Nuxt PWA
const { $pwa } = useNuxtApp();
const isPWA = computed(() => $pwa?.isInstalled || false);

// Calcula o offset baseado no PWA
const topOffset = computed(() => {
  if (isPWA.value) {
    // Em PWA, tenta usar env() mas com fallback para o padrão se não conseguir
    return 'env(safe-area-inset-top, 0.5rem)';
  }
  return '0.5rem'; // 8px padrão para modo browser normal
});
</script>

<template>
    <div v-if="[GameStateEnum.IN_GAME_1, GameStateEnum.IN_GAME_2].includes(gameStateStore.state)" class="pointer-events-none absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">

        <!-- Create absolute div that display axys X Y Z on the screen to help me -->
        <div
            class="absolute left-2 text-white text-xs p-2 bg-black/50 rounded"
            :style="{ top: topOffset }"
        >
            <p>X: {{ gameStateStore.player.position.x.toFixed(10) }}</p>
            <p>Y: {{ gameStateStore.player.position.y.toFixed(10) }}</p>
            <p>Z: {{ gameStateStore.player.position.z.toFixed(10) }}</p>
            <p>Elapsed Time: {{ runStore.elapsedTime.toFixed(2) }}</p>
            <p v-if="isPWA" class="text-green-400">PWA Mode</p>
        </div>

        <!-- Joystic Gameplay -->
        <GameplayJoystick />
    </div>
</template>
