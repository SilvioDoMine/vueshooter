import { defineStore } from "pinia";
import { Vector3 } from "three";
import type { World } from "~/core/engine";
import { GameStateEnum, type Player } from "~/interfaces/types";

export const useGameStore = defineStore("game", () => {
  const coinPremium = ref(0);
  const coinGold = ref(0);

  const player = ref<Player>({
    id: "player",
    hp: 100,
    maxHp: 100,
    mesh: null,
    hitbox: {
      fromX: 0,
      fromZ: 0,
      cillinders: [
        { offsetX: 0, offsetZ: 0.5, radius: 0.25, height: 6, rotation: Math.PI / 2 }, // Main body
        { offsetX: 0, offsetZ: 0.8, radius: 0.25, height: 5, rotation: Math.PI / 1 }, // Left and right wing
      ]
    },
    speed: 30,
    position: new Vector3(0, 0, 0),
    rotation: new Vector3(0, 0, 0),
    velocity: new Vector3(0, 0, 0),
  });

  const currentWorld = ref<World>();

  const state = ref<GameStateEnum>(GameStateEnum.MAIN_MENU);

  function addGold(amount: number) {
    coinGold.value += amount;
  }

  function addPremium(amount: number) {
    coinPremium.value += amount;
  }

  return {
    state,
    coinGold,
    coinPremium,
    addGold,
    addPremium,

    // player
    player,
  };
});
