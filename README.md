# 🌐 [Link-PreView-Web](https://anhtuandev.id.vn/)

**Web-Socket-Social** là một nền tảng mạng xã hội thời gian thực được xây dựng với WebSocket, nơi người dùng có thể nhắn tin, tương tác và cập nhật trạng thái ngay lập tức – không cần F5!

## 🚀 Tính năng nổi bật

- 🔥 **Giao tiếp thời gian thực** – Tin nhắn, phản hồi, và thông báo được cập nhật ngay lập tức nhờ WebSocket.
- 👥 **Phòng chat riêng và nhóm** – Giao tiếp 1-1 hoặc theo nhóm cực kỳ mượt mà.
- 📡 **Trạng thái người dùng** – Ai đang online/offline? Biết liền.
- 📝 **Cập nhật trạng thái** – Chia sẻ cảm xúc, hình ảnh, hay bất cứ điều gì bạn muốn.
- 🔒 **Xác thực người dùng** – Bảo mật bằng JWT hoặc OAuth.
- 📱 **Responsive UI** – Giao diện đẹp, mượt mà trên mọi thiết bị.

## 🧱 Công nghệ sử dụng

- **Backend**: Node.js, Express.js, WebSocket (ws/socket.io)
- **Frontend**: React / NextJs
- **Database**: MongoDB 
- **Auth**: JWT 
- **Realtime Layer**: Socket.IO / ws / WebSocket API

### 🚀 Work Follow Chat Online
![image](https://github.com/user-attachments/assets/879c3c09-2557-4e51-a606-16a67776ca80)


setup cho dự án :
Frontend: Deploy trên Vercel
Tích hợp tốt với Next.js
Dễ dàng setup và maintain
Có CI/CD tự động
Backend: Deploy trên Render
Hỗ trợ WebSocket tốt
Dễ dàng kết nối với MongoDB
Có SSL miễn phí
Database: Sử dụng MongoDB Atlas
Ổn định và đáng tin cậy
Dễ dàng backup và restore
Có monitoring tools
WebSocket: Có 2 lựa chọn:
Sử dụng WebSocket trực tiếp từ backend (nếu deploy trên Render)

##Cơ chế
Tạo tin nhắn tạm thời ngay khi người dùng gửi:
Tạo một tempMessage với đầy đủ thông tin (ID, nội dung, người gửi, người nhận, thời gian)
Sử dụng timestamp làm ID tạm thời
Thêm thông tin người gửi và người nhận từ state hiện tại
Cập nhật state ngay lập tức:
Thêm tin nhắn vào messages state để hiển thị ngay
Cập nhật chats state để hiển thị tin nhắn mới nhất trong danh sách chat
Gửi tin nhắn qua WebSocket:
Sau khi cập nhật UI, gửi tin nhắn qua WebSocket
Nếu có lỗi, có thể thêm logic để xóa tin nhắn tạm thời
Thêm kiểm tra user:
Kiểm tra user tồn tại trước khi gửi tin nhắn
Thêm user vào dependencies của useCallback
Cách này sẽ giúp:
Tin nhắn hiển thị ngay lập tức khi gửi
Người dùng thấy được tin nhắn của mình ngay lập tức
Vẫn đảm bảo tin nhắn được gửi qua WebSocket
Có thể xử lý lỗi nếu gửi thất bại
