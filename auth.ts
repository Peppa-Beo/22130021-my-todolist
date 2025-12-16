import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        // 1. Google Provider (Giữ nguyên)
        Google,

        // 2. Credentials Provider (Mới)
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            // Hàm này chạy khi người dùng bấm Login
            authorize: async (credentials) => {
                const email = credentials.email as string
                const password = credentials.password as string

                if (!email || !password) return null

                // Tìm user trong DB
                const user = await prisma.user.findUnique({
                    where: { email }
                })

                // Nếu không có user hoặc user đó không có mật khẩu (do đăng ký bằng Google)
                if (!user || !user.password) {
                    throw new Error("User not found or password incorrect")
                }

                // So sánh mật khẩu
                const isMatch = await bcrypt.compare(password, user.password)

                if (!isMatch) {
                    throw new Error("Password incorrect")
                }

                // Trả về user nếu đúng
                return user
            }
        })
    ],
    callbacks: {
        // 1. Khi đăng nhập thành công, lưu ID vào Token
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        // 2. Khi mỗi lần lấy Session, lấy ID từ Token gắn vào Session
        session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
})
