import { OrbitControls as ThreeOrbitControls } from 'three/addons/controls/OrbitControls.js';

export class OrbitControls {
  /** @type {ThreeOrbitControls} */
  instance;

  constructor(camera, domElement) {
    this.instance = new ThreeOrbitControls(camera, domElement);
    this.instance.enableDamping = true;
    this.instance.dampingFactor = 0.06;
    this.instance.minDistance = 2;
    this.instance.maxDistance = 60;
    this.instance.maxPolarAngle = Math.PI * 0.85;
    this.instance.target.set(0, 1, 0);
    this.instance.update(); // Bắt buộc gọi sau khi set target
  }

  update() {
    this.instance.update();
  }
}
