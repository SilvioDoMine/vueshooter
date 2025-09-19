<script setup lang="ts">
import { useInputStore } from "~/stores/input";
import { useGameStore } from "~/stores/game";

const inputStore = useInputStore();
const game = useGameStore();

// Setup input event listeners
inputStore.setupEventListeners();

const toggleFullscreen = async () => {
  try {
    // Para iOS Safari, usa webkitRequestFullscreen
    const docElement = document.documentElement as any;

    if (!document.fullscreenElement && !docElement.webkitFullscreenElement) {
      if (docElement.requestFullscreen) {
        await docElement.requestFullscreen();
      } else if (docElement.webkitRequestFullscreen) {
        await docElement.webkitRequestFullscreen();
      } else if (docElement.mozRequestFullScreen) {
        await docElement.mozRequestFullScreen();
      } else if (docElement.msRequestFullscreen) {
        await docElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    }
  } catch (error) {
    console.log('Fullscreen não suportado ou bloqueado');
  }
};
</script>

<template>
  <div class="bg-black" @click="toggleFullscreen" @touchend="toggleFullscreen">
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
