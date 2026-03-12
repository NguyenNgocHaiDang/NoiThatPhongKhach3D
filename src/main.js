import './styles/main.css';
import { Renderer } from './core/Renderer.js';
import { SceneSetup } from './core/Scene.js';
import { Camera } from './core/Camera.js';
import { OrbitControls } from './controls/OrbitControls.js';
import { LightSystem } from './lights/LightSystem.js';
import { ObjectManager } from './objects/ObjectManager.js';
import { UIPanel } from './ui/UIPanel.js';
import { Performance } from './utils/Performance.js';
import { Picker } from './utils/Picker.js';

class App {
  #requestID;
  #renderer;
  #scene;
  #controls;
  #picker;
  #uiPanel;

  constructor() {
    console.log('%c [App] Đang khởi tạo ứng dụng... ', 'background: #000; color: #fff');
    this.#init();
  }

  async #init() {
    // ── Pre-Cleanup ───────────────────────────────
    // Nếu đã có App chạy (do HMR), dừng nó lại trước khi tạo cái mới
    if (window.__currentApp) {
      window.__currentApp.dispose();
    }
    window.__currentApp = this;

    // ── Core ──────────────────────────────────────
    const canvas = document.getElementById('three-canvas');
    this.#renderer = new Renderer(canvas);
    const { instance: scene } = new SceneSetup();
    this.#scene = scene;
    const { instance: camera } = new Camera();

    // ── Controls ──────────────────────────────────
    this.#controls = new OrbitControls(camera, canvas);

    // ── Lights ────────────────────────────────────
    this.#setProgress(20, 'Xây dựng hệ thống ánh sáng...');
    const lightSystem = new LightSystem(scene);

    // ── Load 3D Model ─────────────────────────────
    this.#setProgress(30, 'Đang tải mô hình 3D...');
    const objectManager = new ObjectManager(scene, {
      onProgress: (pct) => {
        const mapped = 30 + Math.round(pct * 0.5); // 30-80%
        this.#setProgress(mapped, `Đang tải mô hình 3D... ${pct}%`);
      },
      onLoaded: () => {
        this.#setProgress(85, 'Mô hình đã tải xong!');
      },
    });

    try {
      await objectManager.load();
    } catch (e) {
      console.error('Failed to load model:', e);
      this.#setProgress(100, 'Lỗi khi tải mô hình!');
      return;
    }

    // ── Picker ────────────────────────────────────
    const allMeshes = objectManager.objects.flatMap((o) =>
      o.meshes.map((mesh) => ({ mesh, name: o.name, label: o.label })),
    );
    this.#picker = new Picker(camera, allMeshes, canvas);

    // ── Performance ───────────────────────────────
    const perf = new Performance();

    // ── Resize ────────────────────────────────────
    this._onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      this.#renderer.resize();
    };
    window.addEventListener('resize', this._onResize);

    // ── UI ────────────────────────────────────────
    this.#setProgress(90, 'Khởi tạo giao diện...');
    this.#uiPanel = new UIPanel(objectManager, lightSystem);

    this.#renderer.instance.compile(scene, camera);

    // ── Start render loop ─────────────────────────
    this.#setProgress(100, 'Sẵn sàng!');
    setTimeout(() => {
      document.getElementById('loading-screen')?.classList.add('hidden');
    }, 600);

    const r = this.#renderer.instance;
    const tick = () => {
      this.#requestID = requestAnimationFrame(tick);
      this.#controls.update();
      r.render(scene, camera);
      perf.update(this.#renderer);
    };
    tick();
  }

  dispose() {
    console.log('[App] Đang dọn dẹp App cũ...');
    if (this.#requestID) cancelAnimationFrame(this.#requestID);
    if (this._onResize) window.removeEventListener('resize', this._onResize);

    if (this.#picker) this.#picker.dispose();
    if (this.#uiPanel) this.#uiPanel.dispose();

    if (this.#renderer) {
      this.#renderer.instance.dispose();
      this.#renderer.instance.forceContextLoss();
    }

    // Xóa trắng canvas
    const canvas = document.getElementById('three-canvas');
    if (canvas) {
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
      }
    }
  }

  #setProgress(pct, text) {
    const bar = document.getElementById('loader-bar');
    const txt = document.getElementById('loader-text');
    if (bar) bar.style.width = `${pct}%`;
    if (txt) txt.textContent = text;
  }
}

new App();
