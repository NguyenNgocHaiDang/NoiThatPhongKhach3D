/**
 * UI Panel Controller
 * Handles all DOM interactions: tabs, layers, materials, lights
 */
export class UIPanel {
  #objectManager;
  #lightSystem;
  #selectedObject = null;
  #onFocusGroup;
  #onResetFocus;

  constructor(objectManager, lightSystem, { onFocusGroup = null, onResetFocus = null } = {}) {
    this.#objectManager = objectManager;
    this.#lightSystem = lightSystem;
    this.#onFocusGroup = onFocusGroup;
    this.#onResetFocus = onResetFocus;

    // Seed _matType so in-place update works from first change
    objectManager.objects.forEach((o) => {
      o._matType = 'standard';
    });

    this.#initTabs();
    this.#initPanel();
    this.#initLayerFilter();
    this.#initMaterialPanel();
    this.#initLightPanel();
    this.#initObjectSelect();
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

  #getGroupEntries() {
    return this.#objectManager.getGroupEntries();
  }

  #initLayerFilter() {
    const sel = document.getElementById('layer-group-select');
    if (!sel) return;

    sel.innerHTML = '';

    const allOpt = document.createElement('option');
    allOpt.value = '__all__';
    allOpt.textContent = 'Hiển thị tất cả';
    sel.appendChild(allOpt);

    this.#getGroupEntries().forEach(({ repName, label }) => {
      const opt = document.createElement('option');
      opt.value = repName;
      opt.textContent = label;
      sel.appendChild(opt);
    });

    sel.addEventListener('change', () => {
      if (sel.value === '__all__') {
        this.#clearSelection();
        return;
      }

      this.#selectObject(sel.value);
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

    this.#getGroupEntries().forEach(({ repName, label }) => {
      const opt = document.createElement('option');
      opt.value = repName;
      opt.textContent = label;
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

  dispose() {}

  #selectObject(name) {
    this.#selectedObject = name;

    const targets = this.#objectManager.getGroupObjects(name);
    const repName = targets[0]?.name;

    if (repName) {
      this.#objectManager.isolateGroup(repName);
      this.#onFocusGroup?.(repName);
    }

    const layerSel = document.getElementById('layer-group-select');
    if (layerSel && repName) layerSel.value = repName;

    const objSel = document.getElementById('mat-object-select');
    if (objSel && repName) objSel.value = repName;
  }

  #clearSelection() {
    this.#selectedObject = null;
    this.#objectManager.setAllVisible(true);
    this.#onResetFocus?.();

    const layerSel = document.getElementById('layer-group-select');
    if (layerSel) layerSel.value = '__all__';
  }
}
