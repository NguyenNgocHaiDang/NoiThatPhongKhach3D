# TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT VĨNH LONG

# XÂY DỰNG WEBSITE 3D TƯƠNG TÁC CHO KHÔNG GIAN NỘI THẤT PHÒNG KHÁCH

## Nhóm sinh viên thực hiện

- Nguyễn Ngọc Hải Đăng - 23029048
- Lê Mộng Bình - 23029053
- Đỗ Thị Thuý Ngân - 23029045

## 1. Giới thiệu đề tài

Đồ án tập trung xây dựng một website 3D tương tác mô phỏng không gian nội thất phòng khách trên nền tảng web. Người dùng có thể quan sát cảnh theo nhiều góc nhìn, chọn nhóm nội thất, thay đổi vật liệu bề mặt và điều chỉnh hệ thống ánh sáng theo thời gian thực.

Mục tiêu của đề tài là ứng dụng kiến thức đồ họa máy tính và WebGL thông qua thư viện Three.js để tạo ra một sản phẩm trực quan, có tính tương tác, dễ trình diễn và đáp ứng các yêu cầu cơ bản của chuyên đề Thiết kế và Lập trình Đồ họa Nâng cao.

## 2. Mục tiêu thực hiện

- Xây dựng một cảnh 3D nội thất có thể hiển thị trực tiếp trên trình duyệt.
- Cho phép người dùng xoay, zoom và quan sát mô hình tự do.
- Tổ chức mô hình thành nhiều nhóm đối tượng để bật hoặc tắt theo từng cụm.
- Hỗ trợ thay đổi vật liệu của đối tượng trong thời gian thực.
- Hỗ trợ điều chỉnh nhiều loại ánh sáng trong cảnh.
- Tối ưu hiệu năng để cảnh hoạt động ổn định trên thiết bị phổ thông.

## 3. Công nghệ sử dụng

- `Three.js`: thư viện dựng đồ họa 3D trên nền WebGL.
- `Vite`: công cụ dev server và build dự án frontend.
- `GLTFLoader` và `DRACOLoader`: tải mô hình GLB/GLTF và giải nén mesh tối ưu.
- `OrbitControls`: hỗ trợ xoay, zoom, pan camera bằng chuột.
- `HTML/CSS/JavaScript ES6`: xây dựng giao diện điều khiển và logic ứng dụng.

## 4. Chức năng chính của hệ thống

### 4.1. Hiển thị cảnh 3D nội thất

Hệ thống tải mô hình không gian nội thất phòng khách từ file GLB và hiển thị trực tiếp trên canvas WebGL.

### 4.2. Tương tác camera

Người dùng có thể:

- Kéo chuột trái để xoay góc nhìn.
- Cuộn chuột để phóng to hoặc thu nhỏ.
- Kéo chuột phải để pan cảnh.

### 4.3. Quản lý nhóm đối tượng

Mô hình được chia thành nhiều nhóm để phục vụ thao tác trong giao diện. Người dùng có thể bật hoặc tắt từng nhóm nội thất để quan sát rõ hơn từng phần của cảnh.

### 4.4. Thay đổi vật liệu thời gian thực

Ứng dụng hỗ trợ thay đổi vật liệu cho các nhóm đối tượng với các kiểu:

- Original
- Standard
- Phong
- Toon
- Wireframe
- Normal

Người dùng cũng có thể thay đổi màu sắc, roughness và metalness đối với các vật liệu phù hợp.

### 4.5. Điều chỉnh ánh sáng

Hệ thống ánh sáng bao gồm:

- Ambient Light
- Directional Light
- Point Light
- Spot Light

Người dùng có thể bật hoặc tắt đèn, chỉnh cường độ và đổi màu trực tiếp từ giao diện.

### 4.6. Chọn đối tượng trong cảnh

Ứng dụng sử dụng raycasting để nhận diện đối tượng khi người dùng click vào mô hình. Tên đối tượng đang chọn sẽ được hiển thị trên giao diện.

### 4.7. Theo dõi hiệu năng

Giao diện có khu vực hiển thị FPS và trạng thái render để hỗ trợ đánh giá hiệu năng khi trình diễn.

## 5. Cấu trúc thư mục chính

```text
3d/
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
    ├── lights/
    ├── materials/
    ├── objects/
    ├── styles/
    ├── ui/
    └── utils/
```

## 6. Mô tả các thành phần chính trong source code

- `src/main.js`: khởi tạo toàn bộ ứng dụng, scene, camera, renderer, object manager, UI và vòng lặp render.
- `src/core/Renderer.js`: cấu hình WebGLRenderer.
- `src/core/Scene.js`: khởi tạo scene.
- `src/core/Camera.js`: thiết lập camera phối cảnh.
- `src/controls/OrbitControls.js`: điều khiển camera.
- `src/objects/ObjectManager.js`: tải mô hình, xử lý mesh, chia nhóm đối tượng, đổi vật liệu và bật tắt hiển thị.
- `src/lights/LightSystem.js`: xây dựng và điều khiển hệ thống ánh sáng.
- `src/ui/UIPanel.js`: xử lý giao diện điều khiển.
- `src/utils/Picker.js`: chọn đối tượng bằng raycaster.
- `src/utils/Performance.js`: hiển thị thông tin hiệu năng.

## 7. Hướng dẫn chạy dự án

### Cài đặt thư viện

```bash
npm install
```

### Chạy môi trường phát triển

```bash
npm run dev
```

Sau đó mở trình duyệt tại địa chỉ:

```text
http://localhost:5173
```

### Build production

```bash
npm run build
```

### Xem trước bản build

```bash
npm run preview
```

## 8. Yêu cầu phần cứng và phần mềm

- Trình duyệt hiện đại hỗ trợ WebGL.
- Máy tính có GPU tích hợp hoặc GPU rời thông dụng.
- Node.js và npm để cài đặt, chạy và build dự án.

## 9. Kết quả đạt được

- Xây dựng thành công website 3D mô phỏng không gian nội thất phòng khách.
- Có giao diện điều khiển rõ ràng cho vật thể, vật liệu và ánh sáng.
- Có tương tác camera và chọn đối tượng trực tiếp trong cảnh.
- Có nhiều nhóm đối tượng để thao tác và đáp ứng yêu cầu cảnh có trên 10 nhóm hoặc đối tượng logic.
- Có khả năng build và triển khai thành website tĩnh.

## 10. Hạn chế hiện tại

- Cảnh hiện sử dụng một mô hình nội thất có sẵn, chưa tự thiết kế toàn bộ từ đầu.
- Chưa tích hợp hệ thống lưu cấu hình vật liệu hoặc ánh sáng theo người dùng.
- Giao diện vẫn tập trung vào tính năng kỹ thuật, chưa phát triển theo hướng thương mại hóa hoàn chỉnh.

## 11. Hướng phát triển

- Bổ sung nhiều mẫu nội thất và nhiều không gian phòng khác nhau.
- Tích hợp thay đổi texture thực tế hơn cho từng món đồ.
- Tối ưu thêm hiệu năng và giảm dung lượng tải ban đầu.
- Triển khai bản online trên GitHub Pages hoặc Netlify.
- Mở rộng theo hướng showroom nội thất hoặc trình diễn sản phẩm thương mại.

## 12. Kết luận

Đồ án đã xây dựng được một ứng dụng Web 3D tương tác cho không gian nội thất phòng khách bằng Three.js. Hệ thống đáp ứng các chức năng cốt lõi như hiển thị mô hình 3D, điều khiển camera, thay đổi vật liệu, điều chỉnh ánh sáng và quản lý nhóm đối tượng. Đây là nền tảng phù hợp để tiếp tục phát triển thành sản phẩm trực quan hóa nội thất trên web trong các giai đoạn tiếp theo.
