import * as THREE from "three";
import { ViewportManager, type ViewportConfig } from "~/utils/ViewportManager";

/**
 * CameraController - Gerencia câmera adaptativa que segue entidades
 *
 * Responsável por:
 * - Configurar viewport adaptativo baseado no aspect ratio
 * - Seguir uma entidade (jogador) de forma suave
 * - Respeitar bounds do mapa
 * - Atualizar configuração em resize
 */
export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private viewportConfig: ViewportConfig;
  private target: { x: number; z: number } | null = null;
  private mapBounds: { xMin: number; xMax: number; zMin: number; zMax: number };

  constructor(aspect: number, mapBounds: { xMin: number; xMax: number; zMin: number; zMax: number }) {
    this.mapBounds = mapBounds;
    this.viewportConfig = ViewportManager.calculateAdaptiveViewport(aspect);

    // Criar câmera com configuração inicial
    this.camera = new THREE.PerspectiveCamera(
      this.viewportConfig.fov,
      aspect,
      0.1,
      1000
    );

    this.initializePosition();

    console.log("📷 CameraController initialized:", {
      viewport: `${this.viewportConfig.width.toFixed(1)}x${this.viewportConfig.height.toFixed(1)}`,
      fov: this.viewportConfig.fov,
      distance: this.viewportConfig.distance
    });
  }

  private initializePosition(): void {
    // Posição inicial no centro do mapa
    const centerX = (this.mapBounds.xMin + this.mapBounds.xMax) / 2;
    const centerZ = (this.mapBounds.zMin + this.mapBounds.zMax) / 2;

    this.camera.position.set(centerX, this.viewportConfig.distance, centerZ);
    this.camera.lookAt(centerX, 0, centerZ);
  }

  /**
   * Define o alvo para a câmera seguir
   */
  public setTarget(target: { x: number; z: number }): void {
    this.target = target;
  }

  /**
   * Atualiza a posição da câmera baseada no alvo
   */
  public update(): void {
    if (!this.target) return;

    // Calcular posição ideal da câmera
    const cameraPosition = ViewportManager.calculateCameraPosition(
      this.target,
      this.mapBounds,
      this.viewportConfig
    );

    // Atualizar posição da câmera
    this.camera.position.set(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z
    );

    // Fazer a câmera olhar para baixo no ponto onde está
    this.camera.lookAt(cameraPosition.x, 0, cameraPosition.z);
  }

  /**
   * Atualiza configuração para novo aspect ratio
   */
  public updateForResize(aspect: number): void {
    // Recalcular viewport adaptativo
    this.viewportConfig = ViewportManager.calculateAdaptiveViewport(aspect);

    // Atualizar propriedades da câmera
    this.camera.fov = this.viewportConfig.fov;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();

    // Recalcular posição se tiver alvo
    if (this.target) {
      const cameraPosition = ViewportManager.calculateCameraPosition(
        this.target,
        this.mapBounds,
        this.viewportConfig
      );

      this.camera.position.set(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z
      );
    }

    console.log("📷 CameraController updated for resize:", {
      aspect: aspect.toFixed(3),
      viewport: `${this.viewportConfig.width.toFixed(1)}x${this.viewportConfig.height.toFixed(1)}`,
      fov: this.viewportConfig.fov
    });
  }

  /**
   * Atualiza bounds do mapa
   */
  public setMapBounds(bounds: { xMin: number; xMax: number; zMin: number; zMax: number }): void {
    this.mapBounds = bounds;
  }

  /**
   * Obtém a câmera Three.js
   */
  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  /**
   * Obtém configuração atual do viewport
   */
  public getViewportConfig(): ViewportConfig {
    return { ...this.viewportConfig };
  }

  /**
   * Obtém informações de debug
   */
  public getDebugInfo() {
    return {
      target: this.target,
      mapBounds: this.mapBounds,
      viewportConfig: this.viewportConfig,
      cameraPosition: {
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z
      }
    };
  }

  /**
   * Limpeza de recursos
   */
  public dispose(): void {
    // Câmera será limpada pelo Three.js automaticamente
    this.target = null;
    console.log("📷 CameraController disposed");
  }
}