import * as THREE from 'three';

export class Renderer {
  /** @type {THREE.WebGLRenderer} */
  instance;

  constructor(canvas) {
    this.instance = new THREE.WebGLRenderer({
      canvas,
      antialias: false, // Off for performance
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });

    this.instance.setPixelRatio(1); // Fixed 1x for max FPS
    this.instance.setSize(window.innerWidth, window.innerHeight);
    this.instance.shadowMap.enabled = false; // TẮT – không có light nào cast shadow
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1.0;
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
  }

  resize() {
    this.instance.setSize(window.innerWidth, window.innerHeight);
  }

  render(scene, camera) {
    this.instance.render(scene, camera);
  }

  get drawCalls() {
    return this.instance.info.render.calls;
  }

  resetInfo() {
    this.instance.info.reset();
  }
}
