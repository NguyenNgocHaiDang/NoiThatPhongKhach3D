import * as THREE from 'three';

export class Camera {
  /** @type {THREE.PerspectiveCamera} */
  instance;

  constructor() {
    this.instance = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.instance.position.set(5, 4, 8); // Góc nhìn phòng từ bên ngoài
    this.instance.lookAt(0, 1, 0);
  }

  resize() {
    this.instance.aspect = window.innerWidth / window.innerHeight;
    this.instance.updateProjectionMatrix();
  }
}
