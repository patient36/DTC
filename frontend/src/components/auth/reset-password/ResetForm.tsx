"use client"

import { useResetPasswordForm } from '@/hooks/forms/useResetPasswordForm';
import { ResetPasswordFormValues } from '@/schemas/reset.password.schema';
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';

const ResetForm = ({ email }: { email: string }) => {
    const router = useRouter()
    const { resetPassword } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useResetPasswordForm()
    const onSubmit = (data: ResetPasswordFormValues) => {
        resetPassword(data, {
            onSuccess: () => {
                toast.success('Password changed')
                router.push('/')
            },
            onError: (err: any) =>
                toast.error(err?.message || 'Token fetch failed. Please try again'),
        });
    }
    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
            <h2 className="text-3xl font-bold mb-6">Reset Password</h2>
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
                        Token
                    </label>
                    <input
                        type="password"
                        id="token"
                        {...register("token")}
                        className="mt-1 w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white focus:ring-navy focus:border-navy"
                        placeholder="Reset token"
                    />
                    {errors.token && <p className="text-sm text-red-500">{errors.token.message}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        {...register("newPassword")}
                        className="mt-1 w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white focus:ring-navy focus:border-navy"
                        placeholder="Enter your new password"
                    />
                    {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
                >
                    Reset Password
                </button>
            </form>
        </div>
    )
}

export default ResetForm
