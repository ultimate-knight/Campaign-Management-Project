
"use client";
import { useState } from "react";

export default function AddHabit({ addhabitan }) {
    const [text, settext] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        addhabitan(text);
        settext("");
    }

    return (
        <div className="text-black">
            <div className="w-2/3 h-2/3 p-30 rounded-md">
            <h1 className="underline font-bold font-sans  text-xl text-white">Habit Tracker</h1>
                <form onSubmit={handleSubmit} className="flex flex-row mt-4 space-x-4">
                    <input
                        type="text"
                        placeholder="enter ur habit"
                        value={text}
                        onChange={(e) => settext(e.target.value)}
                        className="h-fit w-fit p-2 border font-bold border-gray-600 rounded-lg text-white"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-red-700 text-white font-bold hover:bg-red-800 whitespace-nowrap  rounded-lg p-2 w-fit h-fit"
                    >
                        Add habit
                    </button>
                </form>
            </div>
        </div>
    );
}
