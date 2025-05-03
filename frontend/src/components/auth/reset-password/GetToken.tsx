"use client"
import { useAuth } from "@/hooks/auth/useAuth"
import { useGetResetTokenForm } from "@/hooks/forms/useResetPasswordForm"
import { GetResetTokenFormValues } from "@/schemas/reset.password.schema"
import { toast } from 'react-toastify'

const GetToken = ({ onTokenSent }: { onTokenSent: (email: string) => void }) => {
    const { getToken } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useGetResetTokenForm()
    const onSubmit = (data: GetResetTokenFormValues) => {
        getToken(data, {
            onSuccess: () => {
                toast.success('Token sent via email')
                onTokenSent(data.email)
            },
            onError: (err: any) =>
                toast.error(err?.message || 'Token fetch failed. Please try again'),
        });
    }
    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
            <h2 className="text-3xl font-bold mb-6">Get Password Reset Key</h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                method='post'
                className="w-11/12 max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        {...register("email")}
                        className="mt-1 w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white focus:ring-navy focus:border-navy"
                        placeholder="Your email"
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
                >
                    Receive reset key
                </button>
                <p className="text-sm font-semibold text-slate-600">Use an email linked to your account to get a unique key to be used in password reset</p>
            </form>
        </div>
    )
}

export default GetToken
