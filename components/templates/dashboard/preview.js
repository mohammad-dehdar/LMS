"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import "react-quill/dist/quill.bubble.css"

function Preview({value}) {
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), [])
    return (
        <div className="bg-white">
            <ReactQuill
                theme="bubble"
                value={value}
                readOnly
            />
        </div>
    )
}

export default Preview