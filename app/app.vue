<script setup lang="ts">
import { useInput } from "~/composables/useInput";
import { useGameStore } from "~/stores/game";

const input = useInput();
const game = useGameStore();
</script>

<template>
  <div class="bg-black">
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
