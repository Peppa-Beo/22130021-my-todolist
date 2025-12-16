import { auth, signOut } from "../auth"
import { prisma } from "../lib/prisma"
import { addTodo, deleteTodo } from "./action"
import { redirect } from "next/navigation"
import TodoItem from "./todo-item"
import Link from "next/link"
import Search from "./search"
import SortSelect from "./sort-select"

export default async function Home(props: {
    searchParams: Promise<{ filter?: string; search?: string; sort?: string }>
}) {
    const session = await auth()
    if (!session?.user) redirect("/login")

    // 1. Lấy filter từ URL
    const searchParams = await props.searchParams;
    const filter = searchParams?.filter || "all";
    const search = searchParams?.search || "";
    const sort = searchParams?.sort || "newest";

    // 2. Tạo điều kiện lọc cho Prisma
    let whereCondition: any = { userId: session.user.id }

    if (filter === "active") {
        whereCondition.completed = false
    } else if (filter === "completed") {
        whereCondition.completed = true
    }
    if (search) {
        whereCondition.title = {
            contains: search,
        }
    }

    let todos;
    if (sort === "deadline") {
        // 1. Lấy những việc CÓ ngày (Sắp xếp ngày gần nhất lên trước)
        const withDate = await prisma.todo.findMany({
            where: { ...whereCondition, dueDate: { not: null } },
            orderBy: { dueDate: 'asc' },
        })

        // 2. Lấy những việc KHÔNG có ngày
        const withoutDate = await prisma.todo.findMany({
            where: { ...whereCondition, dueDate: null },
            orderBy: { createdAt: 'desc' }, // Những cái không ngày thì cái nào mới tạo lên trước
        })

        // 3. Ghép lại: Có ngày trước, không ngày sau
        todos = [...withDate, ...withoutDate]
    }
    else {
        let orderByCondition: any = { createdAt: 'desc' }
        if (sort === "oldest") {
            orderByCondition = { createdAt: 'asc' }
        }
        todos = await prisma.todo.findMany({
            where: whereCondition,
            orderBy: orderByCondition,
        })
    }

    const getFilterUrl = (newFilter: string) => {
        const params = new URLSearchParams();

        // 1. Giữ lại filter mới chọn (trừ khi là 'all')
        if (newFilter !== "all") params.set("filter", newFilter);

        // 2. Giữ lại Search (nếu có)
        if (search) params.set("search", search);

        // 3. Giữ lại Sort (nếu có)
        if (sort && sort !== "newest") params.set("sort", sort);

        return `/?${params.toString()}`;
    };

    return (
        <div style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#9d9580ff",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0), 0 8px 10px -6px rgba(0, 0, 0)"
        }}>

            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h1 style={{
                    fontSize: "2rem", color: "white", margin: 0
                }}>
                    {/* Nếu có tên thì hiện "Tên's Tasks", nếu không thì hiện "My Tasks" */}
                    📒 {session?.user?.name ? `${session.user.name}'s` : "My"} Tasks
                </h1>
                <form action={async () => { "use server"; await import("../auth").then(m => m.signOut()) }}>
                    <button style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontWeight: "bold", color: "#374151" }}>
                        Sign Out
                    </button>
                </form>
            </div>

            {/* SEARCH BAR (Bo tròn, hiện đại) */}
            <div style={{ marginBottom: "20px" }}>
                <Search />
            </div>

            {/* FORM THÊM VIỆC (Đã có sẵn style từ bài trước, giữ nguyên hoặc tinh chỉnh nhẹ) */}
            <form action={addTodo} style={{ marginBottom: "25px", background: "#f9fafb", padding: "20px", borderRadius: "16px", border: "1px solid #f3f4f6" }}>
                {/* ... (Copy lại nội dung Form của bạn vào đây) ... */}
                {/* Mẹo: Bạn có thể copy lại y nguyên cái form cũ, chỉ cần đặt nó vào cái khung style mới này là đẹp */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                    <input name="title" type="text" placeholder="Add a new task..." required style={{ flex: 1, padding: "12px", border: "1px solid #e5e7eb", borderRadius: "10px", outline: "none", fontSize: "1rem" }} />
                    <button type="submit" style={{ padding: "0 25px", backgroundColor: "#9d9580ff", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>Add</button>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", padding: "5px 10px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                        <span style={{ fontSize: "0.85rem", color: "gray" }}>📅 Due:</span>
                        <input name="dueDate" type="date" style={{ border: "none", outline: "none", color: "#374151", cursor: "pointer" }} />
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <label style={{ cursor: "pointer" }}><input type="radio" name="color" value="#000000" defaultChecked /> ⚫Normal</label>
                        <label style={{ cursor: "pointer" }}><input type="radio" name="color" value="#ef4444" /> 🔴Urgent</label>
                        <label style={{ cursor: "pointer" }}><input type="radio" name="color" value="#3b82f6" /> 🔵Personal</label>
                    </div>
                </div>
            </form>

            {/* TOOLBAR: Filter & Sort (Làm thành dạng Tabs đẹp mắt) */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", gap: "5px", background: "#f3f4f6", padding: "4px", borderRadius: "10px" }}>
                    {["all", "active", "completed"].map((f) => (
                        <Link
                            key={f}
                            href={getFilterUrl(f)}
                            style={{
                                padding: "6px 12px",
                                borderRadius: "8px",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                                textDecoration: "none",
                                color: filter === f ? "white" : "#6b7280",
                                backgroundColor: filter === f ? "#9d9580ff" : "transparent",
                                transition: "all 0.2s"
                            }}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Link>
                    ))}
                </div>
                <SortSelect />
            </div>

            {/* LIST */}
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {todos.map((todo, index) => (
                    <TodoItem key={todo.id} todo={todo} index={index + 1} />
                ))}
                {todos.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "white" }}>
                        <p style={{ fontSize: "3rem", margin: 0 }}>☕</p>
                        <p>No tasks found. Enjoy your day!</p>
                    </div>
                )}
            </ul>
        </div >
    )
}