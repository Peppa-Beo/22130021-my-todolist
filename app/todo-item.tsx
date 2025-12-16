"use client"

import { useState, useTransition } from "react"
import { toggleTodo, deleteTodo, updateTodo } from "./action" // Import các hành động từ server

type TodoProps = {
    id: string
    title: string
    completed: boolean
    color: string | null
    dueDate: Date | null
    completedAt: Date | null
}

export default function TodoItem({ todo, index }: { todo: TodoProps, index: number }) {
    const [isPending, startTransition] = useTransition()
    const [isEditing, setIsEditing] = useState(false) // Trạng thái: đang sửa hay không?
    const [newTitle, setNewTitle] = useState(todo.title) // Lưu nội dung đang sửa

    // Xử lý lưu khi bấm Save hoặc Enter
    const handleSave = () => {
        if (newTitle.trim() === "") return // Không lưu nếu rỗng
        startTransition(() => {
            updateTodo(todo.id, newTitle)
            setIsEditing(false) // Tắt chế độ sửa
        })
    }

    // Xử lý phím tắt (Enter để lưu, Esc để hủy)
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSave()
        if (e.key === "Escape") {
            setNewTitle(todo.title) // Reset lại tên cũ
            setIsEditing(false)
        }
    }

    return (
        <li
            style={{
                display: "flex",
                alignItems: "center",
                padding: "16px",
                background: "white",
                borderRadius: "12px",
                // Viền trái màu sắc
                borderLeft: `6px solid ${todo.color || "black"}`,
                // Đổ bóng nhẹ
                boxShadow: "0 2px 5px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.03)",
                gap: "15px",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                opacity: todo.completed ? 0.6 : 1, // Làm mờ nếu đã xong
            }}
            // Hiệu ứng hover (cần chuyển sang CSS class hoặc style inline trick, ở đây dùng inline đơn giản)
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 15px rgba(0,0,0,0.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.03)"; }}
        >

            {/* CHECKBOX (To hơn chút) */}
            <input
                type="checkbox"
                defaultChecked={todo.completed}
                onChange={() => startTransition(() => toggleTodo(todo.id, !todo.completed))}
                style={{ width: "22px", height: "22px", cursor: "pointer", accentColor: "black" }}
                disabled={isPending}
            />

            {/* CONTENT */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", cursor: "pointer" }} onClick={() => setIsEditing(true)}>
                {isEditing ? (
                    <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
                    />
                ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ fontSize: "0.9rem", color: "#9ca3af", fontWeight: "bold", marginRight: "10px", minWidth: "25px" }}>
                            #{index}
                        </span>
                        <span style={{
                            fontSize: "1.05rem",
                            fontWeight: "500",
                            textDecoration: todo.completed ? "line-through" : "none",
                            color: todo.completed ? "#9ca3af" : "#1f2937"
                        }}>
                            {todo.title}
                        </span>
                    </div>
                )}

                {/* META INFO (Badge & Date) */}
                {!isEditing && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", fontSize: "0.8rem" }}>
                        <span style={{
                            padding: "2px 8px",
                            borderRadius: "6px",
                            backgroundColor: todo.completed ? "#dcfce7" : "#ffedd5",
                            color: todo.completed ? "#166534" : "#9a3412",
                            fontWeight: "700",
                        }}>
                            {todo.completed ? "DONE" : "PENDING"}
                        </span>

                        {todo.dueDate && (
                            <span style={{ color: "#6b7280", display: "flex", alignItems: "center", gap: "4px", background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>
                                📅 {new Date(todo.dueDate).toLocaleDateString("vi-VN")}
                            </span>
                        )}
                        {todo.completed && todo.completedAt && (
                            <span style={{ color: "#6b7280", fontStyle: "italic" }}>
                                (Finished: {new Date(todo.completedAt).toLocaleDateString("vi-VN")})
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* ACTION BUTTONS (Icons) */}
            <div style={{ display: "flex", gap: "5px" }}>
                {isEditing ? (
                    <button onClick={handleSave} style={{ background: "#22c55e", color: "white", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}>Save</button>
                ) : (
                    <button onClick={() => setIsEditing(true)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", opacity: 0.5 }}>✏️</button>
                )}
                <button
                    onClick={() => startTransition(() => deleteTodo(todo.id))}
                    style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", opacity: 0.5 }}
                >
                    🗑️
                </button>
            </div>

        </li>
    )
}