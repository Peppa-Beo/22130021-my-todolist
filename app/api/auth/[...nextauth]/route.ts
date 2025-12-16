import { handlers } from "../../../../auth"; // Import từ file auth.ts bạn vừa gửi

// Xuất ra 2 hàm GET và POST để xử lý mọi request đăng nhập/đăng xuất
export const { GET, POST } = handlers;