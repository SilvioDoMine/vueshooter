export interface MapBounds {
  xMin: number;
  xMax: number;
  zMin: number;
  zMax: number;
}

export interface ViewportConfig {
  width: number;
  height: number;
  fov: number;
  distance: number;
}

/**
 * ViewportManager - Gerencia viewport adaptativo que segue o jogador
 *
 * Responsável por calcular um viewport pequeno e adaptativo baseado no aspect ratio,
 * mantendo o jogador sempre centralizado na tela.
 */
export class ViewportManager {
  // Viewport base de referência (16:9)
  static readonly BASE_VIEWPORT_WIDTH = 20;
  static readonly BASE_VIEWPORT_HEIGHT = 12;
  static readonly REFERENCE_ASPECT = ViewportManager.BASE_VIEWPORT_WIDTH / ViewportManager.BASE_VIEWPORT_HEIGHT;

  /**
   * Calcula o viewport adaptativo baseado no aspect ratio da tela
   */
  static calculateAdaptiveViewport(screenAspect: number): ViewportConfig {
    let viewportWidth: number;
    let viewportHeight: number;
    let fov: number;
    let desktopBonus = 1.0; // Multiplicador para dar "zoom out" no desktop

    if (screenAspect > ViewportManager.REFERENCE_ASPECT) {
      // Tela mais larga que 16:9 - mostra mais nas laterais
      viewportHeight = ViewportManager.BASE_VIEWPORT_HEIGHT;
      viewportWidth = viewportHeight * screenAspect;
      fov = screenAspect < 1 ? 85 : 75; // Mobile portrait tem FOV maior

      // Dar "colher de chá" para desktop - vê mais campo
      if (screenAspect >= 1.5) { // Desktop/laptop típico
        desktopBonus = 2; // 80% mais campo de visão
      }
    } else {
      // Tela mais alta que 16:9 - mantém largura, aumenta altura
      viewportWidth = ViewportManager.BASE_VIEWPORT_WIDTH;
      viewportHeight = viewportWidth / screenAspect;
      fov = screenAspect < 1 ? 90 : 75; // Mobile portrait precisa ver mais verticalmente
    }

    // Aplicar bonus de desktop se aplicável
    viewportWidth *= desktopBonus;
    viewportHeight *= desktopBonus;

    // Calcular distância da câmera para mostrar o viewport desejado
    const distance = (viewportHeight / 2) / Math.tan((fov * Math.PI / 180) / 2);

    const config = {
      width: viewportWidth,
      height: viewportHeight,
      fov,
      distance: Math.max(distance, 8) // Distância mínima para evitar câmera muito próxima
    };

    console.log("📱💻 Viewport calculation:", {
      screenAspect: screenAspect.toFixed(2),
      deviceType: screenAspect >= 1.5 ? "Desktop" : screenAspect > 1 ? "Tablet/Laptop" : "Mobile",
      desktopBonus: desktopBonus.toFixed(1) + "x",
      viewport: `${config.width.toFixed(1)} x ${config.height.toFixed(1)}`,
      fov: config.fov + "°",
      distance: config.distance.toFixed(1)
    });

    return config;
  }

  /**
   * Calcula a posição da câmera para seguir o jogador dentro dos bounds do mapa
   */
  static calculateCameraPosition(
    playerPosition: { x: number; z: number },
    mapBounds: MapBounds,
    viewportConfig: ViewportConfig
  ): { x: number; y: number; z: number } {
    const halfViewWidth = viewportConfig.width / 2.4;
    const halfViewHeight = viewportConfig.height / 2.4;

    // Calcular os limites onde a câmera pode estar para não mostrar área fora do mapa
    const minCameraX = mapBounds.xMin + halfViewWidth;
    const maxCameraX = mapBounds.xMax - halfViewWidth;
    const minCameraZ = mapBounds.zMin + halfViewHeight;
    const maxCameraZ = mapBounds.zMax - (halfViewHeight / 2); // Só limitar pra cima, pois o joystic pode atrapalhar mobile

    // Posição ideal da câmera (centralizada no jogador)
    let cameraX = playerPosition.x;
    let cameraZ = playerPosition.z;

    // Se o mapa é menor que o viewport, centralizar no mapa
    if (mapBounds.xMax - mapBounds.xMin <= viewportConfig.width) {
      cameraX = (mapBounds.xMin + mapBounds.xMax) / 2;
    } else {
      // Aplicar limites para não mostrar área fora do mapa
      cameraX = Math.max(minCameraX, Math.min(maxCameraX, cameraX));
    }

    if (mapBounds.zMax - mapBounds.zMin <= viewportConfig.height) {
      cameraZ = (mapBounds.zMin + mapBounds.zMax) / 2;
    } else {
      // Aplicar limites para não mostrar área fora do mapa, mas só pra cima
      cameraZ = Math.max(minCameraZ, Math.min(maxCameraZ, cameraZ));
    }

    return {
      x: cameraX,
      y: viewportConfig.distance,
      z: cameraZ
    };
  }

  /**
   * Verifica se uma posição está dentro dos bounds do mapa
   */
  static isWithinMapBounds(position: { x: number; z: number }, mapBounds: MapBounds): boolean {
    return position.x >= mapBounds.xMin &&
           position.x <= mapBounds.xMax &&
           position.z >= mapBounds.zMin &&
           position.z <= mapBounds.zMax;
  }

  /**
   * Obtém informações de debug sobre a configuração atual
   */
  static getDebugInfo(
    screenAspect: number,
    playerPosition: { x: number; z: number },
    mapBounds: MapBounds
  ) {
    const viewportConfig = this.calculateAdaptiveViewport(screenAspect);
    const cameraPosition = this.calculateCameraPosition(playerPosition, mapBounds, viewportConfig);

    return {
      screenAspect,
      playerPosition,
      mapBounds,
      viewportConfig,
      cameraPosition,
      mapDimensions: {
        width: mapBounds.xMax - mapBounds.xMin,
        height: mapBounds.zMax - mapBounds.zMin
      },
      comparison: {
        viewportVsMap: {
          widthRatio: viewportConfig.width / (mapBounds.xMax - mapBounds.xMin),
          heightRatio: viewportConfig.height / (mapBounds.zMax - mapBounds.zMin)
        }
      }
    };
  }
}