# TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT VĨNH LONG

# XÂY DỰNG WEBSITE 3D TƯƠNG TÁC CHO KHÔNG GIAN NỘI THẤT PHÒNG KHÁCH

## Nhóm sinh viên thực hiện

- Nguyễn Ngọc Hải Đăng - 23029048
- Lê Mộng Bình - 23029053
- Đỗ Thị Thuý Ngân - 23029045

## 1. Giới thiệu đề tài

Đây là đồ án xây dựng website 3D tương tác cho không gian nội thất phòng khách trên nền tảng web. Ứng dụng cho phép người dùng quan sát cảnh 3D trực tiếp trên trình duyệt, thay đổi vật liệu, điều chỉnh ánh sáng và sắp xếp lại vị trí đồ nội thất theo cách trực quan.

Điểm trọng tâm của phiên bản hiện tại là đưa mô hình từ trạng thái "chỉ xem" sang trạng thái "có thể dàn dựng bố cục", phục vụ nhu cầu trình diễn, thử layout và tinh chỉnh nhanh trong cùng một giao diện.

## 2. Mục tiêu thực hiện

- Xây dựng cảnh 3D nội thất hiển thị trực tiếp trên trình duyệt.
- Cho phép người dùng xoay, zoom và pan camera tự do.
- Tách mô hình thành các nhóm logic để dễ chọn và thao tác.
- Hỗ trợ kéo thả, xoay và đặt lại vị trí nội thất theo thời gian thực.
- Hỗ trợ thay đổi vật liệu theo từng nhóm đối tượng.
- Hỗ trợ điều chỉnh nhiều loại ánh sáng từ giao diện.
- Hiển thị thông tin giá cho nhóm nội thất đang được hiển thị đơn lẻ.
- Giữ ứng dụng đủ nhẹ để chạy ổn định trên thiết bị phổ thông.

## 3. Công nghệ sử dụng

- `Three.js`: dựng đồ họa 3D trên nền WebGL.
- `Vite`: dev server và công cụ build frontend.
- `GLTFLoader` và `DRACOLoader`: tải mô hình GLB và giải nén mesh tối ưu.
- `OrbitControls`: điều khiển camera.
- `HTML/CSS/JavaScript ES6`: giao diện và logic ứng dụng.

## 4. Chức năng hiện có

### 4.1. Hiển thị cảnh 3D nội thất

Ứng dụng tải mô hình phòng khách từ file `scene_opt.glb` và render trực tiếp lên canvas WebGL.

### 4.2. Điều khiển camera

Người dùng có thể:

- Giữ chuột trái để xoay góc nhìn.
- Cuộn chuột để zoom in hoặc zoom out.
- Giữ chuột phải để pan cảnh.

### 4.3. Sắp xếp bố cục nội thất

Trong tab `Vật thể`, hệ thống hỗ trợ chế độ chỉnh bố cục trực tiếp trong scene:

- Bật `Bật kéo thả` để vào chế độ chỉnh.
- Tick nhiều món trong danh sách `Vật thể được phép chỉnh`.
- Click trực tiếp vật thể trong cảnh để chọn.
- Kéo thả vật thể để đổi vị trí.
- Xoay vật bằng thanh `Góc xoay`, nút `Xoay trái`, `Xoay phải` hoặc phím `Q / E`.
- Đặt lại vị trí vật đang chọn hoặc đặt lại toàn bộ bố cục.

Hệ thống placement hiện tại có các hành vi chính:

- Nếu phía dưới không có mặt đỡ hợp lệ, vật sẽ rơi về nền.
- Nếu có mặt đỡ đủ điều kiện bên dưới như bàn hoặc kệ, vật sẽ đứng trên mặt đó.
- Khi kéo, camera `OrbitControls` sẽ tạm khóa để tránh xung đột thao tác.
- Các nhóm lớn như sofa, gối, ghế, sách... đã được tách thành các cụm nhỏ hơn để kéo độc lập.

### 4.4. Thay đổi vật liệu theo nhóm

Trong tab `Vật liệu`, người dùng có thể chọn từng nhóm nội thất và thay đổi vật liệu theo thời gian thực.

Các loại vật liệu đang hỗ trợ:

- `original`
- `standard`
- `phong`
- `toon`
- `wireframe`
- `normal`

Ngoài ra giao diện còn cho phép thay đổi:

- màu sắc
- độ nhám `roughness`
- độ kim loại `metalness`

### 4.5. Điều chỉnh ánh sáng

Ứng dụng hiện hỗ trợ:

- Ambient Light
- Directional Light
- Point Light
- Spot Light

Người dùng có thể bật hoặc tắt từng đèn, thay đổi cường độ và đổi màu trực tiếp từ giao diện.

### 4.6. Hiển thị giá trên mô hình

Mỗi nhóm nội thất trong `src/config/*.js` có thể khai báo trường `price`.

Giá được hiển thị theo cơ chế:

- Chỉ hiện label giá khi trên màn hình chỉ còn đúng một nhóm có hỗ trợ `priceLabel`.
- Label giá nổi trên vị trí neo của model.
- Nếu có nhiều nhóm cùng hiển thị, label giá sẽ tự ẩn để tránh rối giao diện.

### 4.7. Theo dõi hiệu năng

Thanh trên cùng có hiển thị:

- FPS
- số draw call

để hỗ trợ kiểm tra hiệu năng khi trình diễn.

## 5. Cách sử dụng

### 5.1. Chạy dự án

```bash
npm install
npm run dev
```

Sau đó mở:

```text
http://localhost:5173
```

### 5.2. Sử dụng tab `Vật thể`

1. Mở tab `Vật thể`.
2. Bật `Bật kéo thả`.
3. Tick các món cần cho phép chỉnh trong danh sách `Vật thể được phép chỉnh`.
4. Click trực tiếp vật thể trong scene để chọn.
5. Kéo vật để di chuyển vị trí.
6. Xoay vật bằng:
   - thanh `Góc xoay`
   - nút `Xoay trái`
   - nút `Xoay phải`
   - phím `Q / E`
7. Nếu cần, bấm:
   - `Đặt lại vật đã chọn`
   - `Đặt lại toàn bộ bố cục`

### 5.3. Sử dụng tab `Vật liệu`

1. Mở tab `Vật liệu`.
2. Chọn nhóm nội thất cần đổi vật liệu.
3. Chọn loại vật liệu.
4. Điều chỉnh màu, độ nhám và độ kim loại nếu loại vật liệu hỗ trợ.

### 5.4. Sử dụng tab `Ánh sáng`

1. Mở tab `Ánh sáng`.
2. Bật hoặc tắt từng loại đèn.
3. Thay đổi cường độ sáng.
4. Đổi màu ánh sáng nếu loại đèn hỗ trợ.

## 6. Cấu trúc thư mục chính

```text
3DWeb/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── model/
│       └── living_room/
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

## 7. Mô tả các thành phần chính trong source code

- `src/main.js`: khởi tạo ứng dụng, scene, camera, controls, UI, price label system và vòng lặp render.
- `src/core/Renderer.js`: cấu hình WebGL renderer.
- `src/core/Scene.js`: khởi tạo scene.
- `src/core/Camera.js`: thiết lập camera phối cảnh.
- `src/controls/OrbitControls.js`: điều khiển camera và reset/focus vùng nhìn.
- `src/interactions/LayoutDesigner.js`: xử lý chọn vật thể, kéo thả, xoay, reset bố cục và logic đặt vật lên nền hoặc mặt đỡ.
- `src/objects/ObjectManager.js`: tải mô hình, tách cụm layout, quản lý visibility, vật liệu, vị trí, rotation và highlight.
- `src/lights/LightSystem.js`: quản lý hệ thống ánh sáng.
- `src/ui/UIPanel.js`: xử lý giao diện cho tab vật thể, vật liệu và ánh sáng.
- `src/ui/PriceLabelSystem.js`: hiển thị label giá nổi trên model.
- `src/config/uiGroups.js`: tập hợp toàn bộ group config dùng trong giao diện.
- `src/config/*.js`: khai báo từng nhóm nội thất với `id`, `label`, `price`, `members`.
- `src/utils/Performance.js`: hiển thị thông tin hiệu năng.

## 8. Cách cập nhật giá sản phẩm

Giá được cấu hình trực tiếp trong từng file group tại thư mục `src/config/`.

Ví dụ:

```js
export const BOOKS_GROUP = {
  id: "books_group",
  label: "Sách",
  price: "320.000đ",
  members: ["Object_25", "Object_604", "Object_605", "Object_606", "Object_607"],
};
```

Muốn đổi giá, chỉ cần sửa trường `price` trong file group tương ứng.

## 9. Hướng dẫn chạy dự án

### Cài đặt thư viện

```bash
npm install
```

### Chạy môi trường phát triển

```bash
npm run dev
```

### Build production

```bash
npm run build
```

### Xem trước bản build

```bash
npm run preview
```

## 10. Yêu cầu phần cứng và phần mềm

- Trình duyệt hiện đại hỗ trợ WebGL.
- Máy tính có GPU tích hợp hoặc GPU rời thông dụng.
- Node.js và npm để cài đặt, chạy và build dự án.

## 11. Kết quả đạt được

- Xây dựng thành công website 3D mô phỏng không gian nội thất phòng khách.
- Tổ chức được mô hình thành nhiều nhóm nội thất có thể thao tác độc lập hơn.
- Hỗ trợ kéo thả, xoay và đặt lại bố cục nội thất theo thời gian thực.
- Hỗ trợ thay đổi vật liệu theo từng nhóm trong thời gian thực.
- Hỗ trợ điều chỉnh nhiều loại ánh sáng trực tiếp từ giao diện.
- Có hiển thị giá nổi trên mô hình trong các trường hợp phù hợp.
- Có thể build và triển khai dưới dạng website tĩnh.

## 12. Hạn chế hiện tại

- Cảnh vẫn sử dụng mô hình nội thất có sẵn, chưa được dựng hoàn toàn theo chuẩn editor ngay từ đầu.
- Một số rule placement hiện vẫn dựa trên bounding box và heuristic, chưa đạt mức vật lý chính xác tuyệt đối.
- Chưa có chức năng lưu lại layout người dùng sau khi kéo thả.
- Giá hiện đang là dữ liệu tĩnh trong file config, chưa kết nối với backend.

## 13. Hướng phát triển

- Bổ sung tính năng lưu và tải lại bố cục.
- Tách metadata riêng cho từng vật thể như `pivot`, `footprint`, `allowedSurface`.
- Bổ sung thư viện catalog để thêm hoặc xoá vật thể mới trong scene.
- Tạo animation camera mượt hơn cho các tình huống focus hoặc trình diễn.
- Tối ưu thêm hiệu năng và giảm dung lượng tải ban đầu.
- Phát triển theo hướng showroom nội thất 3D hoặc website trưng bày sản phẩm thương mại.

## 14. Kết luận

Đồ án hiện đã hình thành một ứng dụng Web 3D tương tác cho không gian nội thất phòng khách với các chức năng cốt lõi: hiển thị mô hình 3D, điều khiển camera, sắp xếp lại bố cục nội thất, đổi vật liệu, điều chỉnh ánh sáng và hiển thị giá sản phẩm theo nhóm. Đây là nền tảng phù hợp để tiếp tục mở rộng theo hướng trực quan hóa nội thất, thử layout và trình diễn sản phẩm trên web.
