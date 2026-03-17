# CÁC CHỨC NĂNG ĐÃ TRIỂN KHAI THEO YÊU CẦU ĐỀ TÀI

## 1. Website 3D có giao diện điều khiển

- Đã xây dựng website 3D chạy trên trình duyệt bằng `Three.js` và `Vite`.
- Đã có bảng điều khiển giao diện để thao tác trực tiếp với cảnh 3D.
- Giao diện hiện hỗ trợ bật/tắt layer, điều chỉnh vật liệu và điều chỉnh ánh sáng theo thời gian thực.

## 2. Hiển thị cảnh 3D nội thất

- Đã tích hợp mô hình phòng khách 3D vào website.
- Cảnh được hiển thị trực tiếp trên canvas WebGL.
- Mô hình đang sử dụng file `scene_opt.glb` trong thư mục `public/model/living_room`.

## 3. Số lượng đối tượng và nhóm trong cảnh

- Cảnh đã được chia thành nhiều nhóm nội thất để thao tác trên UI.
- Hiện tại có các nhóm chính như:
  - Bộ ghế sofa
  - Đèn cây
  - Kệ tivi
  - Bộ gối trang trí
  - Ghế có tựa lưng
  - Sách
  - Gỗ và đá trang trí
  - Kệ gỗ treo tường
  - Ghế đôn gỗ
  - Ghế cao
  - còn thiếu 2 nhóm nữa là hoàn thành

## 4. Vật liệu đã triển khai

- Đã xây dựng chức năng thay đổi vật liệu qua giao diện.
- Hiện đang hỗ trợ nhiều kiểu vật liệu:
  - Gốc
  - Chuẩn PBR
  - Phong bóng
  - Toon hoạt họa
  - Khung lưới
  - Pháp tuyến
- Người dùng có thể đổi màu vật liệu, điều chỉnh độ nhám và độ kim loại đối với các loại vật liệu phù hợp.

## 5. Hệ thống ánh sáng đã triển khai

- Đã xây dựng nhiều loại ánh sáng trong scene.
- Các loại ánh sáng hiện có:
  - Ánh sáng môi trường
  - Ánh sáng định hướng
  - Ánh sáng điểm
  - Ánh sáng chiếu điểm
- Người dùng có thể bật/tắt đèn, thay đổi cường độ và thay đổi màu ánh sáng trực tiếp trên UI.

## 6. Tương tác đã triển khai

- Đã triển khai xoay, zoom và pan cảnh bằng chuột thông qua `OrbitControls`.
- Đã triển khai bật/tắt layer theo từng nhóm đối tượng.
- Đã triển khai đổi vật liệu trực tiếp qua giao diện điều khiển.

## 7. Hiệu năng và tối ưu bước đầu

- Đã có khu vực hiển thị trạng thái hiệu năng trên giao diện.
- Đã áp dụng một số tối ưu bước đầu:
  - Tắt shadow
  - Giảm pixel ratio
  - Tắt antialias
  - Đóng băng ma trận cho cảnh tĩnh
  - Bật frustum culling
  - Sử dụng file mô hình tối ưu

## 8. Tài liệu và khả năng chạy dự án

- Đã có file `README.md` hướng dẫn chạy dự án.
- Đã có script chạy môi trường phát triển.
- Đã có script build production.
- Đã triển khai dự án lên `Netlify`.
- Dự án hiện có thể chạy bằng `npm run dev` và build bằng `npm run build`.
