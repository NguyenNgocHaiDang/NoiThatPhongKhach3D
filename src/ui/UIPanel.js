/**
 * UI Panel Controller
 * Handles all DOM interactions: tabs, layers, materials, lights
 */
export class UIPanel {
  #objectManager;
  #lightSystem;
  #selectedObject = null;

  constructor(objectManager, lightSystem) {
    this.#objectManager = objectManager;
    this.#lightSystem = lightSystem;

    // Seed _matType so in-place update works from first change
    objectManager.objects.forEach((o) => {
      o._matType = 'standard';
    });

    this.#initTabs();
    this.#initPanel();
    this.#buildLayerList();
    this.#initMaterialPanel();
    this.#initLightPanel();
    this.#initObjectSelect();
    this.#initPicker();
  }

  /* ─── Tabs ─────────────────────────────────── */
  #initTabs() {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
      });
    });
  }

  /* ─── Panel collapse ────────────────────────── */
  #initPanel() {
    const panel = document.getElementById('control-panel');
    const toggleBtn = document.getElementById('panel-toggle');

    toggleBtn?.addEventListener('click', () => {
      const collapsed = panel.classList.toggle('collapsed');
      document.body.classList.toggle('panel-collapsed', collapsed);
      // Flip arrow icon
      toggleBtn.textContent = collapsed ? '›' : '‹';
    });
  }

  /* ─── Layer list ────────────────────────────── */
  #buildLayerList() {
    const list = document.getElementById('layer-list');
    if (!list) return;
    list.innerHTML = '';

    // Gom các object có cùng groupId thành 1 entry
    const seen = new Set();
    const entries = [];

    this.#objectManager.objects.forEach((obj) => {
      if (!obj.groupId) return;

      const key = obj.groupId;
      if (seen.has(key)) return;
      seen.add(key);

      const count = this.#objectManager.objects.filter((o) => o.groupId === obj.groupId).length;
      entries.push({
        repName: obj.name,
        color: obj.color,
        count,
        label: obj.groupLabel,
      });
    });

    console.log(
      `%c [UI] Hiển thị ${entries.length} nhóm được định nghĩa (${this.#objectManager.objects.length} mảnh tổng cộng) `,
      'color: #7c6bff',
    );

    entries.forEach(({ repName, count, color, label }) => {
      const displayName = label;

      const item = document.createElement('div');
      item.className = 'layer-item';
      item.dataset.name = repName;
      item.innerHTML = `
        <span class="layer-color" style="background:${color}"></span>
        <span class="layer-name">${displayName}</span>
        <button class="layer-toggle" title="Ẩn/Hiện nhóm">👁</button>
      `;

      let visible = true;
      item.querySelector('.layer-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        visible = !visible;
        this.#objectManager.setVisible(repName, visible); // setVisible đã xử lý cả nhóm
        item.classList.toggle('hidden-obj', !visible);
      });

      item.addEventListener('click', () => {
        this.#selectObject(repName);
        document.querySelector('[data-tab="materials"]')?.click();
      });

      list.appendChild(item);
    });
  }

  /* ─── Material Panel ────────────────────────── */
  #initMaterialPanel() {
    const roughSlider = document.getElementById('mat-roughness');
    const metalSlider = document.getElementById('mat-metalness');
    const colorPicker = document.getElementById('mat-color');
    const roughVal = document.getElementById('roughness-val');
    const metalVal = document.getElementById('metalness-val');
    const colorHex = document.getElementById('mat-color-hex');
    const typeSelect = document.getElementById('mat-type-select');
    const objSelect = document.getElementById('mat-object-select');

    // Helper: apply current panel state to selected object immediately
    const applyNow = () => {
      const name = objSelect?.value;
      const type = typeSelect?.value ?? 'standard';
      const color = colorPicker?.value ?? '#ffffff';
      const rough = parseFloat(roughSlider?.value ?? 0.5);
      const metal = parseFloat(metalSlider?.value ?? 0.0);
      if (name) this.#objectManager.applyMaterial(name, type, color, rough, metal);
    };

    // Update display text + apply real-time on every input
    roughSlider?.addEventListener('input', () => {
      roughVal.textContent = parseFloat(roughSlider.value).toFixed(2);
      applyNow();
    });
    metalSlider?.addEventListener('input', () => {
      metalVal.textContent = parseFloat(metalSlider.value).toFixed(2);
      applyNow();
    });
    colorPicker?.addEventListener('input', () => {
      colorHex.textContent = colorPicker.value;
      applyNow();
    });
    colorPicker?.addEventListener('change', () => {
      colorHex.textContent = colorPicker.value;
      applyNow();
    });

    // Show/hide controls based on material type
    const updateVisibility = () => {
      const type = typeSelect.value;
      const isOriginal = type === 'original';
      const showColor = !isOriginal && type !== 'normal';
      const showRough = ['standard', 'phong'].includes(type);
      const showMetal = type === 'standard';

      document.querySelector('.color-row')?.parentElement &&
        (document.querySelector('.color-row').parentElement.style.display = showColor ? '' : 'none');
      document.getElementById('roughness-group').style.display = showRough ? '' : 'none';
      document.getElementById('metalness-group').style.display = showMetal ? '' : 'none';
    };

    typeSelect?.addEventListener('change', () => {
      updateVisibility();
      applyNow();
    });
    updateVisibility(); // initial state

    // Button still works as a manual trigger
    document.getElementById('apply-material-btn')?.addEventListener('click', applyNow);
  }

  #initObjectSelect() {
    const sel = document.getElementById('mat-object-select');
    if (!sel) return;
    sel.innerHTML = ''; // Clear existing options

    const seen = new Set();
    this.#objectManager.objects.forEach((obj) => {
      if (!obj.groupId) return;
      const key = obj.groupId;
      if (seen.has(key)) return;
      seen.add(key);

      const opt = document.createElement('option');
      opt.value = obj.name; // Keep repName as value for Material application
      opt.textContent = obj.groupLabel;
      sel.appendChild(opt);
    });
  }

  /* ─── Light Panel ───────────────────────────── */
  #initLightPanel() {
    const config = [
      { key: 'ambient', toggleId: 'ambient-toggle', intId: 'ambient-intensity', intValId: 'ambient-int-val' },
      {
        key: 'directional',
        toggleId: 'dir-toggle',
        intId: 'dir-intensity',
        intValId: 'dir-int-val',
        colorId: 'dir-color',
      },
      {
        key: 'point',
        toggleId: 'point-toggle',
        intId: 'point-intensity',
        intValId: 'point-int-val',
        colorId: 'point-color',
      },
      {
        key: 'spot',
        toggleId: 'spot-toggle',
        intId: 'spot-intensity',
        intValId: 'spot-int-val',
        colorId: 'spot-color',
      },
    ];

    for (const cfg of config) {
      const toggle = document.getElementById(cfg.toggleId);
      const intSlider = document.getElementById(cfg.intId);
      const intVal = document.getElementById(cfg.intValId);
      const colorPick = cfg.colorId ? document.getElementById(cfg.colorId) : null;

      toggle?.addEventListener('change', () => {
        this.#lightSystem.setVisible(cfg.key, toggle.checked);
      });

      intSlider?.addEventListener('input', () => {
        if (intVal) intVal.textContent = intSlider.value;
        this.#lightSystem.setIntensity(cfg.key, parseFloat(intSlider.value));
      });

      colorPick?.addEventListener('input', () => {
        this.#lightSystem.setColor(cfg.key, colorPick.value);
      });
    }
  }

  /* ─── Picker ─────────────────────────────────── */
  #initPicker() {
    window.addEventListener('object-select', this.#onObjectSelect);
    window.addEventListener('debug-intersects', this.#onDebugIntersects);
  }

  #onObjectSelect = (e) => {
    const name = e.detail;
    const selected = document.getElementById('selected-obj');
    if (name) {
      if (selected) selected.textContent = `📌 ${name}`;
      this.#selectObject(name);
    } else {
      if (selected) selected.textContent = 'Chưa chọn đối tượng';
      this.#clearSelection();
    }
  };

  dispose() {
    console.log('[UI] Dọn dẹp listener...');
    window.removeEventListener('object-select', this.#onObjectSelect);
    window.removeEventListener('debug-intersects', this.#onDebugIntersects);
  }

  #onDebugIntersects = (e) => {
    const names = e.detail;
    if (names && names.length > 0) {
      this.#objectManager.highlightObjects(names, 800);
    }
  };

  #selectObject(name) {
    this.#selectedObject = name;

    const targets = this.#objectManager.getGroupObjects(name);
    const repName = targets[0]?.name;

    document.querySelectorAll('.layer-item').forEach((item) => {
      item.classList.toggle('selected', item.dataset.name === repName);
    });

    const objSel = document.getElementById('mat-object-select');
    if (objSel) objSel.value = name;

    const statusText = document.getElementById('selected-obj');
    if (statusText) statusText.textContent = `📌 ${name}`;
  }

  #clearSelection() {
    this.#selectedObject = null;
    document.querySelectorAll('.layer-item').forEach((item) => item.classList.remove('selected'));
  }
}
