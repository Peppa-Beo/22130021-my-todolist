"use server"

import { prisma } from "../lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "../auth"
import { signIn } from "../auth"
import { AuthError } from "next-auth"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function addTodo(formData: FormData) {
    "use server"
    const session = await auth()
    if (!session?.user?.id) {
        return;
    }
    const title = formData.get("title") as string
    const color = formData.get("color") as string
    const dueDateVal = formData.get("dueDate") as string // Lấy ngày

    if (!title) return

    await prisma.todo.create({
        data: {
            title,
            userId: session.user.id,
            color: color || "#000000",
            dueDate: dueDateVal ? new Date(dueDateVal) : null, // Lưu ngày
        },
    })

    revalidatePath("/")
}

// 2. Hàm Xóa
export async function deleteTodo(id: string) {
    const session = await auth()
    if (!session?.user) return

    await prisma.todo.delete({
        where: { id },
    })

    revalidatePath("/")
}

// 3. Hàm Toggle (Check/Uncheck)
export async function toggleTodo(id: string, completed: boolean) {
    const session = await auth()
    if (!session?.user) return

    await prisma.todo.update({
        where: { id },
        data: {
            completed,
            completedAt: completed ? new Date() : null
        },
    })
    revalidatePath("/")
}

// 4. Hàm Update (Sửa tên)
export async function updateTodo(id: string, newTitle: string) {
    const session = await auth()
    if (!session?.user) return

    if (!id || !newTitle) return

    await prisma.todo.update({
        where: { id },
        data: { title: newTitle },
    })

    revalidatePath("/")
}

export async function authenticate(formData: FormData) {
    "use server"
    try {
        await signIn("credentials", formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CallbackRouteError":
                case "CredentialsSignin":
                    redirect("/login?error=invalid_credentials")
                default:
                    redirect("/login?error=system_error")
            }
        }
        throw error
    }
}

export async function register(formData: FormData) {
    "use server"

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password || !name) {
        // Xử lý lỗi đơn giản (trong thực tế nên trả về thông báo lỗi cho UI)
        console.error("Missing fields")
        return
    }

    // 1. Kiểm tra xem email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        console.error("Email already exists")
        return // Dừng lại nếu email đã có
    }

    // 2. Mã hóa mật khẩu (Quan trọng!)
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Tạo user mới trong Database
    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    })

    // 4. Đăng ký xong thì đá về trang đăng nhập
    redirect("/login")
}