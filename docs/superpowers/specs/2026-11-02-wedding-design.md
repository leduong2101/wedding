# Thiệp cưới Vũ Thùy Linh & Lê Tuấn Dương

## Mục tiêu

Website thiệp cưới tiếng Việt để gửi khách qua đường link, ưu tiên điện thoại và triển khai miễn phí trên GitHub Pages. Phong cách đỏ truyền thống, vàng kim, họa tiết song hỷ; trang nhã, dễ đọc, chuyển động nhẹ. Không có RSVP, sổ lời chúc, backend hay theo dõi người dùng trong phiên bản đầu.

## Nội dung đã xác nhận

- Cô dâu: Vũ Thùy Linh. Bố: Vũ Trung Nghĩa. Mẹ: Nghiêm Thị Vượng.
- Chú rể: Lê Tuấn Dương. Bố: Lê Văn Hán. Mẹ: Đỗ Thị Thanh.
- Một tiệc chung lúc 17:00 ngày 29/11/2026, múi giờ Việt Nam.
- Địa điểm: Queen Bee Luxury (chuẩn hóa theo tên trong liên kết Maps đã được duyệt).
- Địa chỉ: 20 Láng Hạ, phường Láng, Hà Nội.
- Google Maps: https://www.google.com/maps/place/Queen+Bee+Luxury/@21.0159815,105.8142402,18.82z/data=!4m6!3m5!1s0x3135ab63791d9ee5:0x9e6cca93a08ef5c!8m2!3d21.0162328!4d105.8144029!16s%2Fg%2F11cmpb3fnn?hl=vi
- Ảnh thật, nhạc thật và QR sẽ được cung cấp sau. Không tự suy đoán giờ đón khách, ngày âm lịch hay số tài khoản.

## Bố cục và tương tác

1. Bìa đỏ–vàng có song hỷ, tên hai bạn, ngày cưới, nút “Mở thiệp”. Nội dung chính vẫn đọc được nếu JavaScript bị tắt; chỉ bật màn mở thiệp khi JavaScript hoạt động.
2. Lời mời trang trọng với tên bố mẹ hai bên, không tự thêm địa chỉ gia đình hoặc thứ bậc con cái.
3. Thông tin tiệc chung với ngày giờ, địa điểm và liên kết Maps mở tab mới an toàn.
4. Đếm ngược đến `2026-11-29T17:00:00+07:00`, không phụ thuộc múi giờ thiết bị. Khi đến hạn, dừng ở lời chúc, không hiển thị số âm. Khi khách quay lại tab, tính lại từ thời gian hiện tại.
5. Album ảnh minh họa, ghi rõ ảnh chưa phải ảnh hai bạn. Dùng tài sản cục bộ tự tạo để tránh hotlink và quyền sử dụng không rõ ràng. Cho phép xem ảnh lớn bằng hộp thoại hỗ trợ bàn phím nếu triển khai.
6. Mừng cưới: hai mục riêng “Cô dâu” và “Chú rể”. Khi chưa có dữ liệu, hiển thị “QR sẽ được cập nhật”, tuyệt đối không có QR giả, tài khoản giả hoặc nút sao chép không hoạt động. Khi được cung cấp, hiển thị QR thật và thông tin chủ tài khoản; chỉ cho sao chép nếu có số tài khoản.
7. Lời cảm ơn.

## Âm thanh

Nhạc chỉ bắt đầu trong thao tác bấm “Mở thiệp”, phát lặp, có nút bật/tắt với nhãn truy cập rõ ràng. Có thể tạo giai điệu minh họa nguyên bản tại máy bằng Web Audio, không tải nhạc không rõ bản quyền. Sau này cấu hình đường dẫn file nhạc cục bộ để thay thế. Lỗi phát nhạc không chặn mở thiệp; trạng thái nút phải phản ánh thực tế và cho thử lại. Không cam kết phát khi khóa màn hình hoặc chuyển ứng dụng.

Người dùng chọn **Beautiful in White** làm nhạc thật; đang chờ người dùng cung cấp file MP3/M4A có quyền sử dụng và bản thu mong muốn. Cho đến khi có file, giữ nhạc minh họa và nhãn minh họa hiện tại; không ghi là đang phát bài thật khi chưa có tài sản.

## Kiến trúc

HTML/CSS/JavaScript thuần, không framework và không cần bước build để xuất bản. Dữ liệu tên, bố mẹ, sự kiện, ảnh, nhạc, quà cưới nằm trong một mô-đun cấu hình riêng; tách phần tính đếm ngược, điều khiển âm thanh và khởi tạo giao diện. Tất cả đường dẫn tài sản tương đối, hoạt động dưới cả domain gốc và thư mục project của GitHub Pages. Không lưu bí mật trong mã nguồn.

## Chất lượng và khả năng tiếp cận

- Không cuộn ngang từ chiều rộng 320px; bố cục phù hợp desktop.
- Nội dung tiếng Việt có dấu; font dự phòng không cần dịch vụ font bên ngoài.
- Nút và liên kết dùng được bằng bàn phím; trạng thái focus rõ; tôn trọng prefers-reduced-motion.
- Ảnh có alt phù hợp; không đọc đếm ngược mỗi giây qua trình đọc màn hình.
- Tải album chậm (lazy loading), khai báo kích thước ảnh; không để tài sản ngoài quyết định việc đọc thông tin cưới.

## Kiểm chứng và triển khai

Kiểm thử tính đếm ngược trước/đúng/sau thời điểm cưới, cấu hình nội dung, trạng thái QR chưa có dữ liệu. Kiểm tra trình duyệt desktop/mobile: mở thiệp, phát/tắt nhạc, điều hướng bàn phím, Maps, không tràn ngang, không lỗi console; kiểm tra triển khai ở đường dẫn thư mục con. Tài liệu hướng dẫn chạy local, thay tài sản và bật GitHub Pages. Việc tạo repository, commit hay xuất bản công khai chỉ thực hiện khi người dùng yêu cầu và có quyền truy cập phù hợp.

## Điều chỉnh thẩm mỹ đã duyệt — 02/11/2026

Sau khi xem bản đầu, người dùng yêu cầu mềm mại hơn và duyệt hướng chỉnh: nền kem chủ đạo, đỏ trầu điểm nhấn; tên dùng chữ viết tay hỗ trợ tiếng Việt; bỏ nhãn số thứ tự của các phần và giảm chữ in hoa/giãn chữ; giảm viền vuông, dùng vòm và góc cong; hoa nét mảnh, chuyển nền phớt hồng. Giữ nguyên nội dung và chức năng.

Mở thiệp có chuyển cảnh mờ nhẹ khoảng 850ms, phát nhạc ngay trong thao tác bấm. Kết thúc chuyển cảnh trả focus vào nội dung. Một số cụm nội dung xuất hiện nhẹ khi cuộn, chỉ khi trình duyệt hỗ trợ; không làm mất nội dung với JavaScript tắt hoặc prefers-reduced-motion. Font Dancing Script nguyên bản được phục vụ cục bộ kèm giấy phép OFL 1.1, không phụ thuộc Google Fonts lúc truy cập. Bố cục vẫn không tràn ngang ở 320px.

## Bố cục theo mẫu Toàn–Loan — được duyệt và yêu cầu thực hiện

Tham khảo trực quan https://sleepifoxx.github.io/toan-loan-wedding/, tự xây dựng lại giao diện; không sao chép ảnh, QR hay mã nguồn mẫu. Điều chỉnh này thay bố cục trước, giữ nội dung cưới thật:

1. Phong bì kem có dấu sáp đỏ, bấm để mở nắp/lấy thiệp và phát nhạc; chuyển cảnh tổng cộng khoảng 1,6 giây, bỏ chuyển động khi prefers-reduced-motion.
2. Ảnh phủ màn hình đầu, tên hai bạn viết tay đặt trên ảnh; không còn thanh menu.
3. Lời ngỏ và đếm ngược trước phần giới thiệu gia đình.
4. Chân dung tròn cho hai bạn, tên bố mẹ, ảnh đôi lớn; tất cả hiện là minh họa và ghi chú rõ.
5. Một tiệc chung trên nền tối, 17:00 ngày 29/11/2026, Queen Bee Luxury, Maps đã duyệt.
6. Album dạng lưới, phóng lớn bằng hộp thoại như trước.
7. Hai tab mừng cưới Chú rể / Cô dâu, mặc định Chú rể; hỗ trợ chuột, phím trái/phải/Home/End và đúng trạng thái ARIA. Khi không JavaScript, ẩn các nút tab và hiện cả hai mục. QR chưa có vẫn chỉ hiện thông báo chờ.
8. Lời cảm ơn nền tối, hoa rơi thưa trang trí không nhận tương tác; tắt hoa rơi khi giảm chuyển động.

Stylesheet hiện tại `styles/invitation.css` thay hai stylesheet cũ, giữ file cũ chưa dùng để không hủy các phiên bản trước. Bổ sung các trường ảnh riêng cho bìa, chân dung, ảnh đôi và ảnh sự kiện trong cấu hình.

Người dùng đã yêu cầu tự tìm/tải MP3 và tiếp tục gắn vào bản chạy thử: file bên thứ ba từ Internet Archive đã được sao chép sang `assets/beautiful-in-white.mp3`, phát lặp sau khi mở thiệp. Tên bài dựa trên metadata, chưa xác minh phát hành chính thức hay quyền công khai. Chỉ chạy local; Git-ignore MP3 để tránh vô tình đăng công khai và ghi rõ bước cung cấp file có quyền sử dụng hoặc chuyển về nhạc demo trước khi triển khai. Chưa có repository hoặc website công khai.

Điều chỉnh âm thanh đã duyệt tiếp theo: chỉ phát **00:00–01:07 (67 giây đầu)**, tạo file riêng `assets/beautiful-in-white-67s.mp3` và giữ nguyên file đầy đủ. Cấu hình dùng bản cắt, tiếp tục phát lặp sau khi mở thiệp. Không thay đổi tốc độ hay thêm fade. Cả hai bản nhạc tiếp tục được Git-ignore, chưa xuất bản công khai.
