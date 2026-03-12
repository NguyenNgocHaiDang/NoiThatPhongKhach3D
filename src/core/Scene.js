import * as THREE from 'three';

export class SceneSetup {
  /** @type {THREE.Scene} */
  instance;

  constructor() {
    this.instance = new THREE.Scene();
    this.instance.background = new THREE.Color(0xffffff);
    // No fog for performance
  }
}
