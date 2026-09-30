RÀ SOÁT MÃ DANH MỤC - MẪU ĐỘC LẬP CHO VHP
Ngày ghi nhận nguồn mẫu: 30/09/2026

MỞ VÀ DÙNG
1. Mở index.html trong trình duyệt. Không cần cài thư viện, tài khoản hay khóa API.
2. Hai dòng nguồn công khai được nạp sẵn. Công cụ chỉ gắn cờ cùng mã sau chuẩn hóa nhưng khác tên.
3. Dán CSV/TSV hoặc chọn tệp tối đa 2 MB, 2.000 dòng; bấm Rà soát dữ liệu.
4. Bấm Xuất CSV / xem trước để chuẩn bị toàn bộ dòng, mã gốc, mã chuẩn hóa và phân loại. Trình duyệt được yêu cầu tải xuống, đồng thời bản CSV chỉ đọc được mở ngay trên trang.
   Nếu không thấy tệp, bấm Chọn toàn bộ CSV để sao chép rồi dùng Ctrl+C / Command+C hoặc lệnh Sao chép trên điện thoại. Dán vào tệp văn bản UTF-8 có đuôi .csv. Trang không thể xác nhận tệp đã được lưu.
5. Đối chiếu bằng chuyên môn phụ tùng và tài liệu mã trước khi sửa danh mục. Không tự sửa theo kết quả này.

Nếu cần chạy qua HTTP cục bộ, tại thư mục này dùng:
python3 -m http.server 8765
Rồi mở http://localhost:8765. Mở trực tiếp index.html cũng hoạt động.

ĐỊNH DẠNG NHẬP
Cột bắt buộc: name,code
Cột tùy chọn: internal_id,source_url,evidence_date
Ví dụ:
internal_id,name,code,source_url,evidence_date
856,Cụm bướm ga,35100-04200,https://phutungotohp.vn/product/than-buom-ga-kia-morning-2012,2026-09-30
437,Nắp van hằng nhiệt,3510004200,https://phutungotohp.vn/product/nap-van-hang-nhiet-kia-morning,2026-09-30

Chấp nhận dấu phẩy hoặc tab. Ô chứa dấu phẩy hoặc xuống dòng phải nằm trong ngoặc kép; ký tự ngoặc kép trong ô được viết hai lần. Cột không thuộc năm cột được hỗ trợ sẽ không được nhập. Không nên dùng mẫu này như bản sao lưu toàn bộ danh mục.

CÁCH PHÂN LOẠI
- Chuẩn hóa mã bằng Unicode NFKC, chữ hoa và bỏ khoảng trắng/dấu gạch nối. Không bỏ các ký tự khác như dấu gạch chéo; không tra cứu mã tương đương.
- Tên được so sánh không phân biệt hoa/thường và khoảng trắng dư, vẫn giữ dấu tiếng Việt.
- Cùng mã + khác tên: cần đối chiếu, chưa biết đúng/sai.
- Cùng mã + cùng tên: phân loại riêng, giữ nguyên mọi dòng và ID; không kết luận là sản phẩm trùng.
- Một dòng: chưa có đối chiếu; không xác nhận mã đúng.
- Thiếu tên/mã: giữ dòng và báo thiếu, không đưa vào nhóm xung đột tên.
- ID nội bộ không tham gia chuẩn hóa hoặc nhóm mã, không được coi là mã OEM.

NGUỒN VÀ GIỚI HẠN
Hai trang công khai nêu trên được ghi nhận ngày 30/09/2026. Tên ngắn, ID nội bộ và các dạng mã được cung cấp như một ảnh chụp thông tin nguồn để đối chiếu, không tự cập nhật từ website.
Cả hai trang nguồn đều ghi 35100-04200 / 3510004200. Mỗi dòng mẫu chọn một dạng đã xuất hiện trên nguồn để minh họa chuẩn hóa; không ngụ ý hai trang chỉ ghi hai dạng riêng biệt. Hai dạng cùng trở thành 3510004200. Hai tên khác nhau tạo một nhóm cần kiểm tra. Chưa có kết luận mã nào đúng, mã có phải OEM chính thức, hai sản phẩm có tương đương, hoặc có phù hợp với xe.
Không có dữ liệu về đơn hàng, doanh thu, chuyển đổi hoặc thời gian tiết kiệm. Không có ước tính lợi ích tài chính.
Tên khác nhau có thể là cách đặt tên khác cho cùng phụ tùng. Ngược lại, cùng tên không chứng minh cùng phụ tùng. Cần chuyên viên đối chiếu tài liệu và quy ước mã của chủ danh mục.

RIÊNG TƯ VÀ XỬ LÝ AN TOÀN
Không API ngoài, analytics, cookie, localStorage hoặc gửi form. Nội dung nhập chỉ nằm trong bộ nhớ tab. Chỉ khi người dùng bấm mở nguồn thì trình duyệt mới mở website tương ứng; tùy trình duyệt và website, trang nguồn có thể có theo dõi riêng.
Tên/mã hiển thị bằng textContent, không chèn HTML từ dữ liệu. Chỉ tạo liên kết nguồn HTTP/HTTPS không chứa thông tin đăng nhập.
CSV xuất có BOM UTF-8. Ô bắt đầu bằng ký tự có thể tạo công thức bảng tính được thêm dấu nháy đơn để giảm nguy cơ CSV formula injection; đây là biến đổi bảo vệ khi xuất. Nếu nhập lại CSV đã xuất, dấu nháy bảo vệ vẫn là dữ liệu, không tự xóa.
Nếu nhập lỗi, thông báo nói rõ kết quả đang hiển thị vẫn là lần rà soát thành công trước đó. Tệp xuất và bản sao chép dùng đúng một chuỗi CSV từ kết quả đang hiển thị, không dựa trên nội dung chưa rà soát. Bản xem trước được xóa khi có kết quả rà soát mới hoặc khi khôi phục mẫu, để tránh sao chép nhầm kết quả cũ.

KIỂM THỬ
Cần Node.js 18 trở lên để chạy kiểm thử (trình duyệt không cần Node):
node --test checker.test.js

CÁC TỆP
index.html: giao diện tiếng Việt, dùng được trực tiếp hoặc khi host tĩnh.
styles.css: bố cục responsive, không font hoặc tài nguyên ngoài.
checker.js: parser CSV/TSV, chuẩn hóa, phân nhóm, bảo vệ URL và xuất CSV.
app.js: tương tác trang và hiển thị dữ liệu dưới dạng văn bản.
checker.test.js: kiểm thử độc lập bằng Node tiêu chuẩn.
report.txt: ghi chú ngắn có thể đính kèm email sau khi được phép gửi.

Mẫu do Huy chuẩn bị với hỗ trợ AI; không phải sản phẩm hoặc tài liệu chính thức của VHP. Chưa đăng công khai và chưa gửi cho người nhận trong quá trình xây dựng mẫu.
