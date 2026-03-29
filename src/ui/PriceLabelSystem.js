export class PriceLabelSystem {
  #objectManager;
  #camera;
  #container;
  #labels = new Map();
  #toolbarPriceStrip;

  constructor(objectManager, camera) {
    this.#objectManager = objectManager;
    this.#camera = camera;

    this.#container = document.createElement('div');
    this.#container.id = 'price-label-layer';
    document.getElementById('app')?.appendChild(this.#container);
    this.#toolbarPriceStrip = document.getElementById('toolbar-price-strip');
    this.#syncToolbarPriceStrip();
  }

  dispose() {
    this.#labels.clear();
    this.#container.remove();
  }

  update() {
    const visibleGroups = this.#objectManager.getVisibleGroupEntries().filter((group) => group.priceLabel);
    const activeGroups = visibleGroups.length === 1 ? visibleGroups : [];
    const activeKeys = new Set(activeGroups.map((group) => group.groupId));

    this.#labels.forEach((label, groupId) => {
      if (!activeKeys.has(groupId)) {
        label.remove();
        this.#labels.delete(groupId);
      }
    });

    activeGroups.forEach((group) => {
      const anchor = this.#objectManager.getGroupAnchor(group.repName);
      if (!anchor) return;

      let label = this.#labels.get(group.groupId);
      if (!label) {
        label = document.createElement('div');
        label.className = 'price-label';
        this.#labels.set(group.groupId, label);
        this.#container.appendChild(label);
      }

      label.innerHTML = `
        <span class="price-label-name">${group.label}</span>
        <span class="price-label-value">${group.priceLabel}</span>
      `;

      const projected = anchor.clone().project(this.#camera);
      const isVisible = projected.z > -1 && projected.z < 1;

      if (!isVisible) {
        label.style.display = 'none';
        return;
      }

      const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-projected.y * 0.5 + 0.5) * window.innerHeight;

      label.style.display = 'flex';
      label.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
    });

    this.#syncToolbarPriceStrip(visibleGroups);
  }

  #syncToolbarPriceStrip(visibleGroups = null) {
    if (!this.#toolbarPriceStrip) return;

    const groups = visibleGroups ?? this.#objectManager.getVisibleGroupEntries().filter((group) => group.priceLabel);

    this.#toolbarPriceStrip.innerHTML = '';
    this.#toolbarPriceStrip.hidden = groups.length === 0;

    if (!groups.length) {
      return;
    }

    groups.forEach((group) => {
      const item = document.createElement('div');
      item.className = 'toolbar-price-chip';
      item.innerHTML = `
        <span class="toolbar-price-name">${group.label}</span>
        <span class="toolbar-price-value">${group.priceLabel}</span>
      `;
      this.#toolbarPriceStrip.appendChild(item);
    });
  }
}
