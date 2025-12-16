"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"

export default function SortSelect() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    function handleSort(sortValue: string) {
        const params = new URLSearchParams(searchParams)

        // Lưu kiểu sắp xếp vào URL
        if (sortValue) {
            params.set("sort", sortValue)
        } else {
            params.delete("sort")
        }

        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: "white" }}>Sort by:</span>
            <select
                onChange={(e) => handleSort(e.target.value)}
                defaultValue={searchParams.get("sort")?.toString() || "newest"}
                style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor: "white"
                }}
            >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="deadline">Deadline</option>
            </select>
        </div>
    )
}