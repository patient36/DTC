"use client"

import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'
import { useRegisterAdminForm } from '@/hooks/forms/useAdminRegistrationForm';
import { RegisterAdminFormValues } from '@/schemas/admin.registration.schema';
import { useAdmin } from '@/hooks/admin/useAdmin';

const AdminRegistrationForm = () => {
    const { register, handleSubmit, formState: { errors } } = useRegisterAdminForm()
    const { createAdmin } = useAdmin()
    const router = useRouter()

    const onSubmit = (data: RegisterAdminFormValues) => {
        const { confirmPassword, ...rest } = data
        console.log(rest)
        createAdmin(rest, {
            onSuccess: () => {
                toast.success('Admin created')
            },
            onError: () => {
                toast.error('Failed to create admin')
            }
        })
    }

    return (
        <div className="flex min-h-screen p-4 flex-col md:flex-row">
            <div className="hidden md:flex w-1/2 bg-blue-750 text-white flex-col justify-center items-center p-8">
                <h1 className="text-3xl font-extrabold mb-6 text-green-500">Welcome to DTC Admin Portal</h1>
                <p>Join us in preserving your memories for tomorrow.</p>
                <p className="text-sm font-bold mt-4">To continue you will need assistance from an already existing admin.</p>
            </div>

            <div className="w-full rounded-md min-h-screen md:w-1/2 flex flex-col justify-center items-center bg-gray-800 text-white">
                <h2 className="text-3xl font-bold mb-6">Register as System Admin</h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    method='post'
                    className="w-11/12 max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            {...register('name')}
                            className="mt-1 w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                            placeholder="Enter your name"
                        />
                        {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register('email')}
                            className="mt-1 w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="token" className="block text-sm font-medium text-gray-300">
                            Admin Token
                        </label>
                        <input
                            type="text"
                            id="token"
                            {...register('adminToken')}
                            className="mt-1 w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                            placeholder="Enter the provided admin token"
                        />
                        {errors.adminToken && <p className='text-sm text-red-500'>{errors.adminToken.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register('password')}
                            className="mt-1 w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register('confirmPassword')}
                            className="mt-1 w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && <p className='text-sm text-red-500'>{errors.confirmPassword.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
                    >
                        Register
                    </button>
                    <div className="mt-2 text-center">
                        <p className="text-sm">
                            Already have an account?{' '}
                            <Link href="/" className="text-blue-400 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminRegistrationForm;
