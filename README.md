# TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT VĨNH LONG

# WEBSITE 3D TƯƠNG TÁC CHO CÁC KHÔNG GIAN NỘI THẤT

## Demo trực tuyến

- Link demo: https://noithatphongkhach3d.netlify.app/
- Đã kiểm tra phản hồi `HTTP 200` vào ngày `29/03/2026`

## Nhóm sinh viên thực hiện

- Nguyễn Ngọc Hải Đăng - 23029048
- Lê Mộng Bình - 23029053
- Đỗ Thị Thuý Ngân - 23029045

## 1. Giới thiệu đề tài

Đây là dự án website 3D tương tác cho nhiều không gian nội thất chạy trực tiếp trên trình duyệt. Ứng dụng được xây dựng theo kiến trúc frontend thuần với `Vite + Three.js`, cho phép tải mô hình 3D, thao tác góc nhìn, thay đổi vật liệu, điều chỉnh ánh sáng, sắp xếp lại bố cục và hiển thị giá theo từng nhóm nội thất.

Phiên bản hiện tại không còn giới hạn ở một scene duy nhất mà đã tổ chức thành mô hình nhiều trang:

- `Phòng khách`
- `Ngoài trời`
- `Bếp`

Các scene dùng chung cùng một lớp hạ tầng render, camera, controls, object manager, UI panel, layout interaction và price label system.

## 2. Mục tiêu thực hiện

- Hiển thị mô hình 3D trực tiếp trên nền WebGL trong trình duyệt.
- Tổ chức nhiều scene nội thất độc lập trong cùng một project.
- Gom nhóm vật thể theo cấu hình để dễ thao tác, đổi vật liệu và gắn giá.
- Cho phép kéo thả, xoay và đặt lại bố cục theo thời gian thực.
- Cho phép điều chỉnh vật liệu theo nhóm đối tượng.
- Cho phép thay đổi ánh sáng từ giao diện.
- Hỗ trợ trình diễn trên desktop/laptop với giao diện điều khiển gọn.

## 3. Công nghệ sử dụng

- `Three.js`: dựng scene 3D, camera, ánh sáng, material và raycasting.
- `Vite`: dev server, build tool và cấu hình multi-page.
- `GLTFLoader`: tải mô hình `gltf/glb`.
- `DRACOLoader`: giải nén model Draco cho scene phòng khách.
- `OrbitControls`: xoay, zoom và pan camera.
- `HTML/CSS/JavaScript ES Modules`: tổ chức giao diện và logic ứng dụng.

Ghi chú:

- `three`, `vite`, `lil-gui`, `stats.js` đang có trong `package.json`.
- Giao diện hiện tại đang dùng panel DOM tự xây dựng; không dùng `lil-gui` làm UI chính.

## 4. Các scene hiện có

### 4.1. Phòng khách

- Trang: `/`
- `data-scene`: `living_room`
- Model chạy thực tế: `public/model/living_room/scene_opt.glb`
- Có dùng `DRACOLoader`
- Cấu hình chính: `src/config/scenes.js` + `src/config/uiGroups.js`

### 4.2. Ngoài trời

- Trang: `/outdoor.html`
- `data-scene`: `outdoor_furniture`
- Model chạy thực tế: `public/model/low_poly_outdoor_furniture_v1/scene.gltf`
- Không dùng Draco
- Cấu hình chính: `src/config/scenes.js` + `src/config/outdoorFurnitureGroups.js`

### 4.3. Bếp

- Trang: `/kitchen.html`
- `data-scene`: `kitchen_furniture`
- Model chạy thực tế: `public/model/kitchen_furniture/scene.gltf`
- Không dùng Draco
- Cấu hình chính: `src/config/scenes.js` + `src/config/kitchenFurnitureGroups.js`

## 5. Chức năng hiện có

### 5.1. Khởi tạo scene theo từng trang

Mỗi file HTML gắn với một `data-scene` riêng trên thẻ `body`. Khi ứng dụng khởi động, `src/main.js` đọc giá trị này và lấy cấu hình tương ứng từ `src/config/scenes.js` để dựng:

- renderer
- scene
- camera
- orbit controls
- light system
- object manager
- UI panel
- price label system
- layout designer

### 5.2. Điều khiển camera

Người dùng có thể:

- giữ chuột trái để xoay góc nhìn
- cuộn chuột để zoom
- giữ chuột phải để pan

Mỗi scene có cấu hình camera, `target`, `minDistance`, `maxDistance` và `maxPolarAngle` riêng.

### 5.3. Sắp xếp bố cục nội thất

Tab `Vật thể` hỗ trợ thao tác trực tiếp với các nhóm nội thất có cấu hình kéo thả:

- bật `Bật kéo thả`
- chọn các cụm vật thể muốn hiển thị và cho phép chỉnh
- click trực tiếp vật thể trong scene để chọn
- kéo để đổi vị trí
- xoay bằng thanh `Góc xoay`, nút `Xoay trái`, `Xoay phải` hoặc phím `Q / E`
- đặt lại vật đã chọn hoặc đặt lại toàn bộ bố cục

Hành vi đang chạy thực tế trong mã nguồn:

- khi kéo vật thể, `OrbitControls` sẽ bị khóa tạm thời để tránh xung đột thao tác
- hệ thống raycast tìm bề mặt đỡ phù hợp trước khi thả vật
- nếu không tìm được mặt đỡ phù hợp, vật sẽ rơi về mặt sàn của scene
- các object trong cùng một nhóm có thể được gom thành nhiều `layout cluster`
- một số scene có `layoutClusterRules` riêng để gom cụm chính xác hơn

Lưu ý:

- danh sách tick trong tab `Vật thể` hiện vừa đóng vai trò chọn cụm được phép chỉnh, vừa điều khiển việc ẩn/hiện các cụm đó trong scene

### 5.4. Thay đổi vật liệu theo nhóm

Tab `Vật liệu` cho phép áp dụng vật liệu cho toàn bộ object trong cùng một nhóm. Các loại vật liệu hiện có:

- `original`
- `standard`
- `phong`
- `toon`
- `wireframe`
- `normal`

Người dùng có thể:

- chọn nhóm vật thể
- đổi màu
- chỉnh `roughness`
- chỉnh `metalness`

Trong đó:

- `roughness` áp dụng cho `standard` và `phong`
- `metalness` áp dụng cho `standard`
- `original` trả vật liệu về trạng thái gốc của model

### 5.5. Điều chỉnh ánh sáng

Tab `Ánh sáng` hiện cho phép bật/tắt và chỉnh trực tiếp:

- Ambient Light
- Directional Light
- Point Light
- Spot Light

Ngoài ra trong scene còn có một `HemisphereLight` được tạo sẵn trong `LightSystem` để bổ trợ ánh sáng nền, nhưng không có control riêng trong panel.

### 5.6. Hiển thị giá theo nhóm

Giá được khai báo tĩnh trong các file cấu hình nhóm tại `src/config/`.

Hệ thống hiển thị giá gồm 2 lớp:

- `toolbar price strip`: hiện ở thanh trên cùng cho mọi nhóm đang hiển thị và có khai báo `price`
- `floating price label`: chỉ hiện trực tiếp trên mô hình khi tại thời điểm đó chỉ còn đúng `1` nhóm có giá đang hiển thị

### 5.7. Màn hình tải và chuyển scene

Ứng dụng có:

- loading screen trong lúc khởi tạo scene và tải mô hình
- thanh điều hướng giữa 3 trang scene trên top bar
- cập nhật `document.title` theo từng scene

### 5.8. Theo dõi hiệu năng

Top bar hiện có HUD hiển thị:

- `FPS`
- `DC`

Ghi chú kỹ thuật:

- `FPS` được cập nhật theo số khung hình thực tế
- `DC` trong phiên bản hiện tại là chỉ báo mô phỏng nhẹ để hỗ trợ trình diễn nhanh, chưa phải số `draw calls` đo trực tiếp từ `renderer.info`

## 6. Cách chạy dự án

### 6.1. Cài đặt thư viện

```bash
npm install
```

### 6.2. Chạy môi trường phát triển

```bash
npm run dev
```

Theo `vite.config.js`, dev server mặc định chạy ở cổng `5173` và tự mở trình duyệt.

Sau đó có thể truy cập:

```text
http://localhost:5173/
http://localhost:5173/outdoor.html
http://localhost:5173/kitchen.html
```

### 6.3. Build production

```bash
npm run build
```

Project hiện build theo kiểu multi-page và tạo ra:

- `dist/index.html`
- `dist/outdoor.html`
- `dist/kitchen.html`

### 6.4. Xem trước bản build

```bash
npm run preview
```

## 7. Hướng dẫn sử dụng nhanh

### 7.1. Điều khiển góc nhìn

1. Giữ chuột trái và rê để xoay góc nhìn.
2. Cuộn con lăn để phóng to hoặc thu nhỏ.
3. Giữ chuột phải và rê để pan.

### 7.2. Sắp xếp vật thể

1. Mở tab `Vật thể`.
2. Bật `Bật kéo thả`.
3. Tick các cụm muốn hiển thị và chỉnh sửa.
4. Click trực tiếp trong scene để chọn cụm.
5. Kéo vật thể để đổi vị trí.
6. Xoay bằng thanh xoay, nút xoay hoặc phím `Q / E`.
7. Dùng `Đặt lại vật đã chọn` hoặc `Đặt lại toàn bộ bố cục` khi cần.

### 7.3. Đổi vật liệu

1. Mở tab `Vật liệu`.
2. Chọn đối tượng trong danh sách.
3. Chọn loại vật liệu.
4. Điều chỉnh màu, độ nhám và độ kim loại nếu loại vật liệu hỗ trợ.

### 7.4. Chỉnh ánh sáng

1. Mở tab `Ánh sáng`.
2. Bật hoặc tắt từng loại đèn.
3. Điều chỉnh cường độ.
4. Đổi màu cho Directional, Point hoặc Spot Light.

## 8. Cấu trúc thư mục chính

```text
3DWeb/
├── index.html
├── outdoor.html
├── kitchen.html
├── package.json
├── package-lock.json
├── vite.config.js
├── public/
│   └── model/
│       ├── living_room/
│       ├── low_poly_outdoor_furniture_v1/
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

- `src/main.js`: khởi tạo app theo `data-scene`, quản lý loading screen, UI và render loop.
- `src/config/scenes.js`: cấu hình trung tâm cho từng scene, gồm model path, camera, controls, group config, material names và màu nhóm.
- `src/config/uiGroups.js`: khai báo nhóm nội thất của scene phòng khách.
- `src/config/outdoorFurnitureGroups.js`: khai báo nhóm nội thất của scene ngoài trời.
- `src/config/kitchenFurnitureGroups.js`: khai báo nhóm nội thất của scene bếp.
- `src/core/Renderer.js`: tạo và resize WebGL renderer.
- `src/core/Scene.js`: khởi tạo scene nền.
- `src/core/Camera.js`: tạo camera phối cảnh.
- `src/controls/OrbitControls.js`: bọc `OrbitControls` của Three.js và quản lý focus/target.
- `src/lights/LightSystem.js`: tạo và điều khiển hệ thống đèn.
- `src/materials/MaterialLibrary.js`: thư viện preset vật liệu để đổi nhanh theo nhóm.
- `src/objects/ObjectManager.js`: tải model, ánh xạ object vào group, tạo layout cluster, quản lý visibility, material, anchor và dữ liệu thao tác.
- `src/interactions/LayoutDesigner.js`: xử lý chọn vật thể, kéo thả, xoay, reset bố cục và placement logic.
- `src/ui/UIPanel.js`: xử lý toàn bộ tương tác panel DOM cho tab vật thể, vật liệu và ánh sáng.
- `src/ui/PriceLabelSystem.js`: hiển thị giá trên top bar và label nổi trong scene.
- `src/utils/Performance.js`: cập nhật HUD hiệu năng.
