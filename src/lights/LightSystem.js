import * as THREE from 'three';

export class LightSystem {
  lights = {};
  helpers = {};
  scene;

  constructor(scene) {
    this.scene = scene;
    this.#buildLights();
  }

  #buildLights() {
    const s = this.scene;

    // Ambient
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    ambient.name = 'ambient';
    s.add(ambient);
    this.lights.ambient = ambient;

    // Hemisphere
    const hemi = new THREE.HemisphereLight(0x4488ff, 0x442200, 0.4);
    hemi.name = 'hemi';
    s.add(hemi);
    this.lights.hemi = hemi;

    // Directional (sun)
    const dir = new THREE.DirectionalLight(0xffffff, 1.2); // Tăng nhẹ vì không còn shadow
    dir.name = 'directional';
    dir.position.set(10, 16, 8);
    dir.castShadow = false; // TẮT – cảnh tĩnh, tiết kiệm ~80 draw calls/frame
    s.add(dir);
    this.lights.directional = dir;

    // Point light (warm orange glow)
    const point = new THREE.PointLight(0xff6030, 80, 25, 2);
    point.name = 'point';
    point.position.set(-4, 3, 2);
    point.castShadow = false; // Disabled for performance
    s.add(point);
    this.lights.point = point;

    // Spot light (cool blue)
    const spot = new THREE.SpotLight(0x4080ff, 120, 30, Math.PI / 7, 0.3, 2);
    spot.name = 'spot';
    spot.position.set(6, 10, -4);
    spot.target.position.set(0, 0, 0);
    spot.castShadow = false; // Disabled for performance
    s.add(spot);
    s.add(spot.target);
    this.lights.spot = spot;

  }

  setIntensity(name, value) {
    if (this.lights[name]) this.lights[name].intensity = value;
  }

  setColor(name, hexString) {
    if (this.lights[name]) this.lights[name].color.set(hexString);
    if (this.helpers[name]) this.helpers[name].material.color.set(hexString);
  }

  setVisible(name, visible) {
    if (this.lights[name]) this.lights[name].visible = visible;
    if (this.helpers[name]) this.helpers[name].visible = visible;
  }

  // Static lights – no animation for performance
  update(delta) {}
}
