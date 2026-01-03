"use client"
import { useState } from "react"

export default function Modal({open,onClose,children}){
    return (
        <div onClick={onClose} className={`inset-0 fixed flex items-center justify-center transition-colors ${open ? "visible bg-yellow":"invisible"}`}>

            <div onClick={(e)=>e.stopPropagation()} className={`bg-white transition-all p-40 border-1 border-black rounded-xl shadow-amber-100 ${open?"scale-100 opacity-100":"scale-170 opacity-45"}`}>
                <div onClick={onClose} className="p-1 text-gray-500 bg-white absolute top-2 right-2 hover:bg-gray-100"> X</div>           
                {children}
            </div>
        </div>
    )
}