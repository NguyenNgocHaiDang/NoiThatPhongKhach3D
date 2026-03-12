export class Loop {
  #renderer;
  #scene;
  #camera;
  #callbacks = [];
  #running = false;
  #frameId = null;
  #clock;

  constructor(renderer, scene, camera) {
    this.#renderer = renderer;
    this.#scene = scene;
    this.#camera = camera;

    // Import clock lazily
    import('three').then(({ Clock }) => {
      this.#clock = new Clock();
    });
  }

  addCallback(fn) {
    this.#callbacks.push(fn);
  }

  start() {
    if (this.#running) return;
    this.#running = true;
    this.#tick();
  }

  stop() {
    this.#running = false;
    if (this.#frameId) cancelAnimationFrame(this.#frameId);
  }

  #tick = () => {
    if (!this.#running) return;
    const delta = this.#clock?.getDelta() ?? 0.016;
    for (const cb of this.#callbacks) cb(delta);
    this.#renderer.render(this.#scene, this.#camera);
    this.#frameId = requestAnimationFrame(this.#tick);
  };
}
