import { auth, signIn } from "../../auth";
import { authenticate } from "../action";
import { redirect } from "next/navigation";

export default async function LoginPage(props: {
    searchParams: Promise<{ error?: string }>
}) {
    const searchParams = await props.searchParams;
    const errorType = searchParams.error;
    const session = await auth();
    if (session?.user) redirect("/");

    return (
        <div style={{
            minHeight: "100vh", display: "flex",
            alignItems: "center", justifyContent: "center",
            padding: "20px",
        }}>

            <div style={{
                width: "100%", maxWidth: "400px", backgroundColor: "white", padding: "40px",
                borderRadius: "24px", boxShadow: "0 10px 25px rgba(0,0,0)", textAlign: "center"
            }}>

                <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#8b8370ff", marginBottom: "5px" }}>Welcome!</h1>
                <p style={{ color: "#6b7280", marginBottom: "25px", fontSize: "0.9rem" }}>Login with Email or Google</p>
                {errorType === "invalid_credentials" && (
                    <div style={{
                        backgroundColor: "#fef2f2", color: "#b91c1c", padding: "12px",
                        borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem",
                        border: "1px solid #fca5a5", display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                        ⚠️ Tài khoản hoặc mật khẩu không chính xác!
                    </div>
                )}

                {errorType === "system_error" && (
                    <div style={{
                        backgroundColor: "#fffbeb", color: "#92400e", padding: "12px",
                        borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem",
                        border: "1px solid #fcd34d"
                    }}>
                        ⚠️ Lỗi hệ thống, vui lòng thử lại sau.
                    </div>
                )}

                {/* 1. FORM EMAIL/PASSWORD */}
                <form
                    action={async (formData) => {
                        "use server"
                        await authenticate(formData)
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}
                >
                    <input
                        name="email" type="email" placeholder="Email address" required
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "1rem", outline: "none", boxSizing: "border-box" }}
                    />
                    <input
                        name="password" type="password" placeholder="Password" required
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "1rem", outline: "none", boxSizing: "border-box" }}
                    />
                    <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#9d9580ff", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" }}>
                        Sign In
                    </button>
                </form>

                {/* ĐƯỜNG KẺ NGĂN CÁCH (OR) */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px 0" }}>
                    <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }}></div>
                    <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>OR</span>
                    <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }}></div>
                </div>

                {/* 2. NÚT GOOGLE */}
                <form action={async () => { "use server"; await signIn("google"); }}>
                    <button type="submit" style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                        padding: "12px", backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px",
                        fontSize: "1rem", fontWeight: "500", color: "#374151", cursor: "pointer"
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M23.52 12.29C23.52 11.44 23.44 10.62 23.3 9.82H12V14.5H18.48C18.2 16.01 17.34 17.3 16.06 18.16V21.2H19.92C22.18 19.12 23.52 16.06 23.52 12.29Z" fill="#4285F4" /><path d="M12 24C15.24 24 17.96 22.92 19.92 21.2L16.06 18.16C14.98 18.88 13.62 19.32 12 19.32C8.86 19.32 6.2 17.2 5.26 14.44H1.3V17.5C3.26 21.4 7.32 24 12 24Z" fill="#34A853" /><path d="M5.26 14.44C5.02 13.72 4.88 12.96 4.88 12.2C4.88 11.44 5.02 10.68 5.26 9.96V6.9H1.3C0.46 8.54 0 10.34 0 12.2C0 14.06 0.46 15.86 1.3 17.5L5.26 14.44Z" fill="#FBBC05" /><path d="M12 5.08C13.76 5.08 15.34 5.68 16.58 6.84L20.02 3.4C17.96 1.48 15.24 0 12 0C7.32 0 3.26 2.6 1.3 6.5L5.26 9.56C6.2 6.8 8.86 5.08 12 5.08Z" fill="#EA4335" /></svg>
                        Continue with Google
                    </button>
                </form>
                <p style={{ marginTop: "25px", fontSize: "0.9rem", color: "#6b7280" }}>
                    Don't have an account?{" "}
                    <a href="/register" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}