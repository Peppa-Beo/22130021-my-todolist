"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"

export default function Search() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    // Hàm xử lý khi gõ phím
    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams)

        // Nếu có chữ thì thêm ?search=..., không có thì xóa đi
        if (term) {
            params.set("search", term)
        } else {
            params.delete("search")
        }

        // Cập nhật URL mà không reload trang
        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div style={{ marginBottom: "20px" }}>
            <input
                type="text"
                placeholder="🔍 Search tasks..."
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("search")?.toString()}
                style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem"
                }}
            />
        </div>
    )
}