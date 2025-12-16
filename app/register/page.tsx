import { register } from "../action"; // Import hàm vừa tạo
import Link from "next/link"; // Dùng để chuyển trang

export default function RegisterPage() {
    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "#f3f4f6", padding: "20px",
            backgroundImage: 'url("/bg.jpg")', backgroundSize: "cover"
        }}>

            <div style={{
                width: "100%", maxWidth: "400px", backgroundColor: "white", padding: "40px",
                borderRadius: "24px", boxShadow: "0 10px 25px rgba(0,0,0)", textAlign: "center"
            }}>

                <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#8b8370ff", marginBottom: "5px" }}>Create Account</h1>
                <p style={{ color: "#6b7280", marginBottom: "25px", fontSize: "0.9rem" }}>Join us to manage your tasks!</p>

                {/* FORM ĐĂNG KÝ */}
                <form action={register} style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}>
                    <input
                        name="name" type="text" placeholder="Username" required
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "1rem", outline: "none" }}
                    />
                    <input
                        name="email" type="email" placeholder="Email address" required
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "1rem", outline: "none" }}
                    />
                    <input
                        name="password" type="password" placeholder="Password" required minLength={6}
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "1rem", outline: "none" }}
                    />
                    <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#8b8370ff", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" }}>
                        Sign Up
                    </button>
                </form>

                {/* Link quay lại đăng nhập */}
                <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                        Login here
                    </Link>
                </p>

            </div>
        </div>
    );
}