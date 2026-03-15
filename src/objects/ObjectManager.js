import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MaterialLibrary } from '../materials/MaterialLibrary.js';
import { UI_GROUPS } from '../config/uiGroups.js';

export class ObjectManager {
  objects = []; // Danh sách các nhóm vật thể (Sofa, Sàn, Tường...)

  #scene;
  #model; // Lưu lại model để xóa khi load lại
  #onProgress = null;
  #onLoaded = null;
  static #IGNORE_GROUPS = [
    'Scene',
    'RootNode',
    'Sketchfab_Model',
    'OSG_Scene',
    'default_scene',
    'GLTF_SceneRootNode',
    'Object_1',
    'Scene_Root',
  ];

  // Giữ nguyên các map tên cũ của bạn
  static #NODE_NAMES = [
    { pattern: 'Burnt_Log', name: 'Khúc gỗ trang trí' },
    { pattern: 'Patterned_Floor', name: 'Sàn nhà' },
    { pattern: 'Studded_Leather', name: 'Bọc da sofa' },
    { pattern: 'Wooden_Bowl', name: 'Bát gỗ trang trí' },
    { pattern: 'Lamp_', name: 'Đèn cây' },
    { pattern: 'Plywood', name: 'Kệ tivi/làm việc' },
    { pattern: 'Book', name: 'Sách gỗ/Kệ' },
    { pattern: 'Solid_Wood', name: 'Sofa gỗ/Chân' },
    { pattern: 'Wooden_Beam', name: 'Gờ gỗ/Khung' },
    { pattern: 'Wood_Pattern', name: 'Gỗ ghép' },
    { pattern: 'Small_Rocks', name: 'Chậu cây' },
    { pattern: 'Plastic_Matte', name: 'Chi tiết nhựa' },
    { pattern: 'Mat', name: 'Các loại chân/viền khác' },
  ];

  static #MATERIAL_NAMES = {
    Burnt_Log_vcsaeeyfa: 'Khúc gỗ trang trí',
    Patterned_Floor_tksmdiycw: 'Sàn nhà',
    Studded_Leather_tlooadar: 'Bọc da sofa',
    'Wooden_Bowl_tfpcbhnra.1': 'Bát gỗ trang trí',
    material: 'Đèn cây',
    'Mat.1': 'Đệm ngồi',
    'Mat.2': 'Bàn trà',
    'Mat.3': 'Gối vuông',
    'Mat.4': 'Thảm',
    'Mat.4_1': 'Ngăn kéo gỗ',
    // Tắt nhóm config
    // static FURNITURE_GROUPS = {};
    'Mat.5': 'Tường',
    'Mat.6': 'Cửa nhôm/kính',
    'Plywood_vdcjfiw.1': 'Ghế bành gỗ',
    'Plywood_vdcjfiw.1_1': 'Kệ sách gỗ',
    Small_Rocks_ulludayiw: 'Chậu cây',
    White_And_Blue_vdkvbea: 'Gối trang trí',
    Wooden_Beam_tgngdibfa: 'Kệ treo',
    Wooden_Beam_tgnhde0fa: 'Kệ TV',
    Mat_1: 'Vật nhỏ khác',
    Brown_Book_vgbkedfjw: 'Sách',
  };

  static #GROUP_COLORS = {
    Sách: '#654321',
    'Khúc gỗ trang trí': '#5C4033',
    'Đèn cây': '#FFD700',
    'Đệm ngồi': '#333333',
    'Bàn trà': '#8B7355',
    'Sàn nhà': '#3a3a3a',
    'Bọc da sofa': '#1a1a1a',
    // ... các màu khác
  };

  /**
   * Array lồng nhau để phân nhóm thủ công theo ID (Object_N).
   * Hỗ trợ cả ID đơn lẻ và dải ID (VD: 'Object_10-20').
   */

  static #parseObjectNumber(name) {
    if (!name || typeof name !== 'string') return null;
    const match = name.match(/^Object_(\d+)$/);
    return match ? Number(match[1]) : null;
  }

  /** Kiểm tra xem một object có thuộc group cấu hình thủ công hay không */
  static #getManualGroupId(...candidateNames) {
    for (const candidateName of candidateNames) {
      for (const group of UI_GROUPS) {
        if (group.members.includes(candidateName)) {
          return group.id;
        }
      }
    }

    const numbers = candidateNames
      .map((name) => ObjectManager.#parseObjectNumber(name))
      .filter((num) => num !== null);

    for (const group of UI_GROUPS) {
      for (const m of group.members) {
        if (candidateNames.includes(m)) {
          return group.id;
        }
        if (m.includes('-')) {
          const rangeString = m.replace('Object_', '').trim();
          const [start, end] = rangeString.split('-').map(Number);
          if (!isNaN(start) && !isNaN(end) && numbers.some((num) => num >= start && num <= end)) {
            return group.id;
          }
        }
      }
    }
    return null;
  }

  constructor(scene, { onProgress, onLoaded } = {}) {
    this.#scene = scene;
    this.#onProgress = onProgress;
    this.#onLoaded = onLoaded;
  }

  /**
   * Tách geometry CHỈ KHI mesh có ≤ 4 island VÀ các island thực sự xa nhau.
   * Tránh tách những mesh có nhiều "island" do cách build geometry (texture holes, v.v.)
   */
  static #splitFarIslands(mesh, minSeparation = 0.3) {
    const geo = mesh.geometry;
    if (!geo.index) return null;

    const indices = geo.index.array;
    const pos = geo.attributes.position;
    const numFaces = indices.length / 3;
    const numVerts = pos.count;

    // Union-Find
    const parent = new Int32Array(numVerts).map((_, i) => i);
    const find = (x) => {
      while (parent[x] !== x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
      }
      return x;
    };
    const union = (a, b) => {
      const ra = find(a),
        rb = find(b);
      if (ra !== rb) parent[ra] = rb;
    };
    for (let i = 0; i < indices.length; i += 3) {
      union(indices[i], indices[i + 1]);
      union(indices[i + 1], indices[i + 2]);
    }

    // Nhóm face theo island
    const facesByRoot = new Map();
    for (let f = 0; f < numFaces; f++) {
      const root = find(indices[f * 3]);
      if (!facesByRoot.has(root)) facesByRoot.set(root, []);
      facesByRoot.get(root).push(f);
    }

    const islandCount = facesByRoot.size;
    if (islandCount <= 1 || islandCount > 500) return null;

    // Tính tâm để debug
    const islandData = [];
    for (const [, faces] of facesByRoot) {
      const cx = { x: 0, y: 0, z: 0 };
      let n = 0;
      const vertsSeen = new Set();
      for (const f of faces) {
        for (let vi = 0; vi < 3; vi++) {
          const idx = indices[f * 3 + vi];
          if (!vertsSeen.has(idx)) {
            vertsSeen.add(idx);
            cx.x += pos.getX(idx);
            cx.y += pos.getY(idx);
            cx.z += pos.getZ(idx);
            n++;
          }
        }
      }
      islandData.push({ faces, center: { x: cx.x / n, y: cx.y / n, z: cx.z / n } });
    }

    console.log(`%c[ObjectManager] Splitting mesh into ${islandCount} islands.`, 'color: #ffa500');

    // Tách thành mesh riêng
    const attrs = geo.attributes;
    return islandData.map(({ faces }) => {
      const newGeo = new THREE.BufferGeometry();
      const vertMap = new Map();
      const newIndices = [];
      const newAttrs = {};
      for (const name in attrs) newAttrs[name] = [];
      for (const f of faces) {
        for (let vi = 0; vi < 3; vi++) {
          const oIdx = indices[f * 3 + vi];
          if (!vertMap.has(oIdx)) {
            vertMap.set(oIdx, vertMap.size);
            for (const name in attrs) {
              const a = attrs[name];
              for (let k = 0; k < a.itemSize; k++) newAttrs[name].push(a.array[oIdx * a.itemSize + k]);
            }
          }
          newIndices.push(vertMap.get(oIdx));
        }
      }
      for (const name in newAttrs) {
        const o = attrs[name];
        newGeo.setAttribute(
          name,
          new THREE.BufferAttribute(new Float32Array(newAttrs[name]), o.itemSize, o.normalized),
        );
      }
      newGeo.setIndex(newIndices);
      newGeo.computeBoundingSphere();
      newGeo.computeBoundingBox();
      const m = new THREE.Mesh(newGeo, mesh.material);
      m.position.copy(mesh.position);
      m.rotation.copy(mesh.rotation);
      m.scale.copy(mesh.scale);
      m.matrix.copy(mesh.matrix);
      m.layers.mask = mesh.layers.mask;
      return m;
    });
  }

  async load() {
    if (this.#model) {
      this.#scene.remove(this.#model);
      this.#model = null;
    }
    this.objects = [];

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    return new Promise((resolve, reject) => {
      loader.load(
        '/model/living_room/scene_opt.glb',
        (gltf) => {
          const model = gltf.scene;
          this.#model = model;

          // STAGE 1: Split meshes that have far islands
          // We do this first so the scene structure is final before we start naming
          const meshesToSplit = [];
          model.traverse((node) => {
            if (node.isMesh) meshesToSplit.push(node);
          });

          meshesToSplit.forEach((node) => {
            const islands = ObjectManager.#splitFarIslands(node);
            if (islands && islands.length > 1) {
              const par = node.parent;
              if (par) {
                const idx = par.children.indexOf(node);
                if (idx !== -1) {
                  // Thay thế mesh gốc bằng các island
                  par.children.splice(idx, 1, ...islands);
                  islands.forEach((m) => {
                    m.parent = par;
                  });
                  node.parent = null;
                }
              }
            }
          });

          // STAGE 2: Register objects and assign unique names
          let counter = 1;
          this.objects = [];

          model.traverse((node) => {
            // Store original name before we overwrite it, for grouping decisions
            if (node.__origName === undefined) node.__origName = node.name || '';

            const uniqueName = `Object_${counter++}`;
            node.name = uniqueName;

            if (node.isMesh) {
              node.material = node.material.clone();
              node.castShadow = false;
              node.receiveShadow = false;
              node.frustumCulled = true;

              const oldMat = node.material;
              const lambertMat = new THREE.MeshLambertMaterial().copy(oldMat);
              lambertMat.map = oldMat.map;
              node.material = lambertMat;
              node.__origMaterial = node.material.clone();

              const matName = oldMat.name || '';
              const vietName = ObjectManager.#MATERIAL_NAMES[matName] || 'Khác';
              const sourceName = node.__origName || uniqueName;
              let groupId = ObjectManager.#getManualGroupId(uniqueName, sourceName);
              let groupLabel = UI_GROUPS.find((g) => g.id === groupId)?.label || vietName;

              this.objects.push({
                name: uniqueName,
                sourceName,
                label: vietName,
                groupId,
                groupLabel,
                color: ObjectManager.#GROUP_COLORS[vietName] ?? '#888',
                meshes: [node],
                visible: true,
                _matType: 'original',
              });
            }
          });

          console.log(`%c Tổng ${this.objects.length} object (sau refactor). `, 'background: #222; color: #00d4aa');

          // Đóng băng ma trận cho cảnh tĩnh
          model.updateMatrixWorld(true);
          model.traverse((child) => {
            child.matrixAutoUpdate = false;
          });

          this.#scene.add(model);
          dracoLoader.dispose();
          if (this.#onLoaded) this.#onLoaded();
          resolve();
        },
        null,
        (err) => {
          console.error('GLB load error:', err);
          reject(err);
        },
      );
    });
  }

  /** Lấy tất cả objects cùng nhóm nội thất */
  getGroupObjects(name) {
    const obj = this.objects.find((o) => o.name === name);
    if (!obj || !obj.groupId) return obj ? [obj] : [];
    return this.objects.filter((o) => o.groupId === obj.groupId);
  }

  /**
   * Áp dụng material cho tất cả mảnh trong cùng nhóm
   */
  applyMaterial(name, type, color, roughness, metalness) {
    const targets = this.getGroupObjects(name);
    targets.forEach((obj) => {
      obj._matType = type;
      obj.meshes.forEach((mesh) => {
        if (type === 'original') {
          mesh.material.copy(mesh.__origMaterial);
        } else {
          const newMat = MaterialLibrary.create(type, color, roughness, metalness);
          if (mesh.material.type === newMat.type) {
            if (color) mesh.material.color.set(color);
            if (roughness !== undefined) mesh.material.roughness = roughness;
            if (metalness !== undefined) mesh.material.metalness = metalness;
          } else {
            mesh.material = newMat;
          }
        }
        mesh.material.needsUpdate = true;
      });
    });
  }

  setVisible(name, visible) {
    const targets = this.getGroupObjects(name);
    targets.forEach((obj) => {
      obj.visible = visible;
      obj.meshes.forEach((m) => (m.visible = visible));
    });
  }

  /**
   * Highlights objects by briefly changing their emissive color.
   */
  highlightObjects(names, duration = 800) {
    names.forEach((name) => {
      const targets = this.getGroupObjects(name);
      targets.forEach((obj) => {
        obj.meshes.forEach((mesh) => {
          if (!mesh.material) return;
          if (mesh.__origEmissive === undefined) {
            mesh.__origEmissive = mesh.material.emissive ? mesh.material.emissive.clone() : new THREE.Color(0x000000);
          }
          mesh.material.emissive.set(0xff3333);
          mesh.material.emissiveIntensity = 1.0;
          setTimeout(() => {
            if (mesh.material && mesh.material.emissive) {
              mesh.material.emissive.copy(mesh.__origEmissive);
              mesh.material.emissiveIntensity = 0.0;
            }
          }, duration);
        });
      });
    });
  }
}
