# TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT VĨNH LONG

# XÂY DỰNG WEBSITE 3D TƯƠNG TÁC CHO KHÔNG GIAN NỘI THẤT PHÒNG KHÁCH

## Nhóm sinh viên thực hiện

- Nguyễn Ngọc Hải Đăng - 23029048
- Lê Mộng Bình - 23029053
- Đỗ Thị Thuý Ngân - 23029045

## 1. Giới thiệu đề tài

Đây là đồ án xây dựng một website 3D tương tác mô phỏng không gian nội thất phòng khách trên nền tảng web. Ứng dụng cho phép người dùng quan sát toàn cảnh, lọc từng nhóm nội thất, thay đổi vật liệu bề mặt, điều chỉnh hệ thống ánh sáng và xem thông tin giá của từng nhóm sản phẩm.

Mục tiêu của đề tài là vận dụng kiến thức đồ họa máy tính, WebGL và Three.js để tạo ra một sản phẩm trực quan, dễ thao tác và đủ nền tảng để phát triển thành mô hình showroom nội thất 3D.

## 2. Mục tiêu thực hiện

- Xây dựng một cảnh 3D nội thất có thể hiển thị trực tiếp trên trình duyệt.
- Cho phép người dùng xoay, zoom và pan camera tự do.
- Chia mô hình thành nhiều nhóm nội thất logic để phục vụ thao tác lọc và chỉnh sửa.
- Hỗ trợ thay đổi vật liệu theo từng nhóm đối tượng trong thời gian thực.
- Hỗ trợ điều chỉnh nhiều loại ánh sáng trong giao diện.
- Hiển thị giá của sản phẩm ngay trên mô hình khi người dùng tập trung vào từng nhóm.
- Giữ ứng dụng đủ nhẹ để chạy ổn định trên thiết bị phổ thông.

## 3. Công nghệ sử dụng

- `Three.js`: thư viện dựng đồ họa 3D trên nền WebGL.
- `Vite`: dev server và công cụ build frontend.
- `GLTFLoader` và `DRACOLoader`: tải mô hình GLB và giải nén mesh tối ưu.
- `OrbitControls`: hỗ trợ xoay, zoom, pan camera.
- `HTML/CSS/JavaScript ES6`: xây dựng giao diện điều khiển và logic ứng dụng.

## 4. Chức năng hiện có

### 4.1. Hiển thị cảnh 3D nội thất

Ứng dụng tải mô hình phòng khách từ file `scene_opt.glb` và hiển thị trực tiếp trên canvas WebGL.

### 4.2. Điều khiển camera

Người dùng có thể:

- Kéo chuột trái để xoay góc nhìn.
- Cuộn chuột để phóng to hoặc thu nhỏ.
- Kéo chuột phải để pan cảnh.

### 4.3. Lọc nhóm nội thất theo dropdown

Trong tab `Vật thể`, người dùng chọn một nhóm nội thất từ dropdown `Nhóm vật thể`.

Hành vi hiện tại:

- Chọn `Hiển thị tất cả`: hiện toàn bộ cảnh.
- Chọn một nhóm cụ thể: chỉ giữ lại nhóm đó trên màn hình, các nhóm khác bị ẩn.

### 4.4. Focus camera vào nhóm đang chọn

Khi chọn một nhóm trong dropdown, camera sẽ tự dịch chuyển target để nhóm đó được đưa về giữa màn hình. Khi quay lại `Hiển thị tất cả`, camera trở về vùng nhìn mặc định của phòng.

### 4.5. Thay đổi vật liệu theo nhóm

Trong tab `Vật liệu`, người dùng có thể chọn từng nhóm nội thất và thay đổi vật liệu theo thời gian thực.

Các loại vật liệu đang hỗ trợ:

- `original`
- `standard`
- `phong`
- `toon`
- `wireframe`
- `normal`

Ngoài ra, giao diện còn cho phép thay đổi:

- màu sắc
- độ nhám `roughness`
- độ kim loại `metalness`

### 4.6. Điều chỉnh ánh sáng

Ứng dụng hiện hỗ trợ:

- Ambient Light
- Directional Light
- Point Light
- Spot Light

Người dùng có thể bật hoặc tắt từng đèn, thay đổi cường độ và đổi màu trực tiếp từ giao diện.

### 4.7. Hiển thị giá trên mô hình

Mỗi nhóm nội thất trong `src/config/*.js` đều có trường `price`.

Giá được hiển thị theo cơ chế:

- Chỉ hiện label giá khi đang tập trung vào đúng một nhóm.
- Label giá nổi ngay trên model của nhóm đang được hiển thị.
- Khi ở chế độ `Hiển thị tất cả`, label giá sẽ không hiển thị để tránh rối giao diện.

### 4.8. Theo dõi hiệu năng

Thanh trên cùng có hiển thị:

- FPS
- số draw call

để hỗ trợ kiểm tra hiệu năng khi trình diễn.

## 5. Cấu trúc thư mục chính

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
    ├── lights/
    ├── materials/
    ├── objects/
    ├── styles/
    ├── ui/
    └── utils/
```

## 6. Mô tả các thành phần chính trong source code

- `src/main.js`: khởi tạo ứng dụng, scene, camera, controls, UI, price label system và vòng lặp render.
- `src/core/Renderer.js`: cấu hình WebGL renderer.
- `src/core/Scene.js`: khởi tạo scene.
- `src/core/Camera.js`: thiết lập camera phối cảnh.
- `src/controls/OrbitControls.js`: điều khiển camera và hỗ trợ focus vào nhóm đang chọn.
- `src/objects/ObjectManager.js`: tải mô hình, chia nhóm mesh, đổi vật liệu, ẩn/hiện nhóm và cung cấp tâm nhóm để focus hoặc đặt label giá.
- `src/lights/LightSystem.js`: quản lý hệ thống ánh sáng.
- `src/ui/UIPanel.js`: xử lý giao diện cho tab vật thể, vật liệu và ánh sáng.
- `src/ui/PriceLabelSystem.js`: hiển thị label giá nổi trên model.
- `src/config/uiGroups.js`: tập hợp toàn bộ group config dùng trong giao diện.
- `src/config/*.js`: khai báo từng nhóm nội thất với `id`, `label`, `price`, `members`.
- `src/utils/Performance.js`: hiển thị thông tin hiệu năng.

## 7. Cách cập nhật giá sản phẩm

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

## 8. Hướng dẫn chạy dự án

### Cài đặt thư viện

```bash
npm install
```

### Chạy môi trường phát triển

```bash
npm run dev
```

Sau đó mở trình duyệt tại:

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

## 9. Yêu cầu phần cứng và phần mềm

- Trình duyệt hiện đại hỗ trợ WebGL.
- Máy tính có GPU tích hợp hoặc GPU rời thông dụng.
- Node.js và npm để cài đặt, chạy và build dự án.

## 10. Kết quả đạt được

- Xây dựng thành công website 3D mô phỏng không gian nội thất phòng khách.
- Tổ chức được mô hình thành nhiều nhóm nội thất có thể lọc độc lập.
- Hỗ trợ thay đổi vật liệu theo từng nhóm trong thời gian thực.
- Hỗ trợ điều chỉnh nhiều loại ánh sáng trực tiếp từ giao diện.
- Có hiển thị giá nổi trên mô hình cho nhóm đang được tập trung.
- Có cơ chế tự động focus camera vào nhóm đang chọn.
- Có thể build và triển khai dưới dạng website tĩnh.

## 11. Hạn chế hiện tại

- Cảnh vẫn sử dụng một mô hình nội thất có sẵn, chưa tự thiết kế toàn bộ từ đầu.
- Giá hiện đang là dữ liệu tĩnh trong file config, chưa kết nối với cơ sở dữ liệu hay backend.
- Camera mới focus tức thời vào đối tượng, chưa có animation mượt.
- Chưa có chức năng lưu cấu hình vật liệu và ánh sáng theo người dùng.

## 12. Hướng phát triển

- Bổ sung thêm nhiều không gian nội thất và nhiều bộ sản phẩm khác nhau.
- Tách dữ liệu sản phẩm và giá ra thành catalog để dễ quản lý.
- Tạo animation chuyển camera mượt khi focus sản phẩm.
- Bổ sung hình ảnh, mô tả và thông tin sản phẩm chi tiết hơn cho từng nhóm nội thất.
- Tối ưu thêm hiệu năng và giảm dung lượng tải ban đầu.
- Phát triển theo hướng showroom nội thất 3D hoặc website trưng bày sản phẩm thương mại.

## 13. Kết luận

Đồ án hiện đã hình thành một ứng dụng Web 3D tương tác cho không gian nội thất phòng khách với các chức năng cốt lõi: hiển thị mô hình 3D, điều khiển camera, lọc nhóm nội thất, đổi vật liệu, điều chỉnh ánh sáng và hiển thị giá sản phẩm theo nhóm. Đây là nền tảng phù hợp để tiếp tục mở rộng theo hướng trực quan hóa nội thất và trình diễn sản phẩm trên web.
