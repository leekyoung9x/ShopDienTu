## 🔧 Yêu cầu sửa lỗi và cải thiện giao diện UI/UX

### 📌 Lỗi hiển thị cần sửa gấp:

#### 🖊️ 1. Input có icon bị lỗi
- Hiện tại placeholder **đè lên icon**, khiến icon bị che mất hoặc khó nhìn (xem ảnh input email, input tìm kiếm...).
- Cần:
  - Thêm padding-left phù hợp cho input khi có icon (ví dụ: `pl-10` nếu icon nằm trong `absolute` bên trái).
  - Đảm bảo placeholder không chồng lên icon.

---

#### 🔍 2. Ô tìm kiếm tại màn danh sách sản phẩm
- Input hiện tại **quá thô và nhỏ**, viền đen, không đồng bộ với giao diện còn lại.
- Cần:
  - Làm đồng bộ với thanh search trên navbar (bo góc, icon, style).
  - Thêm hiệu ứng hover/focus: đổ bóng nhẹ hoặc thay đổi viền để trực quan hơn.

---

#### 🧭 3. Giao diện navbar: "Đăng nhập", "Đăng ký"
- Hiện tại hai nút nằm **trên 2 dòng riêng biệt** trông rất lộn xộn.
- Cần:
  - Đưa về **1 dòng ngang**, cách đều và căn chỉnh chính giữa theo chiều cao navbar.
  - Có thể group bằng flex hoặc dropdown tùy UX mong muốn.

---

#### 🔁 4. Form đăng nhập hiện tại bị **lặp** phần “Đăng nhập với Google”
- Có **2 phần Google Login** trong cùng 1 form, trông rất rối và dư thừa.
- Cần:
  - Giữ lại **1 nút Google login**, bỏ phần dư phía dưới.
  - Căn chỉnh lại `divider` (hoặc đoạn "Hoặc tiếp tục với") nếu cần.

---

### 💅 Đề xuất UI chung
- Sử dụng **component Input có icon** (có thể tái sử dụng).
- Thêm hiệu ứng focus, hover cho input, nút và dropdown → trải nghiệm trơn tru.
- Đảm bảo tất cả form `đăng nhập`, `đăng ký`, `quên mật khẩu` dùng cùng một cấu trúc layout & padding để giao diện thống nhất.
- Font, kích thước chữ và spacing nên đồng bộ toàn bộ hệ thống.

---

### 🧪 Gợi ý nâng cao
- Thêm dark mode hoặc hỗ trợ theme đổi màu.
- Thêm `aria-label` và role phù hợp cho accessibility.