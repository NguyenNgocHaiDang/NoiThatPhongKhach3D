import { UI_GROUPS as LIVING_ROOM_UI_GROUPS } from './uiGroups.js';
import { OUTDOOR_FURNITURE_UI_GROUPS } from './outdoorFurnitureGroups.js';
import { KITCHEN_FURNITURE_UI_GROUPS } from './kitchenFurnitureGroups.js';

const DEFAULT_LAYOUT_CLUSTER_RULES = {
  sofa_group: {
    label: 'Ghế Sofa',
    marginScale: 0.06,
    minMargin: 0.03,
    maxMargin: 0.12,
    useCenterDistance: false,
  },
  pillow_group: {
    label: 'Gối Trang Trí',
    marginScale: 0.025,
    minMargin: 0.008,
    maxMargin: 0.035,
    useCenterDistance: false,
  },
  books_group: {
    label: 'Sách',
    marginScale: 0.015,
    minMargin: 0.004,
    maxMargin: 0.018,
    useCenterDistance: false,
  },
  backrest_chair_group: {
    label: 'Ghế Có Tựa Lưng',
    marginScale: 0.04,
    minMargin: 0.015,
    maxMargin: 0.06,
    useCenterDistance: false,
  },
};

const LIVING_ROOM_MATERIAL_NAMES = {
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
  'Mat.5': 'Tường',
  'Mat.6': 'Cửa nhôm/kính',
  'Plywood_vdcjfiw.1': 'Ghế bành gỗ',
  'Plywood_vdcjfiw.1_1': 'Kệ sách gỗ',
  Small_Rocks_ulludayiw: 'Chậu cây',
  White_And_Blue_vdkvbea: 'Gối trang trí',
  Wooden_Beam_tgngdibfa: 'Kệ treo',
  Wooden_Beam_tgnhde0fa: 'Ke TV',
  Mat_1: 'Vật nhỏ khác',
  Brown_Book_vgbkedfjw: 'Sách',
};

const LIVING_ROOM_GROUP_COLORS = {
  Sách: '#654321',
  'Khúc gỗ trang trí': '#5C4033',
  'Đèn cây': '#FFD700',
  'Đệm ngồi': '#333333',
  'Bàn trà': '#8B7355',
  'Sàn nhà': '#3a3a3a',
  'Bọc da sofa': '#1a1a1a',
};

const OUTDOOR_MATERIAL_NAMES = {
  Couch: 'Sofa sân vườn',
  'Stool couch style': 'Ghế đôn đệm',
  Table: 'Bàn gỗ chữ nhật',
  'Stool Coffee table': 'Ghế đôn nhỏ',
  'Coffee table': 'Bàn trà tròn',
  'Bench Table': 'Bàn gỗ kèm ghế',
  'Cylinder Bench Table': 'Bàn gỗ tròn kèm ghế',
  'Flower Pot': 'Chậu cây nhỏ',
  'Umbrella Blue': 'Dù xanh',
  'Umbrella Red': 'Dù đỏ',
  Plant: 'Chậu cây lớn',
  Campfire: 'Bồn lửa',
  'Material.001': 'Gỗ sáng',
  'Material.002': 'Gỗ tự nhiên',
  'Material.003': 'Vải dù',
  'Material.005': 'Khung tối',
  'Material.006': 'Mặt bàn',
  'Material.007': 'Khung gỗ',
  'Material.008': 'Nệm ngoài trời',
  'Material.009': 'Chân đế',
  'Material.010': 'Lá cây',
  'Material.011': 'Đất chậu',
  'Material.012': 'Chi tiết đỏ',
  'Material.013': 'Viền chậu',
  'Material.014': 'Thân cây',
  'Material.015': 'Đá bồn lửa',
};

const OUTDOOR_GROUP_COLORS = {
  'Sofa sân vườn': '#7d684f',
  'Ghế đôn đệm': '#8f7357',
  'Bàn gỗ chữ nhật': '#6f563f',
  'Ghế đôn nhỏ': '#8b6b47',
  'Bàn trà tròn': '#9a7752',
  'Bàn gỗ kèm ghế': '#6d5a42',
  'Bàn gỗ tròn kèm ghế': '#7a6249',
  'Chậu cây nhỏ': '#6a7d52',
  'Dù xanh': '#5f7f99',
  'Dù đỏ': '#a15c4d',
  'Chậu cây lớn': '#5a7c4e',
  'Bồn lửa': '#a56b3f',
};

const KITCHEN_MATERIAL_NAMES = {
  Radiator_A_1: 'Bộ tản nhiệt',
  Radiator_B_0: 'Bộ tản nhiệt',
  Table_Kitchen_A_2: 'Bàn ăn gỗ',
  Chair_Kitchen_A_4: 'Ghế ăn',
  Chair_Kitchen_B_3: 'Ghế ăn',
  Stool_A_5: 'Ghế đôn',
  Carpet_A_6: 'Thảm bếp',
  Cupboard_Kitchen_B_7: 'Tủ bếp dưới',
  Cupboard_Kitchen_A_8: 'Tủ treo tường',
  Radiators: 'Kim loại sơn',
  Table_Kitchen_A: 'Gỗ bàn ăn',
  Chairs_A: 'Gỗ ghế',
  Carpet_A: 'Mặt thảm',
  Carpet_A_Ends: 'Viền thảm',
  Trims_Painted_A: 'Tủ sơn phủ',
  Glass_Cupboard_A: 'Kính tủ',
};

const KITCHEN_GROUP_COLORS = {
  'Bộ tản nhiệt': '#9aa1aa',
  'Bàn ăn gỗ': '#8c6b4c',
  'Ghế ăn': '#7b5d42',
  'Ghế đôn': '#8f6d50',
  'Thảm bếp': '#84705f',
  'Tủ bếp dưới': '#5f6f7a',
  'Tủ treo tường': '#71838f',
};

const KITCHEN_LAYOUT_CLUSTER_RULES = {
  kitchen_radiator_group: {
    label: 'Bộ tản nhiệt',
    marginScale: 0.02,
    minMargin: 0.01,
    maxMargin: 0.03,
    useCenterDistance: false,
  },
  kitchen_chair_group: {
    label: 'Ghế ăn',
    marginScale: 0.02,
    minMargin: 0.01,
    maxMargin: 0.03,
    useCenterDistance: false,
  },
};


export const SCENE_CONFIGS = {
  living_room: {
    id: 'living_room',
    pageTitle: 'Nội thất phòng khách',
    sceneName: 'Living room experience',
    modelPath: '/model/living_room/scene_opt.glb',
    useDraco: true,
    camera: {
      fov: 50,
      near: 0.1,
      far: 1000,
      position: [5, 4, 8],
      target: [0, 1, 0],
    },
    controls: {
      target: [0, 1, 0],
      minDistance: 2,
      maxDistance: 60,
      maxPolarAngle: Math.PI * 0.85,
    },
    uiGroups: LIVING_ROOM_UI_GROUPS,
    materialNames: LIVING_ROOM_MATERIAL_NAMES,
    groupColors: LIVING_ROOM_GROUP_COLORS,
    layoutClusterRules: DEFAULT_LAYOUT_CLUSTER_RULES,
  },
  outdoor_furniture: {
    id: 'outdoor_furniture',
    pageTitle: 'Nội thất ngoài trời',
    sceneName: 'Low poly outdoor furniture',
    modelPath: '/model/low_poly_outdoor_furniture_v1./scene.gltf',
    useDraco: false,
    camera: {
      fov: 40,
      near: 0.1,
      far: 1000,
      position: [0.4, 2.2, 7.2],
      target: [0.15, 0.4, -0.25],
    },
    controls: {
      target: [0.15, 0.4, -0.25],
      minDistance: 2.5,
      maxDistance: 24,
      maxPolarAngle: Math.PI * 0.88,
    },
    uiGroups: OUTDOOR_FURNITURE_UI_GROUPS,
    materialNames: OUTDOOR_MATERIAL_NAMES,
    groupColors: OUTDOOR_GROUP_COLORS,
    layoutClusterRules: {},
  },
  kitchen_furniture: {
    id: 'kitchen_furniture',
    pageTitle: 'Nội thất bếp',
    sceneName: 'Kitchen furniture showcase',
    modelPath: '/model/kitchen_furniture/scene.gltf',
    useDraco: false,
    camera: {
      fov: 38,
      near: 0.1,
      far: 1000,
      position: [3.6, 3.0, 6.4],
      target: [0.15, 0.75, -0.7],
    },
    controls: {
      target: [0.15, 0.75, -0.7],
      minDistance: 2.5,
      maxDistance: 20,
      maxPolarAngle: Math.PI * 0.88,
    },
    uiGroups: KITCHEN_FURNITURE_UI_GROUPS,
    materialNames: KITCHEN_MATERIAL_NAMES,
    groupColors: KITCHEN_GROUP_COLORS,
    layoutClusterRules: KITCHEN_LAYOUT_CLUSTER_RULES,
  },
};

export function getSceneConfig(sceneId) {
  return SCENE_CONFIGS[sceneId] ?? SCENE_CONFIGS.living_room;
}
