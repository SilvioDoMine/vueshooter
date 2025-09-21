<script setup lang="ts">
import { Engine } from "~/core/engine";
import { SceneManager } from "~/scenes/SceneManager";
import { useGameStore } from "~/stores/game";
import { MovementSystem } from "~/systems/MovementSystem";

// Canvas
const gameCanvas = ref<HTMLCanvasElement>();

// Engine
const engine = new Engine('canvas');

// Game state
const game = useGameStore();

// VueUse para gerenciar resize automaticamente
const { width, height } = useWindowSize();
const aspect = computed(() => width.value / height.value);

onMounted(() => {
  // É necessário esperar o próximo tick para garantir que o canvas esteja disponível
  nextTick(() => {
    // Scene só pode ser criado após o canvas estar disponível
    const sceneManager = new SceneManager(gameCanvas.value);
    const movementSystem = new MovementSystem();

    // Watch no aspect ratio para resize automático
    watch(aspect, (newAspect) => {
      sceneManager.handleResize(newAspect);
    });

    watch(() => game.state, (newState) => {
      // if (sceneManager.ready) {
        sceneManager.setScene(newState);
      // }
    });

    // Adiciona o SceneManager ao Engine
    engine.add(sceneManager);
    engine.add(movementSystem);

    // Delta time shenanigans
    let lastTime = performance.now();

    // Game loop
    const gameLoop = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000; // Convert to seconds
      lastTime = now;

      // Update engine - this will update all systems internally
      engine.update(delta);

      // Chama novamente o gameloop
      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  });
});
</script>

<template>
  <ClientOnly>
    <canvas ref="gameCanvas" class="w-screen h-screen block"></canvas>
  </ClientOnly>
</template>