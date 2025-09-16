import { defineStore } from "pinia";
import { GameStateEnum } from "~/interfaces/types";

export const useGameStore = defineStore("game", () => {
  const coinPremium = ref(0);
  const coinGold = ref(0);
  
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
  };
});
