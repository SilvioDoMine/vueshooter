<script setup lang="ts">
import { useInputStore } from "~/stores/input";
import { useGameStore } from "~/stores/game";

const inputStore = useInputStore();
const game = useGameStore();

// Setup input event listeners
inputStore.setupEventListeners();
</script>

<template>
  <div class="bg-black">
    <NuxtPwaManifest />

    <GameCanvas />

    <!-- HTML UI -->
    <UApp class="pointer-events-none">
      <Hud />
      <Lobby />
      <MainMenu />
    </UApp>
    <!-- HTML UI-->
  </div>
</template>
