import * as THREE from 'three';

export class LayoutDesigner {
  static #ROTATE_STEP = Math.PI / 12;
  static #SURFACE_GAP = 0.01;
  static #SUPPORT_RAY_HEIGHT = 12;
  static #SUPPORT_CLUSTER_EPSILON = 0.08;
  static #MIN_SUPPORT_SAMPLES = 3;
  #objectManager;
  #orbitControls;
  #camera;
  #domElement;
  #raycaster = new THREE.Raycaster();
  #surfaceNormalMatrix = new THREE.Matrix3();
  #pointer = new THREE.Vector2();
  #dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  #dragStartPoint = new THREE.Vector3();
  #dragCurrentPoint = new THREE.Vector3();
  #groupStartPosition = new THREE.Vector3();
  #groupNextPosition = new THREE.Vector3();
  #dragOffset = new THREE.Vector3();
  #dragBottomOffset = 0;
  #supportRayOrigin = new THREE.Vector3();
  #supportSamplePoint = new THREE.Vector3();
  #supportBoundsSize = new THREE.Vector3();
  #downDirection = new THREE.Vector3(0, -1, 0);
  #draggableEntries = [];
  #enabledNames = new Set();
  #selectedName = null;
  #enabled = false;
  #isDragging = false;
  #activePointerId = null;

  constructor(camera, domElement, objectManager, orbitControls) {
    this.#camera = camera;
    this.#domElement = domElement;
    this.#objectManager = objectManager;
    this.#orbitControls = orbitControls;
    this.#draggableEntries = this.#objectManager.getDraggableEntries();
    this.#enabledNames = new Set(this.#draggableEntries.map(({ repName }) => repName));
    this.#syncControlledVisibility();

    this.#initUI();
    this.#bindEvents();
    this.#renderStatus();
  }

  dispose() {
    this.#endDrag();
    this.#domElement.removeEventListener('pointerdown', this.#handlePointerDown);
    window.removeEventListener('pointermove', this.#handlePointerMove);
    window.removeEventListener('pointerup', this.#handlePointerUp);
    window.removeEventListener('pointercancel', this.#handlePointerUp);
    window.removeEventListener('keydown', this.#handleKeyDown);
    this.#domElement.classList.remove('layout-enabled', 'layout-dragging');
    this.#objectManager.clearSelectionHighlight();
  }

  #initUI() {
    this.#renderControlledItems();
    this.#refreshObjectSelect();

    const select = document.getElementById('layout-object-select');
    select?.addEventListener('change', () => {
      this.#selectGroup(select.value || null);
    });

    document.getElementById('layout-select-all-btn')?.addEventListener('click', () => {
      this.#enabledNames = new Set(this.#draggableEntries.map(({ repName }) => repName));
      this.#syncControlledVisibility();
      this.#renderControlledItems();
      this.#refreshObjectSelect();
      this.#renderStatus();
    });

    document.getElementById('layout-clear-all-btn')?.addEventListener('click', () => {
      this.#enabledNames.clear();
      this.#syncControlledVisibility();
      this.#renderControlledItems();
      this.#refreshObjectSelect();
      this.#renderStatus();
    });

    const toggle = document.getElementById('layout-mode-toggle');
    toggle?.addEventListener('change', () => {
      this.#setEnabled(toggle.checked);
    });

    document.getElementById('reset-layout-btn')?.addEventListener('click', () => {
      if (!this.#selectedName) return;
      this.#objectManager.resetGroupPosition(this.#selectedName);
      this.#renderStatus();
    });

    document.getElementById('reset-all-layout-btn')?.addEventListener('click', () => {
      this.#objectManager.resetAllGroupPositions();
      this.#updateRotationUI();
      this.#renderStatus();
    });

    document.getElementById('rotate-left-btn')?.addEventListener('click', () => {
      this.#rotateSelected(-LayoutDesigner.#ROTATE_STEP);
    });

    document.getElementById('rotate-right-btn')?.addEventListener('click', () => {
      this.#rotateSelected(LayoutDesigner.#ROTATE_STEP);
    });

    const rotationSlider = document.getElementById('layout-rotation');
    rotationSlider?.addEventListener('input', () => {
      if (!this.#selectedName) return;
      const degrees = Number(rotationSlider.value);
      this.#objectManager.setGroupRotationY(this.#selectedName, THREE.MathUtils.degToRad(degrees));
      this.#updateRotationUI();
      this.#renderStatus();
    });
  }

  #bindEvents() {
    this.#domElement.addEventListener('pointerdown', this.#handlePointerDown);
    window.addEventListener('pointermove', this.#handlePointerMove);
    window.addEventListener('pointerup', this.#handlePointerUp);
    window.addEventListener('pointercancel', this.#handlePointerUp);
    window.addEventListener('keydown', this.#handleKeyDown);
  }

  #handlePointerDown = (event) => {
    if (!this.#enabled || event.button !== 0) return;

    const hit = this.#pickMovableGroup(event);
    if (!hit) return;

    const groupName = this.#objectManager.getGroupNameFromMesh(hit.object);
    if (!groupName) return;

    this.#selectGroup(groupName);

    this.#dragPlane.set(new THREE.Vector3(0, 1, 0), -hit.point.y);
    if (!this.#raycaster.ray.intersectPlane(this.#dragPlane, this.#dragStartPoint)) return;

    const currentPosition = this.#objectManager.getGroupPosition(groupName);
    if (!currentPosition) return;

    this.#groupStartPosition.copy(currentPosition);
    this.#dragOffset.set(0, 0, 0);
    this.#dragBottomOffset = this.#getBottomOffset(groupName, this.#groupStartPosition.y);
    this.#isDragging = true;
    this.#activePointerId = event.pointerId;
    this.#domElement.classList.add('layout-dragging');
    this.#orbitControls.setEnabled(false);
    this.#domElement.setPointerCapture?.(event.pointerId);
    this.#renderStatus();
  };

  #handlePointerMove = (event) => {
    if (!this.#isDragging || event.pointerId !== this.#activePointerId || !this.#selectedName) return;

    this.#updatePointer(event);
    this.#raycaster.setFromCamera(this.#pointer, this.#camera);

    if (!this.#raycaster.ray.intersectPlane(this.#dragPlane, this.#dragCurrentPoint)) return;

    this.#groupNextPosition.copy(this.#dragCurrentPoint);

    const supportHit = this.#pickSupportSurface(this.#groupNextPosition);
    if (supportHit) {
      this.#groupNextPosition.y = supportHit.point.y - this.#dragBottomOffset + LayoutDesigner.#SURFACE_GAP;
    } else {
      this.#groupNextPosition.y = this.#getGroundPositionY();
    }

    this.#objectManager.setGroupPosition(this.#selectedName, this.#groupNextPosition);
  };

  #handlePointerUp = (event) => {
    if (event.pointerId !== this.#activePointerId) return;
    this.#endDrag();
  };

  #handleKeyDown = (event) => {
    if (!this.#enabled || !this.#selectedName) return;
    if (event.target instanceof HTMLElement) {
      const tagName = event.target.tagName;
      if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(tagName)) return;
    }

    if (event.key === 'q' || event.key === 'Q') {
      event.preventDefault();
      this.#rotateSelected(-LayoutDesigner.#ROTATE_STEP);
    }

    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault();
      this.#rotateSelected(LayoutDesigner.#ROTATE_STEP);
    }
  };

  #endDrag() {
    if (this.#activePointerId !== null) {
      this.#domElement.releasePointerCapture?.(this.#activePointerId);
    }

    this.#isDragging = false;
    this.#activePointerId = null;
    this.#domElement.classList.remove('layout-dragging');
    this.#orbitControls.setEnabled(true);
    this.#renderStatus();
  }

  #setEnabled(enabled) {
    this.#enabled = enabled;
    if (!enabled) {
      this.#endDrag();
      this.#selectGroup(null);
    }
    this.#domElement.classList.toggle('layout-enabled', enabled);
    this.#renderStatus();
  }

  #pickMovableGroup(event) {
    const meshes = this.#objectManager.getDraggableMeshes();
    if (meshes.length === 0 || this.#enabledNames.size === 0) return null;

    this.#updatePointer(event);
    this.#raycaster.setFromCamera(this.#pointer, this.#camera);

    const hits = this.#raycaster.intersectObjects(meshes, false);
    return hits.find((hit) => this.#enabledNames.has(this.#objectManager.getGroupNameFromMesh(hit.object))) ?? null;
  }

  #pickSupportSurface(position) {
    if (!this.#selectedName) return null;

    const meshes = this.#objectManager.getPlacementMeshes(this.#selectedName);
    if (meshes.length === 0) return null;

    const bounds = this.#objectManager.getGroupBounds(this.#selectedName);
    if (!bounds) return null;

    const size = bounds.getSize(this.#supportBoundsSize);
    const sampleRadiusX = Math.max(size.x * 0.32, 0.05);
    const sampleRadiusZ = Math.max(size.z * 0.32, 0.05);
    const sampleOffsets = [
      [0, 0],
      [-sampleRadiusX, -sampleRadiusZ],
      [-sampleRadiusX, sampleRadiusZ],
      [sampleRadiusX, -sampleRadiusZ],
      [sampleRadiusX, sampleRadiusZ],
    ];

    const supportClusters = [];

    for (const [offsetX, offsetZ] of sampleOffsets) {
      this.#supportSamplePoint.set(position.x + offsetX, position.y, position.z + offsetZ);
      this.#supportRayOrigin.set(
        this.#supportSamplePoint.x,
        this.#supportSamplePoint.y + LayoutDesigner.#SUPPORT_RAY_HEIGHT,
        this.#supportSamplePoint.z,
      );
      this.#raycaster.set(this.#supportRayOrigin, this.#downDirection);

      const hits = this.#raycaster.intersectObjects(meshes, false);
      if (hits.length === 0) continue;

      const upwardHit = hits.find((hit) => this.#isSurfaceFacingUp(hit)) ?? hits[0];
      const cluster = supportClusters.find(
        (entry) => Math.abs(entry.point.y - upwardHit.point.y) <= LayoutDesigner.#SUPPORT_CLUSTER_EPSILON,
      );

      if (cluster) {
        cluster.count += 1;
      } else {
        supportClusters.push({ point: upwardHit.point.clone(), count: 1 });
      }
    }

    if (supportClusters.length === 0) return null;

    supportClusters.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.point.y - b.point.y;
    });

    const bestCluster = supportClusters[0];
    const groundY = this.#objectManager.getSceneFloorY();

    if (
      bestCluster.point.y > groundY + LayoutDesigner.#SUPPORT_CLUSTER_EPSILON &&
      bestCluster.count < LayoutDesigner.#MIN_SUPPORT_SAMPLES
    ) {
      return null;
    }

    return bestCluster;
  }

  #isSurfaceFacingUp(hit) {
    if (!hit.face || !hit.object) return false;

    this.#surfaceNormalMatrix.getNormalMatrix(hit.object.matrixWorld);
    const worldNormal = hit.face.normal.clone().applyMatrix3(this.#surfaceNormalMatrix).normalize();
    return worldNormal.y >= 0.45;
  }

  #getBottomOffset(name, currentY) {
    const bounds = this.#objectManager.getGroupBounds(name);
    if (!bounds) return 0;
    return bounds.min.y - currentY;
  }

  #getGroundPositionY() {
    return this.#objectManager.getSceneFloorY() - this.#dragBottomOffset + LayoutDesigner.#SURFACE_GAP;
  }

  #updatePointer(event) {
    const rect = this.#domElement.getBoundingClientRect();
    this.#pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.#pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  #selectGroup(name) {
    const nextName = name && this.#enabledNames.has(name) ? name : null;

    if (!nextName && this.#isDragging) {
      this.#endDrag();
    }

    this.#selectedName = nextName;
    this.#objectManager.setSelectionHighlight(nextName);

    const select = document.getElementById('layout-object-select');
    if (select) select.value = nextName ?? '';

    this.#updateRotationUI();
    this.#renderStatus();
  }

  #renderControlledItems() {
    const list = document.getElementById('layout-controlled-list');
    const counter = document.getElementById('layout-controlled-count');
    if (!list) return;

    list.innerHTML = '';

    this.#draggableEntries.forEach(({ repName, label }) => {
      const row = document.createElement('label');
      row.className = 'layout-control-item';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = this.#enabledNames.has(repName);
      input.addEventListener('change', () => {
        if (input.checked) {
          this.#enabledNames.add(repName);
        } else {
          this.#enabledNames.delete(repName);
        }
        this.#syncControlledVisibility();
        this.#refreshObjectSelect();
        this.#renderControlledItems();
        this.#renderStatus();
      });

      const text = document.createElement('span');
      text.textContent = label;

      row.append(input, text);
      list.appendChild(row);
    });

    if (counter) {
      counter.textContent = `${this.#enabledNames.size}/${this.#draggableEntries.length} món`;
    }
  }

  #refreshObjectSelect() {
    const select = document.getElementById('layout-object-select');
    if (!select) return;

    select.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent =
      this.#enabledNames.size > 0 ? 'Chọn vật thể để sắp xếp' : 'Hãy bật ít nhất 1 vật thể để chỉnh';
    select.appendChild(placeholder);

    this.#draggableEntries
      .filter(({ repName }) => this.#enabledNames.has(repName))
      .forEach(({ repName, label }) => {
        const option = document.createElement('option');
        option.value = repName;
        option.textContent = label;
        select.appendChild(option);
      });

    if (!this.#selectedName || !this.#enabledNames.has(this.#selectedName)) {
      this.#selectGroup(null);
      return;
    }

    select.value = this.#selectedName;
  }

  #syncControlledVisibility() {
    this.#objectManager.setLayoutVisibility(this.#enabledNames);
  }

  #rotateSelected(deltaRadians) {
    if (!this.#selectedName) return;

    const current = this.#objectManager.getGroupRotationY(this.#selectedName);
    this.#objectManager.setGroupRotationY(this.#selectedName, LayoutDesigner.#normalizeRadians(current + deltaRadians));
    this.#updateRotationUI();
    this.#renderStatus();
  }

  static #normalizeRadians(radians) {
    return THREE.MathUtils.euclideanModulo(radians + Math.PI, Math.PI * 2) - Math.PI;
  }

  #updateRotationUI() {
    const rotationSlider = document.getElementById('layout-rotation');
    const rotationValue = document.getElementById('layout-rotation-value');
    const rotateLeftBtn = document.getElementById('rotate-left-btn');
    const rotateRightBtn = document.getElementById('rotate-right-btn');
    const resetLayoutBtn = document.getElementById('reset-layout-btn');

    const hasSelection = Boolean(this.#selectedName);
    if (rotateLeftBtn) rotateLeftBtn.disabled = !hasSelection;
    if (rotateRightBtn) rotateRightBtn.disabled = !hasSelection;
    if (resetLayoutBtn) resetLayoutBtn.disabled = !hasSelection;
    if (rotationSlider) rotationSlider.disabled = !hasSelection;

    if (!rotationSlider || !rotationValue) return;
    if (!hasSelection) {
      rotationSlider.value = '0';
      rotationValue.textContent = '0°';
      return;
    }

    const radians = LayoutDesigner.#normalizeRadians(this.#objectManager.getGroupRotationY(this.#selectedName));
    const normalizedDegrees = Math.round(THREE.MathUtils.radToDeg(radians));
    rotationSlider.value = String(normalizedDegrees);
    rotationValue.textContent = `${normalizedDegrees}°`;
  }

  #getSelectedLabel() {
    if (!this.#selectedName) return null;
    return this.#draggableEntries.find(({ repName }) => repName === this.#selectedName)?.label ?? null;
  }

  #renderStatus() {
    const status = document.getElementById('layout-status');
    if (!status) return;

    if (!this.#enabled) {
      status.textContent = 'Bật chế độ kéo thả để chọn đồ nội thất, di chuyển và xoay theo ý muốn.';
      return;
    }

    if (this.#enabledNames.size === 0) {
      status.textContent = 'Chưa có vật thể nào được bật để chỉnh. Hãy tick các món khách cần thao tác.';
      return;
    }

    const selectedLabel = this.#getSelectedLabel();
    if (this.#isDragging && selectedLabel) {
      status.textContent = `Đang kéo "${selectedLabel}". Thả chuột để chốt vị trí mới.`;
      return;
    }

    if (selectedLabel) {
      status.textContent = `Đã chọn "${selectedLabel}". Kéo để di chuyển, dùng nút xoay hoặc phím Q/E để xoay.`;
      return;
    }

    status.textContent = `Đang bật ${this.#enabledNames.size} món để chỉnh. Chọn trong danh sách hoặc click trực tiếp trong cảnh rồi kéo/xoay để sắp xếp.`;
  }
}
