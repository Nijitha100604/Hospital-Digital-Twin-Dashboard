import React, { useContext, useState } from 'react'
import { assets } from './../assets/assets';
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { AppContext } from './../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';


function Login() {
    const navigate = useNavigate();

    const {setToken, backendUrl} = useContext(AppContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async(event) =>{

        event.preventDefault();

        try{
            
            const {data} = await axios.post(backendUrl + '/api/login', {email, password});
            if(data.success){
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setEmail('');
                setPassword('');
                navigate('/');
            } else{
                toast.error(data.message);
            }

        } catch(error){
            console.log(error);
            toast.error(error.message);
        }

    }

  return (
    <div className="min-h-screen flex">

    {/* Left login Image */}
    <div className="hidden md:flex w-2/4 items-center justify-center bg-gray-100">
        <img 
            src={assets.login_image} 
            alt="login-image"
            className="w-full h-full object-cover"
        />
    </div>

    {/* Right login details */}
    <div className="w-full md:w-2/4 flex flex-col items-center justify-center bg-fuchsia-950 px-10">

    <div className="text-center">
        <h2 className="text-white text-2xl font-bold mb-2">HOSPITAL DIGITAL TWIN</h2>
        <h2 className="text-white text-2xl font-bold mb-4">DASHBOARD</h2>
    </div>

    <form onSubmit={onSubmitHandler} className="flex flex-col justify-center items-center border border-fuchsia-400 rounded-lg px-5 py-5 w-9/12 max-w-sm shadow-sm shadow-fuchsia-500">
        <h1 className="text-white font-bold text-xl mb-4">LOGIN</h1>
        <div className="flex flex-col gap-4 mb-8 w-full">
            {/* Email Field */}
            <div className="w-full">
                <label className="flex gap-3 items-center mb-2 text-white">
                    <FaEnvelope size={15} />
                    Email
                </label>
                <input 
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-3 rounded-full bg-gray-300 text-sm focus:outline-none"
                />
            </div>

            {/* Password Field */}
            <div className="w-full">
                <label className="flex gap-3 items-center mb-2 text-white">
                    <FaLock size={15} />
                    Password
                </label>
                <input 
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-3 rounded-full bg-gray-300 text-sm focus:outline-none"
                />
            </div>
        </div>
        <button 
        type = "submit"
        className="bg-fuchsia-600 w-full mb-3 border border-fuchsia-700 cursor-pointer text-white font-semibold text-sm px-6 py-2 rounded-lg"
        >
            Login
        </button>
        <p className="text-sm text-center text-gray-300">Login with your hospital email</p>
    </form>

    </div>

    </div>
  )
}

export default Login