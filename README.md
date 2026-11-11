# Thiệp cưới Thùy Linh & Tuấn Dương

Thiệp xanh lá trầm trên nền kem, điểm hoa lan trắng, HTML/CSS/JavaScript thuần, không framework, không cần build. Một tiệc chung ngày **29/11/2026 (giờ Việt Nam)** tại **Queen Bee Luxury, 20 Láng Hạ, phường Láng, Hà Nội**: **17:00 đón khách · 17:30 tổ chức hôn lễ · 18:00 khai tiệc**. Mốc đếm ngược vẫn là giờ đón khách 17:00.

Giao diện giữ bố cục thiệp hiện tại: phong bì xanh có dấu sáp đồng và hiệu ứng mở nắp; ảnh bìa phủ màn hình với tên viết tay; lời ngỏ, đếm ngược, chân dung tròn, lời mời tiệc chung và timeline trên nền kem, album dạng lưới, xác nhận tham dự, hai tab mừng cưới và lời cảm ơn. Không có thanh menu. Không sử dụng ảnh, QR hay mã nguồn của cặp đôi mẫu.

Mẫu cập nhật do chủ thiệp cung cấp tại `~/Downloads/update_wedding_card/{invitation,ending,color}` chỉ dùng làm tham khảo bố cục/màu/nội dung; không đưa các ảnh chụp màn hình có tên khách hoặc ảnh cặp đôi khác vào website. `assets/flowers-orchid.svg` và `assets/wedding-timeline.svg` là minh họa SVG tự vẽ, tải cục bộ, không chặn thao tác. Màu chủ đạo chỉnh tại `:root` của `styles/invitation.css` (`--paper`, `--green`, `--green-deep`, `--surface`, `--edge`); tên token cũ `--wine`/`--wine-dark` được giữ làm bí danh xanh để không đổi giao diện lập trình của các thành phần.

Stylesheet thiệp chính và app/config dùng `?v=20261111-v2` để lấy nội dung mới thay vì bộ nhớ đệm cũ; favicon/CSS ở trang phụ vẫn dùng `?v=20261111`. Không đổi URL thiệp hoặc link tên khách đã gửi. Khi cập nhật tài nguyên về sau, tăng phiên bản ở các tham chiếu liên quan.

Trang tiệc hiển thị tên từ `khach` dạng chữ thuần, thiếu tên dùng “Quý khách”; bên dưới là “Đến dự bữa tiệc thân mật / chung vui cùng gia đình chúng tôi.” theo ghi chú `update_v2`. Nhãn trước 17:00 là “Được tổ chức vào hồi”; timeline vẫn giữ 17:00 đón khách, 17:30 hôn lễ, 18:00 khai tiệc. Ngày/tháng/năm lấy từ ngày cưới cấu hình, không dùng ngày/nhà hàng trong ảnh mẫu. `event.lunarDate` chứa ngày âm lịch do chủ thiệp cung cấp: “(Tức ngày 21 tháng 10 năm Bính Ngọ)”, hiển thị dưới lịch dương; `event.venuePrefix` ghi “Tầng 2 Trung tâm tiệc cưới” phía trên Queen Bee Luxury. Ba mốc timeline nằm tại `event.timeline` trong `js/config.js`, có nội dung HTML dự phòng khi tắt JavaScript. Khi đổi lịch trình, cập nhật cả các thẻ `<time datetime>` và nội dung dự phòng trong `index.html`. Trang cuối dùng nguyên văn lời cảm ơn ở mẫu `ending`, không thêm ảnh mới hoặc thay ảnh đang dùng.

Stylesheet đang sử dụng là **`styles/invitation.css`**. `styles.css` và `styles/romantic.css` là các phiên bản cũ được giữ lại, không còn được nạp bởi `index.html`. Hiệu ứng mở thiệp và hiện dần khi cuộn nằm trong `js/motion.js`; chuyển tab mừng cưới trong `js/gift-tabs.js`. Nốt nhạc rơi chỉ trong ảnh bìa và phần tiệc: mỗi phần 15 nốt, cỡ 25px, độ mờ 18%, chu kỳ 26 giây, không chặn thao tác. Hiệu ứng tự tắt khi thiết bị chọn giảm chuyển động. Không có JavaScript thì phong bì không chặn nội dung và cả hai mục mừng cưới đều đọc được.

## Xem trên máy

Thứ tự tên ở bìa và trang đầu là **Tuấn Dương & Thùy Linh**; dấu viết tắt trên phong bì, dấu sáp, chân trang và favicon là **D&L**.

Có thể mở thiệp bằng cách chạm bất kỳ vị trí nào trên hình phong bì (kể cả dấu sáp) hoặc nút **Chạm để mở thiệp**. Vùng phong bì là nút hỗ trợ Enter/Space; cả hai cách dùng chung hiệu ứng/nhạc, khóa kích hoạt lặp và không thay đổi bố cục. `tests/envelope-open-checks.js` kiểm tra các cách mở này.

Đoạn trích “Hạnh phúc không phải là đích đến…” dùng chữ co giãn 12–14px; tiêu đề “Khoảnh khắc của chúng mình” dùng 18–26px. Ở màn hình rộng 375px, hai phần lần lượt là 12px và 20px; không đổi các tiêu đề khác. Kiểm tra bằng `tests/quote-gallery-type-checks.js` tại 320–1440px.

Chữ trang ảnh đầu trên điện thoại tự co theo cả chiều rộng (`vw`) và chiều cao màn hình ổn định (`svh`), có giới hạn bằng CSS `clamp()`/`min()`. Cụm tên/ngày/lời nhắn được thu gọn sát đáy ảnh, không giữ cỡ tên 64px cố định. Khi xoay ngang điện thoại, tên nằm một hàng và ẩn nhãn trang trí “The wedding of”/gợi ý cuộn để dành chỗ cho ảnh. Bố cục desktop không đổi. `tests/mobile-hero-checks.js` kiểm tra kích thước dọc/ngang, tỷ lệ vùng chữ, tên không bị cắt, co theo hai chiều và desktop giữ nguyên.

Yêu cầu Python 3. Chạy trong thư mục dự án:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Mở <http://localhost:8000>. Không mở trực tiếp `index.html` bằng `file://`, vì JavaScript dùng mô-đun. Nếu có Node/npm, có thể dùng `npm start`.

## Cập nhật nội dung

### Tạo link riêng cho từng khách

Mở <https://leduong2101.github.io/wedding/tao-link.html>, nhập đầy đủ tên/cách xưng hô (ví dụ **Anh Minh và gia đình**), kiểm tra phần xem trước, bấm **Tạo link**, rồi **Sao chép link** để gửi qua Zalo hoặc tin nhắn. Có thể bấm **Mở thiệp xem thử** trước khi gửi. Nếu sao chép tự động bị chặn, trang chọn sẵn link để bạn sao chép thủ công.

Mỗi link chứa tên riêng trong tham số `khach`, ví dụ `https://leduong2101.github.io/wedding/?khach=Anh+Minh`. Thiệp hiển thị tên trên phong bì, trong lời mời trang tiệc và tự điền ở form xác nhận; link gốc không có tên vẫn hiện lời mời chung. Hai khách mở link cùng lúc không ảnh hưởng nhau. Khi đổi tên trong công cụ, link cũ được ẩn để tránh gửi nhầm. Tên được chuẩn hóa khoảng trắng, giới hạn 120 ký tự và hiển thị dạng chữ thuần, không thực thi HTML.

Trang tạo link **công khai, không đăng nhập**, không có cơ sở dữ liệu, danh sách khách, cookie hay lưu tên vào localStorage. Tên nằm trong URL nên có thể xuất hiện trong lịch sử trình duyệt/tin nhắn và nhật ký truy cập của nhà cung cấp hosting; người nhận có thể sửa hoặc chuyển tiếp link. Đây không phải cơ chế xác thực danh tính hay giới hạn khách. Không đưa dữ liệu nhạy cảm vào tên. Công cụ không được gắn nút dẫn trong thiệp nhưng ai biết địa chỉ đều dùng được.

Mã xử lý: `js/guests.js` (chuẩn hóa tên và tạo link), `js/guest-generator.js`, `tao-link.html` và `styles/guest-generator.css`. Khi chạy local, công cụ tạo link local; hãy dùng trang công khai để tạo link gửi khách.

### Xác nhận tham dự qua Google Sheets

Form **Xác nhận tham dự** nằm ngay trong `index.html`, **sau album và trước Mừng cưới**. Khách mở link tên đã gửi trước đây chỉ cần cuộn xuống để xác nhận, không chuyển trang, không cần tạo/gửi lại link. Tên tự điền từ `khach`; khách có thể chỉnh tên, link không có tên yêu cầu nhập tên. Lời nhắn căn giữa, ba dòng và “Trân trọng!” tách dòng riêng. Không có ô lời nhắn. `xac-nhan.html` được giữ tương thích với địa chỉ đã công bố, nhưng thiệp không dẫn khách sang trang đó; cả hai dùng chung bộ xử lý `js/rsvp-page.js` và endpoint.

- Chọn **Sẽ tham dự** mới hiện ô chọn **Số người tham dự** từ 1–10 (tổng người đến, gồm người được mời và người đi cùng).
- Chọn **Không thể tham dự** ẩn ô số người và gửi `0`.
- Nhấn **Xác nhận** gửi form POST tới Google Apps Script; khóa thao tác khi đang gửi và sau khi thành công để hạn chế bấm trùng. Chỉ thông báo “Đã lưu” khi nhận được JSON `{ "ok": true }`, không dùng `no-cors`. Lỗi mạng/timeout 30 giây không đồng nghĩa chưa ghi: thông báo yêu cầu liên hệ trước khi gửi lại, tránh lưu trùng.
- Bảng tính riêng tư có tab **Xác nhận tham dự**, tự tạo khi nhận lần đầu, gồm bốn cột: **Thời gian xác nhận · Tên khách · Trạng thái · Số người tham dự**. Mã chỉ thêm dòng; không sửa/xóa nội dung có sẵn. Tên được lưu dạng văn bản để không chạy công thức Sheets.
- Trang không lưu tên trong cookie/localStorage. Chỉ khi bấm gửi mới chuyển tên và xác nhận cho Google. Endpoint công khai, không xác thực khách, không có chống spam mạnh hay chống trùng giữa nhiều tab/lần tải lại; cần lọc các dòng thử/trùng thủ công. Không công khai bảng tính hoặc đưa thông tin khách đã phản hồi vào Git.

Mã frontend: `js/rsvp.js` (endpoint, kiểm tra dữ liệu, gửi và đọc kết quả), `js/rsvp-page.js`, `styles/rsvp.css`. Mẫu Apps Script: `scripts/rsvp-apps-script.gs`; ID bảng tính không phải mật khẩu và không cấp quyền đọc bảng.

Để cài lại, chủ bảng tính mở **Tiện ích mở rộng → Apps Script**, dán mẫu vào `Code.gs`, lưu, chọn **Triển khai → Tùy chọn triển khai mới → Ứng dụng web**, thực thi với tư cách **Tôi**, truy cập **Bất kỳ ai**. Chủ tài khoản tự duyệt/cấp quyền bảng tính; khách không đăng nhập. Giữ quyền chia sẻ bảng tính **Bị hạn chế**. Sao chép URL `/exec` vào `rsvpEndpoint` trong `js/rsvp.js`. Nếu cập nhật mã Apps Script, sửa triển khai sang **phiên bản mới**; chỉ lưu file không cập nhật bản đang chạy. Có thể đặt múi giờ của bảng tính và dự án Apps Script sang Việt Nam để hiển thị giờ xác nhận địa phương. GET endpoint chỉ báo tình trạng dịch vụ, không trả tên/danh sách khách và không xác minh được quyền ghi Sheets; cần thử gửi thật để kiểm tra kết nối.

`tests/rsvp-browser-checks.js` chặn mọi request Apps Script bằng phản hồi thử, không thêm khách thật. Không chạy kiểm thử ghi thật tự động trong CI. Khi kiểm tra kết nối thực tế, dùng tên rõ ràng **KIỂM THỬ KẾT NỐI (có thể xóa)** và báo chủ bảng xóa dòng này khi kiểm tra xong.

Thông tin động tập trung tại **`js/config.js`**:

- `bride`, `groom`: tên, tên gọi ngắn, bố mẹ và `photo: { src, alt }` cho ảnh chân dung tròn.
- `heroPhoto: { src, alt }`: ảnh bìa toàn màn hình. Chọn ảnh có khoảng trống dưới để đặt tên; kiểm tra cả khung dọc điện thoại và khung ngang máy tính. Điều chỉnh `object-position` của `.hero-photo` trong stylesheet nếu cần.
- `couplePhoto: { src, alt }`: ảnh đôi lớn sau phần giới thiệu gia đình.
- `event`: thời điểm đón khách có múi giờ `+07:00`, `timeline` gồm giờ/nhãn của ba mốc, nhà hàng, địa chỉ, Google Maps và `photo: { src, alt }` minh họa cho thẻ tiệc cưới.
- `photos`: danh sách ảnh album, mô tả `alt`, chú thích `caption`. Nếu không có `heroPhoto` thì dùng ảnh album đầu tiên cho bìa. Đặt ảnh trong `assets/`, dùng đường dẫn tương đối, ví dụ `assets/anh-cuoi-01.webp`. Nên nén ảnh xuống dưới khoảng 300 KB/ảnh, chiều rộng 1000–1600px; không dùng ảnh gốc dung lượng lớn.
- `music`: thay `src` bằng đường dẫn nhạc bạn có quyền sử dụng, ví dụ `assets/nhac-cuoi.mp3`; sửa `label` cho đúng tên bài. Nhạc bắt đầu khi bấm **Mở thiệp**, phát lặp và có nút bật/tắt. Trình duyệt có thể dừng khi khóa màn hình/chuyển ứng dụng.
- `gifts`: đã cấu hình hai QR thật do chủ thiệp cung cấp; mỗi người có ảnh QR, ngân hàng, chủ tài khoản và nút sao chép riêng. Nếu gỡ cấu hình thì cần đồng thời sửa nội dung dự phòng trong HTML.

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

Ảnh đã chỉnh sửa lấy từ `~/Downloads/update_wedding_card/new_image/`, xuất thành các file `GAAxxxxx-retouched.webp` trong `assets/photos/`: trang 1/bìa `4981`, trang 3/ảnh đôi `4528`, trang 4/thẻ tiệc `4132`; album sáu ảnh theo thứ tự `3342 → 4599 → 5079 → 3494 → 2717 → 4999` (đổi chỗ 3494/5079 theo ghi chú `update_v2`, chú thích đi cùng ảnh). Ảnh `3494` lấy từ `GAA03494_(2).jpg`; `5079` là số ảnh đã được chủ thiệp đính chính. Trang 2 giữ nguyên ảnh hiện tại. Bản web xoay theo EXIF, bỏ metadata, thu nhỏ tối đa 1600×2400 (ảnh đôi 2000×3000), WebP chất lượng 90. Không thay đổi hoặc xóa các ảnh gốc/bản web cũ.

Ảnh bìa/ảnh đôi dùng `GAA04981-retouched-centered.webp` (1600×3000) và `GAA04528-retouched-centered.webp` (2000×2500), cắt trực tiếp từ JPG đã chỉnh sửa để tâm hai người nằm giữa khung thay vì căn giữa cả phông nền/hoa. Khung cắt trên JPG 4672×7008: 4981 `(140, 0, 3878, 7008)`; 4528 `(60, 950, 3660, 5450)`, sau đó thu nhỏ Lanczos, WebP 90. Không đổi CSS hay khung các phần khác. Chân dung hiển thị 154px trên điện thoại, 175px trên máy tính; ảnh đôi rộng tối đa 576px (480px trên điện thoại), giới hạn theo chiều rộng màn hình, chừa ít nhất 8px mỗi bên. Số đếm ngược, tiêu đề đếm ngược và tên bố mẹ được in đậm. Album không có biểu tượng tròn đè ảnh, vẫn bấm xem lớn được. Nút mở thiệp hiển thị “Chạm để mở thiệp”, không còn dòng gợi ý nghe nhạc bên dưới.

Chân dung giữ nguyên `GAA04671-waist-hq.webp` và `GAA04303-waist-hq.webp`, xuất trực tiếp từ JPG gốc ở 1200×1200, chất lượng WebP 95; cô dâu lấy khung xuống thấp thêm. Chân dung và ảnh đôi đủ mật độ điểm ảnh cho kích thước ô hiện tại trên màn hình 3x. Hai dòng mời dưới tiêu đề “Cô dâu & Chú rể” đã được bỏ. Tiêu đề thẻ sự kiện là “Lễ Thành hôn”; chữ “Xem bản đồ” được căn giữa riêng, mũi tên đặt lệch phải không chiếm chỗ của chữ.

Hai QR lấy từ `~/Downloads/update_wedding_card/QR/{bride.jpeg,groom.jpg}`, chỉ cắt phần mã với lề trắng, không vẽ lại/nén mất dữ liệu, lưu PNG tại `assets/qr-{bride,groom}.png`. Thông tin chủ tài khoản/số tài khoản lấy từ ảnh cung cấp; ngân hàng cô dâu được đối chiếu BIN VietQR. Không thực hiện giao dịch để kiểm thử. Khi thay QR, chủ thiệp nên quét bằng ứng dụng ngân hàng và xác nhận đúng người nhận trước khi gửi khách.

Khi đổi ảnh tiếp, cập nhật config và cả alt/src dự phòng tương ứng trong `index.html`. Thông báo phát nhạc tự lấy tên bài từ `music.label`. Nếu đổi ngày, tên hay địa điểm: cập nhật cả các bản nội dung dự phòng trong `index.html` để khách không bật JavaScript vẫn đọc đúng thông tin, cùng title và meta description. Khi JavaScript hoạt động, config tự đồng bộ các thông tin đó.

## Đăng lên GitHub Pages

Repository đích: <https://github.com/leduong2101/wedding>. Link Pages: <https://leduong2101.github.io/wedding/>. Xuất bản từ nhánh `main`, thư mục gốc.

Tài khoản GitHub cho riêng dự án dùng hồ sơ CLI tại `$HOME/.config/gh-wedding`; các lệnh quản trị repo cần tiền tố `GH_CONFIG_DIR="$HOME/.config/gh-wedding"`. Credential helper và danh tính tác giả commit được cấu hình tại `.git/config` của repo này, không sửa cấu hình Git toàn cục. Các tệp thông tin đăng nhập không nằm trong dự án.

1. Tạo repository GitHub bằng tài khoản của bạn. Dùng `TEN_TAI_KHOAN.github.io` nếu muốn link gốc, hoặc tên như `thiep-cuoi` nếu muốn link project.
2. Đưa các file vào **gốc repository**, gồm `index.html`, `styles.css`, `styles/`, `js/`, `assets/` và `.nojekyll`. Có thể đưa cả dự án lên để giữ tài liệu/kiểm thử.
3. Mở **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Chọn nhánh chứa mã nguồn (thường `main`) và thư mục **/(root)**, rồi **Save**.
5. Chờ GitHub triển khai. Link sẽ có dạng `https://TEN_TAI_KHOAN.github.io/` hoặc `https://TEN_TAI_KHOAN.github.io/thiep-cuoi/`.
6. Mở link trên điện thoại, kiểm tra nhạc, giờ cưới, bản đồ, ảnh và QR trước khi gửi khách. Nhạc 70 giây đã được cho phép đưa vào Git theo xác nhận của người dùng; hai QR đã được cung cấp và hiển thị đúng tab.

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
- `tests/invitation-update-checks.js`: lời mời trang tiệc, tên khách/tên chung/tên giống HTML, ba mốc 17:00–17:30–18:00, đúng ngày/địa điểm và thứ tự phần, không tràn ở 320–1440px. `tests/green-cream-checks.js`: lời cảm ơn theo mẫu, nền kem/xanh/hoa trắng, độ tương phản chữ và ảnh chụp kiểm tra trực quan.
- `tests/photo-update.test.js` và `tests/photo-update-checks.js`: ảnh chỉnh sửa đúng trang, chân dung không đổi, thứ tự sáu ảnh và xem lớn từng ảnh, hai tab QR/sao chép đúng người nhận (clipboard giả lập, không giao dịch), không tràn 320–1440px.
- `tests/guest-browser-checks.js`: nhập tên/xem trước/tạo link, đổi tên làm mất link cũ, sao chép thành công/thất bại, hai khách đồng thời, dữ liệu giống HTML, tên dài trên mobile, thiệp chung và trang tạo link 320–1440px. `tests/guests.test.js` thuộc `npm test`, kiểm tra mã hóa URL/tên tiếng Việt/giới hạn/đường dẫn project.
- `tests/rsvp.test.js`, `tests/apps-script.test.js`: dữ liệu tham dự/không, số người 1–10, xác nhận thành công/thất bại, timeout, chống công thức Sheets và lỗi ghi. `tests/rsvp-browser-checks.js`: form ngay trong link thiệp tên cũ, thứ tự album → xác nhận → mừng cưới, tự điền tên, dropdown, không có lời nhắn, chờ kết quả trước khi báo lưu, khóa bấm trùng, lỗi và thử lại, form 320–1440px, tương thích trang xác nhận riêng đã công bố.

Khởi động local server trước khi chạy; gọi `browser_run_code_unsafe` với `filename` trỏ đến từng file trong môi trường có Playwright browser tools. Các file này không thuộc `npm test` và dự án không cài Playwright làm dependency.

## Tài sản minh họa

Các SVG trong `assets/` được tạo riêng cho dự án, **không phải ảnh thật của hai bạn**. `assets/music-demo.wav` là giai điệu hộp nhạc ngũ cung nguyên bản dài 19,2 giây, tạo bằng Python chuẩn; có thể tạo lại bằng:

```sh
python3 scripts/generate_music.py
```

Không có thư viện runtime. Các tranh SVG và nhạc demo là tài sản tạo riêng; MP3 Beautiful in White là bản tải bên thứ ba dùng cho chạy thử cục bộ, được ghi nguồn riêng ở trên. Font chữ viết tay **Dancing Script**, tác giả The Dancing Script Project Authors / Impallari Type, được lưu cục bộ nguyên bản tại `assets/fonts/dancing-script.ttf`, hỗ trợ tiếng Việt và không gọi máy chủ Google lúc xem thiệp. Nguồn: <https://github.com/google/fonts/tree/main/ofl/dancingscript>. Font được phân phối theo **SIL Open Font License 1.1**, kèm bản quyền và giấy phép tại `assets/fonts/OFL.txt`; giữ file giấy phép khi xuất bản. Thông tin thiết kế và kế hoạch nằm trong `docs/superpowers/`.
