import * as THREE from 'three';

/**
 * Raycaster-based object picker.
 * Emits 'object-select' events on the window.
 */
export class Picker {
  #raycaster = new THREE.Raycaster();
  #pointer = new THREE.Vector2();
  #camera;
  #objects;
  #domElement;

  constructor(camera, objects, domElement) {
    this.#camera = camera;
    this.#objects = objects;
    this.#domElement = domElement;
    domElement.addEventListener('click', this.#onClick);
  }

  dispose() {
    this.#domElement.removeEventListener('click', this.#onClick);
  }

  #onClick = (e) => {
    const rect = this.#domElement.getBoundingClientRect();
    this.#pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.#pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.#raycaster.setFromCamera(this.#pointer, this.#camera);
    // Only raycast visible meshes so hidden objects are skipped
    const visibleMeshes = this.#objects.filter((o) => o.mesh && o.mesh.visible).map((o) => o.mesh);
    const intersects = this.#raycaster.intersectObjects(visibleMeshes);
    let selectedName = null;

    if (intersects.length > 0) {
      const firstHit = intersects[0];
      const obj = this.#objects.find((o) => o.mesh === firstHit.object);
      const name = obj ? obj.name : firstHit.object.name;
      const label = obj ? obj.label : 'Khác';
      const { x, y, z } = firstHit.point;

      console.log(
        `%c[Picker] Hit: ${name} (${label}) at (${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)}) | Dist: ${firstHit.distance.toFixed(4)}`,
        'color: #00ff00; font-weight: bold',
      );

      // Group hits just for debug-intersects event if needed, but we don't log them anymore
      const hitNames = [
        ...new Set(
          intersects.map((hit) => {
            const o = this.#objects.find((obj) => obj.mesh === hit.object);
            return o ? o.name : hit.object.name;
          }),
        ),
      ];

      selectedName = name;

      window.dispatchEvent(
        new CustomEvent('debug-intersects', {
          detail: hitNames,
        }),
      );
    }

    window.dispatchEvent(
      new CustomEvent('object-select', {
        detail: selectedName,
      }),
    );
  };
}
