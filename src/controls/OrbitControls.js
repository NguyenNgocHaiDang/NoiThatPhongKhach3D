import * as THREE from 'three';
import { OrbitControls as ThreeOrbitControls } from "three/addons/controls/OrbitControls.js";

export class OrbitControls {
  /** @type {ThreeOrbitControls} */
  instance;
  #defaultTarget = new THREE.Vector3(0, 1, 0);

  constructor(camera, domElement, options = {}) {
    const {
      target = [0, 1, 0],
      minDistance = 2,
      maxDistance = 60,
      maxPolarAngle = Math.PI * 0.85,
    } = options;

    this.#defaultTarget.set(...target);
    this.instance = new ThreeOrbitControls(camera, domElement);
    this.instance.enableDamping = true;
    this.instance.dampingFactor = 0.06;
    this.instance.minDistance = minDistance;
    this.instance.maxDistance = maxDistance;
    this.instance.maxPolarAngle = maxPolarAngle;
    this.instance.target.copy(this.#defaultTarget);
    this.instance.update();
  }

  focusOn(target) {
    const nextTarget = target.clone();
    const delta = nextTarget.sub(this.instance.target);
    this.instance.target.add(delta);
    this.instance.object.position.add(delta);
    this.instance.update();
  }

  resetFocus() {
    this.focusOn(this.#defaultTarget);
  }

  update() {
    this.instance.update();
  }

  setEnabled(enabled) {
    this.instance.enabled = enabled;
  }
}
