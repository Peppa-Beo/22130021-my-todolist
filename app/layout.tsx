import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 👈 Import font Inter


const inter = Inter({ subsets: ["latin"] }); // 👈 Khởi tạo font

export const metadata: Metadata = {
    title: "To-Do List",
    description: "Made by Peppa Beo",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={inter.className}
                style={{
                    margin: 0,
                    padding: "20px",
                    minHeight: "100vh", // Đảm bảo nền bao phủ toàn màn hình
                    backgroundImage: 'url("/bg.jpg")',
                    backgroundSize: "cover",      // Co dãn ảnh vừa khít màn hình
                    backgroundPosition: "center", // Căn giữa ảnh
                    backgroundRepeat: "no-repeat",// Không lặp lại ảnh
                    backgroundAttachment: "fixed" // Giữ nguyên ảnh khi cuộn chuột (hiệu ứng Parallax xịn xò)
                }}
            >
                {children}
            </body>
        </html>
    );
}