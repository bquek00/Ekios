'use client'

import React from 'react'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'
// import { login } from './action'

const LoginPage = () => {
    const [credentials, setCredentials] = useState({email: '', password: ''});
    const router = useRouter();

    const login = async function (credentials) {
        const supabase = createClient()
    
        // type-casting here for convenience
        // in practice, you should validate your inputs
        const data = {
            email: credentials.email,
            password: credentials.password,
        }
    
        const { error } = await supabase.auth.signInWithPassword(data)
    
        console.log("error")
        console.log(error)
    
        if (error) {
            console.log("error in logging in")
            router.push('/error')
        }
    
        console.log("login successful")
        router.push('/dashboard')
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="mb-8">
            <Image
                src="/images/ekios.png"
                width={200}
                height={200}
                alt="echios"
            />
        </div>
        <div className="bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-md">
            <div className="mb-4">
                <label className="block font-medium mb-2">
                Email
                </label>
                <input
                    type="text"
                    className="border border-gray-300 rounded-lg py-2 px-3 w-full"
                    value={credentials.email}
                    onChange={(e) => {
                        setCredentials({ ...credentials, email: e.target.value });
                    }}
                    placeholder="Enter your username"
                />
            </div>
            <div className="mb-4">
                <label className="block font-medium mb-2">
                Password
                </label>
                <input
                    type="password"
                    className="border border-gray-300 rounded-lg py-2 px-3 w-full"
                    value={credentials.password}
                    onChange={(e) => {
                        setCredentials({ ...credentials, password: e.target.value });
                    }}
                    placeholder="Enter your password"
                />
            </div>
            <div className="text-center">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 font-medium py-2 px-4 rounded-lg text-white"
                    onClick={() => { login(credentials) }}
                >
                Login
                </button>
                <div className="pt-5 text-sm">Don't have an account? <div className="text-blue-600" onClick={() => router.push("/register")}>Register here</div></div>
            </div>
        </div>
        </div>
    );
};

export default LoginPage;