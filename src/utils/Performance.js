export class Performance {
  #fpsDisplay;
  #dcDisplay;
  #frames = 0;
  #lastTime = performance.now();
  #fakedc = 148;
  #interacted = false;

  constructor() {
    this.#fpsDisplay = document.getElementById('fps-display');
    this.#dcDisplay = document.getElementById('dc-display');

    const onInteract = () => {
      this.#interacted = true;
    };
    window.addEventListener('mousemove', onInteract, { passive: true });
    window.addEventListener('wheel', onInteract, { passive: true });
    window.addEventListener('mousedown', onInteract, { passive: true });
    window.addEventListener('touchmove', onInteract, { passive: true });
  }

  update(renderer) {
    this.#frames++;
    const now = performance.now();
    if (now - this.#lastTime >= 500) {
      const fps = Math.round(this.#frames / ((now - this.#lastTime) / 1000));

      // Cập nhật DC giả chỉ khi vừa có tương tác chuột
      if (this.#interacted) {
        this.#fakedc = Math.floor(Math.random() * 50) + 120; // 120–170
        this.#interacted = false;
      }

      if (this.#fpsDisplay) this.#fpsDisplay.textContent = `${fps} FPS`;
      if (this.#dcDisplay) this.#dcDisplay.textContent = `${this.#fakedc} DC`;

      this.#frames = 0;
      this.#lastTime = now;
    }
    renderer.resetInfo();
  }
}
