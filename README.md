# TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT VĨNH LONG

# WEBSITE 3D TƯƠNG TÁC CHO CÁC KHÔNG GIAN NỘI THẤT

## Demo trực tuyến

- Link demo: https://noithatphongkhach3d.netlify.app/

## Nhóm sinh viên thực hiện

- Nguyễn Ngọc Hải Đăng - 23029048
- Lê Mộng Bình - 23029053
- Đỗ Thị Thuý Ngân - 23029045

## 1. Giới thiệu đề tài

Đây là đồ án xây dựng website 3D tương tác cho nhiều không gian nội thất trên nền tảng web. Ứng dụng hiện hỗ trợ nhiều scene độc lập, cho phép người dùng xem mô hình 3D trực tiếp trên trình duyệt, thay đổi vật liệu, điều chỉnh ánh sáng, sắp xếp lại bố cục và theo dõi giá các nhóm nội thất trong cùng một giao diện.

Phiên bản hiện tại đã mở rộng từ một scene phòng khách sang kiến trúc nhiều trang, nhiều model:

- `Phòng khách`
- `Ngoài trời`
- `Bếp`

Mỗi scene dùng chung hệ thống render, camera, controls, UI panel, material system, lighting system, drag layout và price display.

## 2. Mục tiêu thực hiện

- Xây dựng cảnh 3D hiển thị trực tiếp trên trình duyệt bằng WebGL.
- Hỗ trợ nhiều scene nội thất khác nhau trong cùng một project.
- Tách mô hình thành các nhóm logic để dễ thao tác, đổi vật liệu và hiển thị giá.
- Cho phép kéo thả, xoay và đặt lại bố cục theo thời gian thực.
- Cho phép thay đổi vật liệu theo từng nhóm đối tượng.
- Cho phép điều chỉnh nhiều loại ánh sáng từ giao diện.
- Hiển thị giá sản phẩm theo trạng thái hiển thị của scene.
- Giữ giao diện đủ gọn để trình diễn trên desktop và laptop phổ thông.

## 3. Công nghệ sử dụng

- `Three.js`: dựng đồ họa 3D trên nền WebGL.
- `Vite`: dev server và công cụ build frontend.
- `GLTFLoader` và `DRACOLoader`: tải mô hình `gltf/glb` và giải nén mesh tối ưu khi cần.
- `OrbitControls`: điều khiển camera.
- `HTML/CSS/JavaScript ES Modules`: giao diện và logic ứng dụng.

## 4. Các scene hiện có

### 4.1. Phòng khách

- Trang: `/`
- Model: `public/model/living_room/scene_opt.glb`
- Có hỗ trợ Draco

### 4.2. Ngoài trời

- Trang: `/outdoor.html`
- Model: `public/model/low_poly_outdoor_furniture_v1./scene.gltf`

### 4.3. Bếp

- Trang: `/kitchen.html`
- Model: `public/model/kitchen_furniture/scene.gltf`

## 5. Chức năng hiện có

### 5.1. Hiển thị scene 3D theo từng trang

Mỗi trang HTML gắn với một `scene config` riêng trong `src/config/scenes.js`. Khi ứng dụng khởi động, `src/main.js` sẽ đọc `data-scene` từ `body` để chọn đúng model, camera, controls, group config và metadata của scene.

### 5.2. Điều khiển camera

Người dùng có thể:

- giữ chuột trái để xoay góc nhìn
- cuộn chuột để zoom
- giữ chuột phải để pan cảnh

Mỗi scene có cấu hình camera và giới hạn zoom riêng.

### 5.3. Sắp xếp bố cục nội thất

Trong tab `Vật thể`, hệ thống hỗ trợ chỉnh bố cục trực tiếp trong scene:

- bật `Bật kéo thả` để vào chế độ chỉnh
- chọn các nhóm được phép thao tác trong danh sách
- click trực tiếp vật thể trong scene để chọn
- kéo vật thể để thay đổi vị trí
- xoay vật bằng thanh `Góc xoay`, nút `Xoay trái`, `Xoay phải` hoặc phím `Q / E`
- đặt lại vật đã chọn hoặc đặt lại toàn bộ bố cục

Một số hành vi chính của layout system:

- camera `OrbitControls` sẽ tạm khóa trong lúc kéo để tránh xung đột thao tác
- vật thể có thể rơi về nền nếu không có mặt đỡ hợp lệ bên dưới
- các object trong cùng một group có thể được gom theo `layout cluster` để thao tác thuận tiện hơn
- mỗi scene có thể định nghĩa `layoutClusterRules` riêng trong config

### 5.4. Thay đổi vật liệu theo nhóm

Trong tab `Vật liệu`, người dùng có thể chọn từng nhóm và đổi vật liệu theo thời gian thực.

Các loại vật liệu đang hỗ trợ:

- `original`
- `standard`
- `phong`
- `toon`
- `wireframe`
- `normal`

Ngoài ra giao diện còn hỗ trợ:

- đổi màu
- chỉnh `roughness`
- chỉnh `metalness`

### 5.5. Điều chỉnh ánh sáng

Ứng dụng hiện hỗ trợ:

- Ambient Light
- Directional Light
- Point Light
- Spot Light

Người dùng có thể bật hoặc tắt từng đèn, thay đổi cường độ và đổi màu trực tiếp từ giao diện.

### 5.6. Hiển thị giá

Hệ thống giá hiện hoạt động theo 2 lớp:

- `toolbar price strip`: luôn hiển thị trên thanh trên cùng cho tất cả nhóm đang `visible` và có khai báo `price`
- `floating price label`: chỉ hiện trực tiếp trên model khi scene chỉ còn đúng một nhóm có giá đang hiển thị

Giá được khai báo trong các file group config tại `src/config/`.

### 5.7. Theo dõi hiệu năng

Thanh trên cùng có hiển thị:

- FPS
- Draw calls

để hỗ trợ kiểm tra hiệu năng khi trình diễn model.

## 6. Cách chạy dự án

### 6.1. Cài đặt thư viện

```bash
npm install
```

### 6.2. Chạy môi trường phát triển

```bash
npm run dev
```

Sau đó truy cập một trong các trang:

```text
http://localhost:5173/
http://localhost:5173/outdoor.html
http://localhost:5173/kitchen.html
```

### 6.3. Build production

```bash
npm run build
```

### 6.4. Xem trước bản build

```bash
npm run preview
```

## 7. Hướng dẫn sử dụng nhanh

### 7.1. Điều khiển góc nhìn scene

Người dùng có thể thao tác trực tiếp với scene 3D bằng chuột:

1. Giữ chuột trái và rê để xoay góc nhìn quanh không gian.
2. Cuộn con lăn chuột để phóng to hoặc thu nhỏ.
3. Giữ chuột phải và rê để di chuyển khung nhìn ngang hoặc dọc.

Lưu ý:

- Khi đang kéo thả vật thể, điều khiển camera có thể tạm khóa để tránh xung đột thao tác.
- Mỗi scene có giới hạn zoom khác nhau để giữ góc nhìn ổn định.

### 7.2. Tab `Vật thể`

1. Mở tab `Vật thể`.
2. Bật `Bật kéo thả`.
3. Tick các nhóm muốn cho phép chỉnh.
4. Click trực tiếp vật thể trong scene để chọn.
5. Kéo vật để đổi vị trí.
6. Xoay bằng thanh xoay, nút xoay hoặc phím `Q / E`.
7. Dùng `Đặt lại vật đã chọn` hoặc `Đặt lại toàn bộ bố cục` nếu cần.

### 7.3. Tab `Vật liệu`

1. Mở tab `Vật liệu`.
2. Chọn nhóm vật thể.
3. Chọn loại vật liệu.
4. Điều chỉnh màu, độ nhám, độ kim loại nếu loại vật liệu hỗ trợ.

### 7.4. Tab `Ánh sáng`

1. Mở tab `Ánh sáng`.
2. Bật hoặc tắt từng loại đèn.
3. Điều chỉnh cường độ.
4. Đổi màu ánh sáng nếu cần.

## 8. Cấu trúc thư mục chính

```text
3DWeb/
├── index.html
├── outdoor.html
├── kitchen.html
├── package.json
├── vite.config.js
├── public/
│   └── model/
│       ├── living_room/
│       ├── low_poly_outdoor_furniture_v1./
│       └── kitchen_furniture/
└── src/
    ├── main.js
    ├── config/
    ├── controls/
    ├── core/
    ├── interactions/
    ├── lights/
    ├── materials/
    ├── objects/
    ├── styles/
    ├── ui/
    └── utils/
```

## 9. Mô tả các thành phần chính trong source code

- `src/main.js`: khởi tạo ứng dụng theo scene đang active, dựng renderer, scene, camera, controls, UI và render loop.
- `src/config/scenes.js`: cấu hình trung tâm cho từng scene, gồm model path, camera, controls, group config, material names và màu nhóm.
- `src/config/uiGroups.js`: nhóm cấu hình cho scene phòng khách.
- `src/config/outdoorFurnitureGroups.js`: nhóm cấu hình cho scene ngoài trời.
- `src/config/kitchenFurnitureGroups.js`: nhóm cấu hình cho scene bếp.
- `src/core/Renderer.js`: cấu hình WebGL renderer.
- `src/core/Scene.js`: khởi tạo scene.
- `src/core/Camera.js`: thiết lập camera phối cảnh.
- `src/controls/OrbitControls.js`: điều khiển camera và hỗ trợ focus/reset focus.
- `src/interactions/LayoutDesigner.js`: xử lý chọn vật thể, kéo thả, xoay, reset bố cục và placement logic.
- `src/objects/ObjectManager.js`: tải mô hình, tách/đăng ký object, group mesh, quản lý visibility, material, anchor, drag groups và layout clusters.
- `src/lights/LightSystem.js`: quản lý hệ thống ánh sáng.
- `src/ui/UIPanel.js`: xử lý tab vật thể, vật liệu và ánh sáng.
- `src/ui/PriceLabelSystem.js`: render giá trên toolbar và label giá nổi trên model.
- `src/styles/main.css`: giao diện toàn bộ ứng dụng.
- `src/utils/Performance.js`: hiển thị FPS và draw calls.

## 10. Cách cấu hình group và giá

Mỗi scene có thể khai báo danh sách nhóm tại `src/config/`.

Ví dụ:

```js
export const KITCHEN_FURNITURE_UI_GROUPS = [
  {
    id: 'kitchen_table_group',
    label: 'Bàn ăn gỗ',
    price: '6.800.000đ',
    members: ['Table_Kitchen_A_2'],
  },
];
```

Ý nghĩa các trường:

- `id`: mã định danh của group
- `label`: tên hiển thị trong UI
- `price`: giá hiển thị trên toolbar và price label
- `members`: danh sách object hoặc tên node dùng để map mesh vào group

Muốn đổi tên nhóm hoặc giá, chỉ cần sửa trực tiếp trong file config tương ứng.

## 11. Kiến trúc scene hiện tại

Project hiện không còn hard-code riêng cho từng model. Thay vào đó:

- mỗi trang HTML chọn `data-scene`
- `src/config/scenes.js` cung cấp cấu hình cho scene tương ứng
- `ObjectManager` dùng config đó để load model, map tên object, tạo group và sinh danh sách thao tác

Nhờ vậy có thể thêm scene mới bằng cách:

1. thêm model vào `public/model/...`
2. tạo file group config nếu cần
3. thêm scene vào `src/config/scenes.js`
4. tạo trang HTML mới
5. thêm entry vào `vite.config.js`

## 12. Yêu cầu phần cứng và phần mềm

- trình duyệt hiện đại hỗ trợ WebGL
- Node.js và npm để cài đặt, chạy và build dự án
- máy tính có GPU tích hợp hoặc GPU rời thông dụng để xem scene mượt hơn

## 13. Trạng thái hiện tại của dự án

- đã hỗ trợ 3 scene độc lập: phòng khách, ngoài trời, bếp
- đã hỗ trợ multi-page build bằng Vite
- đã hỗ trợ toolbar hiển thị giá theo nhóm đang visible
- đã hỗ trợ label giá nổi khi chỉ còn một nhóm
- đã hỗ trợ đổi vật liệu, chỉnh ánh sáng, kéo thả bố cục và reset layout
- có thể build và triển khai dưới dạng website tĩnh
