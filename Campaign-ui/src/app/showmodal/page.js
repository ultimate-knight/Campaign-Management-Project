"use client"
import { useState } from "react"
import Modal from "@/Components/Modal";



export default function showmodal(){
    const [open,setopen]=useState(false);
    return (
        <div>
                <button className="w-fit p-1 shadow-2xl cursor-pointer bg-red-600 hover:bg-red-700 border-1 border-gray-300" onClick={()=>setopen(true)}>open</button>
                <Modal open={open} onClose={()=>setopen(false)}>
                    <h1 className="text-black border-1 bg-amber-500 border-red-400 w-fit p-2">would u like to delete this modal</h1>
                    <div className="flex flex-row space-x-4 mt-5 ml-7">
                        <button className="w-fit p-1 cursor-pointer bg-red-600 hover:bg-red-700 border-1 border-gray-300" onClick={()=>setopen(false)}>delete</button>
                        <button className="w-fit p-1 cursor-pointer bg-red-200 hover:bg-red-300 border-1 border-gray-300" onClick={()=>setopen(false)}>cancel</button>
                    </div>
            </Modal>
        </div>
    )
}