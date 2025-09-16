import { defineStore } from "pinia";
import { MapLevelType, type IMapLevel } from "~/interfaces/MapLevel";

export const useRunStore = defineStore("run", () => {
  const runState = ref<MapLevelType>(MapLevelType.START);

  const elapsedTime = ref<number>(0);

  const isPaused = ref<boolean>(false);

  const currentMap: Record<number, IMapLevel> = {
    1: { type: MapLevelType.START },
    2: { type: MapLevelType.WAVE, enemies: 4 },
    3: { type: MapLevelType.WAVE, enemies: 5 },
    4: { type: MapLevelType.WAVE, enemies: 6 },
    5: { type: MapLevelType.TRANSITION },
    6: { type: MapLevelType.WAVE, enemies: 7 },
    7: { type: MapLevelType.WAVE, enemies: 8 },
    8: { type: MapLevelType.WAVE, enemies: 9 },
    9: { type: MapLevelType.WAVE, enemies: 10 },
    10: { type: MapLevelType.BOSS },
    11: { type: MapLevelType.WAVE, enemies: 11 },
    12: { type: MapLevelType.WAVE, enemies: 12 },
    13: { type: MapLevelType.WAVE, enemies: 13 },
    14: { type: MapLevelType.WAVE, enemies: 14 },
    15: { type: MapLevelType.TRANSITION },
    16: { type: MapLevelType.WAVE, enemies: 15 },
    17: { type: MapLevelType.WAVE, enemies: 15 },
    18: { type: MapLevelType.WAVE, enemies: 15 },
    19: { type: MapLevelType.WAVE, enemies: 15 },
    20: { type: MapLevelType.BOSS },
  };

  const currentWave = ref<number>(1);
  const totalWaves: number = Object.keys(currentMap).length;

  
  /**
   * Starts the run, initializing necessary state variables.
   *
   * TODO: This may receive player and map
   */
  function start(): void {
    runState.value = MapLevelType.START;
    isPaused.value = false;
    currentWave.value = 1;
    elapsedTime.value = 0;
    // set player positions and stuff
  }

  function nextWave(): void {
    const nextWave = currentWave.value + 1;

    if (nextWave > totalWaves) {
      throw new Error("Cannot go to next wave, already at the last wave.");
    }

    currentWave.value += 1;

    if (!currentMap[nextWave]) {
      throw new Error("No wave data found for the next wave.");
    }

    runState.value = currentMap[nextWave].type;
  }

  /**
   * Ticks the game state forward by a given delta time.
   */
  function tick(delta: number): void {
    if (isPaused.value) {
      return;
    }

    elapsedTime.value += delta;
  }

  return {
    start,
    nextWave,
    tick,
  };
});
