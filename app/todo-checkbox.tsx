"use client"

import { toggleTodo } from "./action"
import { useTransition } from "react"

export default function TodoCheckbox({ id, completed }: { id: string, completed: boolean }) {
    const [isPending, startTransition] = useTransition()

    return (
        <input
            type="checkbox"
            defaultChecked={completed}
            disabled={isPending}
            onChange={() => {
                startTransition(() => {
                    toggleTodo(id, !completed)
                })
            }}
            style={{
                cursor: "pointer",
                width: "18px",
                height: "18px",
                marginRight: "10px",
                opacity: isPending ? 0.5 : 1
            }}
        />
    )
}