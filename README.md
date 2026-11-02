# Thiệp cưới Thùy Linh & Tuấn Dương

Thiệp đỏ truyền thống trên nền kem, HTML/CSS/JavaScript thuần, không framework, không cần build. Một tiệc chung lúc **17:00 ngày 29/11/2026 (giờ Việt Nam)** tại **Queen Bee Luxury, 20 Láng Hạ, phường Láng, Hà Nội**.

Giao diện tham khảo bố cục thiệp Toàn–Loan: phong bì kem có dấu sáp đỏ và hiệu ứng mở nắp; ảnh bìa phủ màn hình với tên viết tay; lời ngỏ, đếm ngược, chân dung tròn, một tiệc chung trên nền tối, album dạng lưới, hai tab mừng cưới và lời cảm ơn. Không có thanh menu. Không sử dụng ảnh, QR hay mã nguồn của cặp đôi mẫu.

Stylesheet đang sử dụng là **`styles/invitation.css`**. `styles.css` và `styles/romantic.css` là các phiên bản cũ được giữ lại, không còn được nạp bởi `index.html`. Hiệu ứng mở thiệp và hiện dần khi cuộn nằm trong `js/motion.js`; chuyển tab mừng cưới trong `js/gift-tabs.js`. Nốt nhạc rơi chỉ trong ảnh bìa và phần tiệc: mỗi phần 15 nốt, cỡ 25px, độ mờ 18%, chu kỳ 26 giây, không chặn thao tác. Hiệu ứng tự tắt khi thiết bị chọn giảm chuyển động. Không có JavaScript thì phong bì không chặn nội dung và cả hai mục mừng cưới đều đọc được.

## Xem trên máy

Thứ tự tên ở bìa và trang đầu là **Tuấn Dương & Thùy Linh**; dấu viết tắt trên phong bì, dấu sáp, chân trang và favicon là **D&L**.

Đoạn trích “Hạnh phúc không phải là đích đến…” dùng chữ co giãn 14–16px; tiêu đề “Khoảnh khắc của chúng mình” dùng 22–34px. Ở màn hình rộng 375px, hai phần lần lượt là 15px và 24px; không đổi các tiêu đề khác. Kiểm tra bằng `tests/quote-gallery-type-checks.js` tại 320–1440px.

Chữ trang ảnh đầu trên điện thoại tự co theo cả chiều rộng (`vw`) và chiều cao màn hình ổn định (`svh`), có giới hạn bằng CSS `clamp()`/`min()`. Cụm tên/ngày/lời nhắn được thu gọn sát đáy ảnh, không giữ cỡ tên 64px cố định. Khi xoay ngang điện thoại, tên nằm một hàng và ẩn nhãn trang trí “The wedding of”/gợi ý cuộn để dành chỗ cho ảnh. Bố cục desktop không đổi. `tests/mobile-hero-checks.js` kiểm tra kích thước dọc/ngang, tỷ lệ vùng chữ, tên không bị cắt, co theo hai chiều và desktop giữ nguyên.

Yêu cầu Python 3. Chạy trong thư mục dự án:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Mở <http://localhost:8000>. Không mở trực tiếp `index.html` bằng `file://`, vì JavaScript dùng mô-đun. Nếu có Node/npm, có thể dùng `npm start`.

## Cập nhật nội dung

### Tạo link riêng cho từng khách

Mở <https://leduong2101.github.io/wedding/tao-link.html>, nhập đầy đủ tên/cách xưng hô (ví dụ **Anh Minh và gia đình**), kiểm tra phần xem trước, bấm **Tạo link**, rồi **Sao chép link** để gửi qua Zalo hoặc tin nhắn. Có thể bấm **Mở thiệp xem thử** trước khi gửi. Nếu sao chép tự động bị chặn, trang chọn sẵn link để bạn sao chép thủ công.

Mỗi link chứa tên riêng trong tham số `khach`, ví dụ `https://leduong2101.github.io/wedding/?khach=Anh+Minh`. Thiệp chỉ hiển thị tên trên phong bì; link gốc không có tên vẫn hiện lời mời chung. Hai khách mở link cùng lúc không ảnh hưởng nhau. Khi đổi tên trong công cụ, link cũ được ẩn để tránh gửi nhầm. Tên được chuẩn hóa khoảng trắng, giới hạn 120 ký tự và hiển thị dạng chữ thuần, không thực thi HTML.

Trang tạo link **công khai, không đăng nhập**, không có cơ sở dữ liệu, danh sách khách, cookie hay lưu tên vào localStorage. Tên nằm trong URL nên có thể xuất hiện trong lịch sử trình duyệt/tin nhắn và nhật ký truy cập của nhà cung cấp hosting; người nhận có thể sửa hoặc chuyển tiếp link. Đây không phải cơ chế xác thực danh tính hay giới hạn khách. Không đưa dữ liệu nhạy cảm vào tên. Công cụ không được gắn nút dẫn trong thiệp nhưng ai biết địa chỉ đều dùng được.

Mã xử lý: `js/guests.js` (chuẩn hóa tên và tạo link), `js/guest-generator.js`, `tao-link.html` và `styles/guest-generator.css`. Khi chạy local, công cụ tạo link local; hãy dùng trang công khai để tạo link gửi khách.

Thông tin động tập trung tại **`js/config.js`**:

- `bride`, `groom`: tên, tên gọi ngắn, bố mẹ và `photo: { src, alt }` cho ảnh chân dung tròn.
- `heroPhoto: { src, alt }`: ảnh bìa toàn màn hình. Chọn ảnh có khoảng trống dưới để đặt tên; kiểm tra cả khung dọc điện thoại và khung ngang máy tính. Điều chỉnh `object-position` của `.hero-photo` trong stylesheet nếu cần.
- `couplePhoto: { src, alt }`: ảnh đôi lớn sau phần giới thiệu gia đình.
- `event`: thời điểm có múi giờ `+07:00`, nhà hàng, địa chỉ, Google Maps và `photo: { src, alt }` minh họa cho thẻ tiệc cưới.
- `photos`: danh sách ảnh album, mô tả `alt`, chú thích `caption`. Nếu không có `heroPhoto` thì dùng ảnh album đầu tiên cho bìa. Đặt ảnh trong `assets/`, dùng đường dẫn tương đối, ví dụ `assets/anh-cuoi-01.webp`. Nên nén ảnh xuống dưới khoảng 300 KB/ảnh, chiều rộng 1000–1600px; không dùng ảnh gốc dung lượng lớn.
- `music`: thay `src` bằng đường dẫn nhạc bạn có quyền sử dụng, ví dụ `assets/nhac-cuoi.mp3`; sửa `label` cho đúng tên bài. Nhạc bắt đầu khi bấm **Mở thiệp**, phát lặp và có nút bật/tắt. Trình duyệt có thể dừng khi khóa màn hình/chuyển ứng dụng.
- `gifts`: mặc định `null` nên chỉ hiện **QR sẽ được cập nhật**. Không có số tài khoản hoặc QR giả.

**Thiệp phát lặp 70 giây đầu Beautiful in White (00:00–01:10)** tại `assets/beautiful-in-white-70s.mp3`. Người dùng đã xác nhận có quyền sử dụng công khai và yêu cầu giữ bài này khi đăng GitHub Pages; bản cắt 70 giây được đưa vào Git. Nguồn và giới hạn xác minh độc lập được ghi trong `assets/music-source.md`. File đầy đủ, bản cắt 67 giây cũ, thư mục `downloads/` và ảnh JPG gốc trong `image/` tiếp tục được Git-ignore, chỉ giữ trên máy. Không đưa token hoặc thông tin đăng nhập lên GitHub.

Ví dụ cấu hình mừng cưới (tự điền dữ liệu thật, không dùng nội dung ví dụ để nhận tiền):

```js
gifts: {
  bride: {
    qr: 'assets/qr-bride.png',
    bank: 'Tên ngân hàng',
    account: 'SỐ_TÀI_KHOẢN_THẬT',
    holder: 'TÊN_CHỦ_TÀI_KHOẢN_THẬT',
  },
  groom: null,
},
```

QR phải là ảnh cục bộ `.png`, `.jpg`, `.jpeg` hoặc `.webp` trong `assets/`. Chỉ cấu hình đủ cả bốn trường mới hiện hướng dẫn thanh toán và nút sao chép. **Tự quét kiểm tra ngân hàng, tài khoản và chủ tài khoản trước khi công khai.** Sao chép cần HTTPS hoặc localhost; nếu trình duyệt không hỗ trợ, trang hiển thị số để sao chép thủ công.

Ảnh thật đã được ghép từ folder `image/` vào các bản WebP trong `assets/photos/`: bìa `4981`, chú rể `4671`, cô dâu `4303`, ảnh đôi `4528`, thẻ tiệc `4132`, album lần lượt `3832`, `3386`, `2717`. `4999` không dùng; mọi ảnh gốc giữ nguyên. Bản web được xoay theo EXIF, bỏ metadata, thu nhỏ; hai ảnh chân dung được cắt riêng để vừa khung tròn. Các ghi chú ảnh minh họa đã được gỡ khỏi trang.

Hai ảnh bìa/ảnh đôi hiện dùng bản `GAA04981-centered.webp` và `GAA04528-centered-hq.webp`, cắt riêng để hai bạn cân giữa thay vì căn theo phông nền trống. Bản ảnh WebP trước và ảnh JPG gốc vẫn giữ nguyên. Chân dung hiển thị 154px trên điện thoại, 175px trên máy tính; ảnh đôi rộng tối đa 576px (480px trên điện thoại), tăng khoảng 20% so với trước nhưng giới hạn theo chiều rộng màn hình, chừa ít nhất 8px mỗi bên. Số đếm ngược, tiêu đề đếm ngược và tên bố mẹ được in đậm. Album không có biểu tượng tròn đè ảnh, vẫn bấm xem lớn được. Nút mở thiệp hiển thị “Chạm để mở thiệp”, không còn dòng gợi ý nghe nhạc bên dưới.

Chân dung dùng `GAA04671-waist-hq.webp` và `GAA04303-waist-hq.webp`, xuất trực tiếp từ JPG gốc ở 1200×1200, chất lượng WebP 95; cô dâu lấy khung xuống thấp thêm. Ảnh đôi được xuất từ JPG gốc ở 2000×2500, chất lượng 95, không phóng nội suy bản web cũ. Cả ba ảnh đủ mật độ điểm ảnh cho kích thước ô hiện tại trên màn hình 3x. Hai dòng mời dưới tiêu đề “Cô dâu & Chú rể” đã được bỏ. Tiêu đề thẻ sự kiện là “Lễ Thành hôn”; chữ “Xem bản đồ” được căn giữa riêng, mũi tên đặt lệch phải không chiếm chỗ của chữ.

Khi đổi ảnh tiếp, cập nhật config và cả alt/src dự phòng tương ứng trong `index.html`. Thông báo phát nhạc tự lấy tên bài từ `music.label`. Nếu đổi ngày, tên hay địa điểm: cập nhật cả các bản nội dung dự phòng trong `index.html` để khách không bật JavaScript vẫn đọc đúng thông tin, cùng title và meta description. Khi JavaScript hoạt động, config tự đồng bộ các thông tin đó.

## Đăng lên GitHub Pages

Repository đích: <https://github.com/leduong2101/wedding>. Link Pages: <https://leduong2101.github.io/wedding/>. Xuất bản từ nhánh `main`, thư mục gốc.

Tài khoản GitHub cho riêng dự án dùng hồ sơ CLI tại `$HOME/.config/gh-wedding`; các lệnh quản trị repo cần tiền tố `GH_CONFIG_DIR="$HOME/.config/gh-wedding"`. Credential helper và danh tính tác giả commit được cấu hình tại `.git/config` của repo này, không sửa cấu hình Git toàn cục. Các tệp thông tin đăng nhập không nằm trong dự án.

1. Tạo repository GitHub bằng tài khoản của bạn. Dùng `TEN_TAI_KHOAN.github.io` nếu muốn link gốc, hoặc tên như `thiep-cuoi` nếu muốn link project.
2. Đưa các file vào **gốc repository**, gồm `index.html`, `styles.css`, `styles/`, `js/`, `assets/` và `.nojekyll`. Có thể đưa cả dự án lên để giữ tài liệu/kiểm thử.
3. Mở **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Chọn nhánh chứa mã nguồn (thường `main`) và thư mục **/(root)**, rồi **Save**.
5. Chờ GitHub triển khai. Link sẽ có dạng `https://TEN_TAI_KHOAN.github.io/` hoặc `https://TEN_TAI_KHOAN.github.io/thiep-cuoi/`.
6. Mở link trên điện thoại, kiểm tra nhạc, giờ cưới, bản đồ, ảnh và QR trước khi gửi khách. Nhạc 70 giây đã được cho phép đưa vào Git theo xác nhận của người dùng; QR hiện vẫn chờ cập nhật.

Không dùng đường dẫn `/assets/...` vì sẽ hỏng dưới link project. Tất cả tài sản hiện tại dùng đường dẫn tương đối, không có hotlink, Google Fonts hay dịch vụ thống kê. Repository Pages thường công khai; **chỉ đưa lên thông tin gia đình/tài khoản mà bạn đồng ý công khai**, không bao giờ đưa mật khẩu/token vào dự án. Khách có link không phải là kiểm soát truy cập riêng tư.

## Kiểm thử

Node.js 20+ (không cần `npm install`):

```sh
npm test
```

Kiểm thử đếm ngược trước/đúng/sau giờ cưới, trạng thái nhạc và dữ liệu mừng cưới. Các kịch bản Playwright cho browser tool:

- `tests/browser-checks.js`: nhạc thực tế, album/bàn phím, mobile 320–1440px, không JavaScript, múi giờ, ngày cưới, nhạc lỗi, đường dẫn project và lỗi tài sản.
- `tests/soft-design-checks.js`: chuyển cảnh/focus, tương phản chữ, font tên, bố cục mềm mại, hiện dần khi cuộn, giảm chuyển động.
- `tests/reference-layout-checks.js`: phong bì/dấu sáp/mở nắp, ảnh bìa toàn màn hình, chân dung tròn, một tiệc chung, MP3 thực tế, hai tab mừng cưới (click, phím mũi tên, Home/End), nốt nhạc trang trí và hành vi không JavaScript.
- `tests/layout-polish-checks.js`: nút mở thiệp căn giữa, lời ngỏ mới, bỏ lời mời lặp lại, chữ đậm, ba ảnh trang giới thiệu lớn và vừa màn hình, 15 nốt nhạc 25px/mờ/chậm đúng hai phần, không chặn thao tác, giảm chuyển động, album không có huy hiệu tròn nhưng vẫn xem lớn được.
- `tests/portrait-event-checks.js`: tải đúng bản chân dung khung rộng, tiêu đề “Lễ Thành hôn”, chữ bản đồ cân giữa tại 320–1440px; xuất ảnh chụp để kiểm tra bố cục.
- `tests/guest-browser-checks.js`: nhập tên/xem trước/tạo link, đổi tên làm mất link cũ, sao chép thành công/thất bại, hai khách đồng thời, dữ liệu giống HTML, tên dài trên mobile, thiệp chung và trang tạo link 320–1440px. `tests/guests.test.js` thuộc `npm test`, kiểm tra mã hóa URL/tên tiếng Việt/giới hạn/đường dẫn project.

Khởi động local server trước khi chạy; gọi `browser_run_code_unsafe` với `filename` trỏ đến từng file trong môi trường có Playwright browser tools. Các file này không thuộc `npm test` và dự án không cài Playwright làm dependency.

## Tài sản minh họa

Các SVG trong `assets/` được tạo riêng cho dự án, **không phải ảnh thật của hai bạn**. `assets/music-demo.wav` là giai điệu hộp nhạc ngũ cung nguyên bản dài 19,2 giây, tạo bằng Python chuẩn; có thể tạo lại bằng:

```sh
python3 scripts/generate_music.py
```

Không có thư viện runtime. Các tranh SVG và nhạc demo là tài sản tạo riêng; MP3 Beautiful in White là bản tải bên thứ ba dùng cho chạy thử cục bộ, được ghi nguồn riêng ở trên. Font chữ viết tay **Dancing Script**, tác giả The Dancing Script Project Authors / Impallari Type, được lưu cục bộ nguyên bản tại `assets/fonts/dancing-script.ttf`, hỗ trợ tiếng Việt và không gọi máy chủ Google lúc xem thiệp. Nguồn: <https://github.com/google/fonts/tree/main/ofl/dancingscript>. Font được phân phối theo **SIL Open Font License 1.1**, kèm bản quyền và giấy phép tại `assets/fonts/OFL.txt`; giữ file giấy phép khi xuất bản. Thông tin thiết kế và kế hoạch nằm trong `docs/superpowers/`.
