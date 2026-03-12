import * as THREE from 'three';

/**
 * Material library – registry of all material presets.
 * Each preset factory returns a new material instance.
 */
export class MaterialLibrary {
  static #presets = {
    standard: (color, rough, metal) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: rough,
        metalness: metal,
        envMapIntensity: 1.0,
      }),

    phong: (color) =>
      new THREE.MeshPhongMaterial({
        color,
        shininess: 120,
        specular: new THREE.Color(0xffffff),
      }),

    toon: (color) =>
      new THREE.MeshToonMaterial({ color }),

    wireframe: (color) =>
      new THREE.MeshBasicMaterial({ color, wireframe: true }),

    normal: () =>
      new THREE.MeshNormalMaterial({ flatShading: false }),
  };

  /**
   * @param {'standard'|'phong'|'toon'|'wireframe'|'normal'} type
   * @param {number|string} color  hex color
   * @param {number} roughness
   * @param {number} metalness
   */
  static create(type, color = 0xffffff, roughness = 0.5, metalness = 0.0) {
    const factory = this.#presets[type] ?? this.#presets.standard;
    return factory(color, roughness, metalness);
  }

  static get types() {
    return Object.keys(this.#presets);
  }
}
