"use client"

import { useLoginForm } from '@/hooks/forms/useLoginForm';
import { LoginFormValues } from '@/schemas/login.schema';
import React from 'react';

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useLoginForm()
    const onSubmit = (data: LoginFormValues) => {
        console.log(data)
    }
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <div className="hidden md:flex w-1/2 bg-blue-950 text-white flex-col justify-center items-center p-8">
                <h1 className="text-5xl font-extrabold mb-6">Welcome to DTC</h1>
                <p className="text-lg text-center italic">
                    Capture your thoughts today and send them to your future self. <br />
                    Join us in preserving your memories for tomorrow.
                </p>
            </div>

            <div className="w-full min-h-screen md:w-1/2 flex flex-col justify-center items-center bg-gray-900 text-white">
                <h2 className="text-3xl font-bold mb-6">Login</h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    method='post'
                    className="w-11/12 max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email")}
                            className="mt-1 w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white focus:ring-navy focus:border-navy"
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password")}
                            className="mt-1 w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white focus:ring-navy focus:border-navy"
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
                    >
                        Login
                    </button>
                    <div className="mt-4 text-center">
                        <a href="#" className="text-sm text-blue-400 hover:underline">
                            Forgot Password?
                        </a>
                    </div>
                    <div className="mt-2 text-center">
                        <p className="text-sm">
                            Don't have an account?{' '}
                            <a href="#" className="text-blue-400 hover:underline">
                                Register here
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
