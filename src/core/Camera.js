import * as THREE from 'three';

export class Camera {
  /** @type {THREE.PerspectiveCamera} */
  instance;

  constructor(config = {}) {
    const {
      fov = 50,
      near = 0.1,
      far = 1000,
      position = [5, 4, 8],
      target = [0, 1, 0],
    } = config;

    this.instance = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      near,
      far,
    );
    this.instance.position.set(...position);
    this.instance.lookAt(...target);
  }

  resize() {
    this.instance.aspect = window.innerWidth / window.innerHeight;
    this.instance.updateProjectionMatrix();
  }
}
