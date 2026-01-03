// "use client"

// import { useState } from "react"


// export default function practice(){
//     const [click,setclick]=useState(false)
//     return (
//         <>
//         <div className="min-w-screen min-h-screen bg-white text-black transition-all transition-color duration-300 flex flex-col items-center justify-center">
//             <div className="flex relative flex-col shadow-2xl rounded-l-lg bg-gradient-to-l from-violet-600 to-fuchsia-400 bg-gradient-to-t from-yellow-300 to-green-500 bg-gradient-to-r from-blue-300 via-purple-400 to-red-800 items-center justify-center h-3/3 w-2/3 border-1 border-yellow-600 p-20 duration-1000">
//                     <button onClick={()=>setclick(!click)} className="w-fit font-extrabold h-fit p-3 border-1 border-black cursor-pointer hover:bg-red-300  rounded-lg bg-red-200"><span className="bg-gradient-to-r from-yellow-500 via-pink-300 to-red-500 bg-clip-text text-transparent">{click?"hide box":"show box"}</span></button>
//             </div>

//             {
//                 click && (
//                     <div className="  duration-500 top-[550px]  flex-col items-center justify-center h-30 w-200 border-1 border-yellow-600 p-20 mt-0">
//                     <button className="w-fit h-fit p-3 border-1 border-black cursor-pointer hover:bg-yellow-800 text-white rounded-lg bg-yellow-600">{click?"show box":"hide box"}</button>
//             </div>
//                 )
                
//             }
//         </div>
//     </>
//     )
// }



//form

// "use client";
// import { useState,useEffect } from "react";


// export default function Practice(){
//     const [form,setform]=useState({name:"",age:"",rollno:"",gender:"",message:""});

//     useEffect(()=>{
//         const savedata=localStorage.getItem('submission');
//         console.log("getItem returned:", savedata);
//         if(savedata){
//             setform(JSON.parse(savedata));
//         }
//     },[])

//     useEffect(()=>{
//         localStorage.setItem("form",JSON.stringify(form))
//     },[form]);


//     function handlechange(e){
//         setform({...form,[e.target.name]:e.target.value})
//     }

//     function handleSubmit(e){
//         e.preventDefault();

//         const oldsubmission=JSON.parse(localStorage.getItem("submission") || "[]");

//         const newsubmission=[...oldsubmission,form];

//         localStorage.setItem("submission",JSON.stringify(newsubmission));
//         alert("form submitted\n" + JSON.stringify(form,null,2));
        
//         setform({
//     name: "",
//     email: "",
//     age: "",
//     gender: "",
//     message: "",
//   });
//     }
//     return (
//         <>
//         <div className="flex flex-col text-black font-sans items-center justify-start  min-h-screen min-w-screen bg-white">
//                 <h1 className="p-5 underline font-bold text-4xl mt-5">Form website</h1>
//                 <div className="w-1/2  p-10 bg-gradient-to-r backdrop-blur-md bg-white/20 rounded-md from-blue-100 via-blue-400 to-blue-600  border border-gray-200 shadow-gray-300 shadow-xl">
//                 <form className="flex flex-col space-y-3 items-start justify-start" onSubmit={handleSubmit}>
                        
//                         <span className=" text-xl font-bold text-blue-800">Name</span>
//                         <input type="text" name="name" value={form.name} onChange={handlechange} placeholder="enter your name" className="shadow-xl max-md:text-xs max-sm:text-md text-black border  border-black shadow-xl  w-2/2 p-2 rounded-lg" required/>

//                          <span className=" text-xl font-bold text-blue-800">Age</span>
//                         <input type="number" name="age" value={form.age} onChange={handlechange} placeholder="enter your age" className="  shadow-xl max-md:text-xs max-sm:text-md text-black border  border-black  w-2/2 p-2 rounded-lg" required/>

//                         <span className=" text-xl font-bold text-blue-800">Email</span>
//                         <input type="email" name="email" value={form.email} onChange={handlechange} placeholder="enter your email" className="  shadow-xl max-md:text-xs max-sm:text-md text-black border  border-black  w-2/2 p-2 rounded-lg" required/>
                        
//                         <span className="max-md:text-xs max-sm:text-md text-xl font-bold text-blue-800">Gender</span>
//                         <select name="gender" value={form.gender} onChange={handlechange} className="text-black border max-md:text-xs max-sm:text-md  border-black p-2 rounded-lg  text-xl text-gray-500  shadow-xl w-2/2">
//                             <option value="">select your gender</option>
//                             <option value="male">male</option>
//                             <option value="female">female</option>
//                         </select>

//                         <span className="max-md:text-xs max-sm:text-md text-xl font-bold text-blue-800">Message</span>
//                         <textarea type="number" name="message" value={form.message} onChange={handlechange} placeholder="enter your message" className="shadow-xl max-md:text-xs max-sm:text-md  text-black border  border-black  w-2/2 p-2 rounded-lg" required/>
                        
//                         <button type="submit" className="cursor-pointer max-md:text-xs max-sm:text-md font-bold hover:bg-blue-800 h-fit w-fit p-2 border border-black bg-blue-700 text-blue-300 rounded-lg">submit</button>
//                 </form>
//                 </div>
//         </div>
//         </>
//     )
// }





//habit streak

"use client";
import { useState,useEffect } from "react";
import {Home} from "lucide-react"
// import AddHabit from "@/Components/addHabit";
import { HubertModel } from "@xenova/transformers";


export default function practice(){
    const [habit,sethabit]=useState([]);

    useEffect(()=>{
        const savedata=localStorage.getItem("habit");

        if(savedata){
            sethabit(JSON.parse(savedata));
        }
    },[])

    useEffect(()=>{
        localStorage.setItem("habit",JSON.stringify(habit));
    },[habit]);


    const addhabitan=(name)=>{
            sethabit([...habit,{id:Date.now(),name,streak:0,lastchanged:null}])
    }

    const completehabit=(id)=>{
       sethabit(habit.map((hab)=>{
        if(id!==hab.id) return hab;

        const today=new Date().toDateString();
        const yesterday=new Date(Date.now()-86400000).toDateString();

        if(hab.lastchanged===today) return hab;

        const newhabit=hab.lastchanged===yesterday?hab.streak+1:1;

        return {
            ...hab,
            streak:newhabit,
            lastchanged:today
        
        }

       }))
    }
    return (
        <>
        <div className="flex flex-col  justify-start min-h-screen min-w-screen items-center bg-white text-black font-sans">
            <div className="flex flex-col bg-[#0F172A] justify-center items-center w-2/3 h-2/6 mb-11 space-y-4 border-1 border-black mt-10 p-50">
                    <strong className="underline text-2xl -mt-80">habit tracker website</strong>
                    <AddHabit addhabitan={addhabitan}/>
                    {
                        habit.map((haber)=>(
                            
                            <div key={haber.id} className="flex flex-row space-x-4 font-serif text-black text-lg">
                                    <span className="font-bold w-40 whitespace-nowrap text-center  bg-yellow-600 p-2 text-white rounded-lg">{haber.name}</span>
                                    <span className="text-white h-fit w-fit p-2 bg-violet-700 rounded-lg">{haber.streak}</span>
                                    <span className="text-white h-fit w-fit p-2 bg-emerald-600 whitespace-nowrap rounded-lg">{haber.lastchanged}</span>
                                    <button onClick={() => completehabit(haber.id)} className="text-white whitespace-nowrap bg-blue-700 w-fit h-fit p-2 cursor-pointer   hover:bg-blue-900 rounded-lg font-bold">Mark done</button>
                            </div>
                            
                        ))
                    }
                    
            </div>
        </div>
        </>
    )
}








