"use client"

import { useEffect } from 'react'
import { useUpdateUserForm } from '@/hooks/forms/useUpdateUserForm'
import { UpdateUserFormValues } from '@/schemas/user.update.shema'
import { useAuth } from '@/hooks/auth/useAuth'
import { useUser } from '@/hooks/mutations/useUsers'
import { toast } from 'react-toastify'

const UpdateUserForm = ({ onClose }: { onClose: () => void }) => {
    const { user } = useAuth()
    const { updateUser, isUpdating } = useUser()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useUpdateUserForm()

    useEffect(() => {
        reset({
            name: user?.name || '',
            email: user?.email || '',
            oldPassword: '',
            newPassword: '',
        })
    }, [user, reset])

    const onSubmit = async (data: UpdateUserFormValues) => {
        const updates = {
            ...(data.name && { name: data.name }),
            ...(data.email && { email: data.email }),
            ...(data.oldPassword && { oldPassword: data.oldPassword }),
            ...(data.newPassword && { newPassword: data.newPassword }),
        }
        updateUser({ updates, id: user?.id || '' }, {
            onSuccess: () => {
                toast.success('User updated successfully')
                onClose()
                reset()
            },
            onError: (err: any) => {
                toast.error(err?.message || 'Failed to update user')
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg space-y-5">
            {errors.root && (
                <p className="text-red-400 text-sm mt-1 text-center">
                    {errors.root.message}
                </p>
            )}

            {[
                { label: 'Name', type: 'text', field: 'name' },
                { label: 'Email', type: 'email', field: 'email' },
                { label: 'Old Password', type: 'password', field: 'oldPassword', optional: true },
                { label: 'New Password', type: 'password', field: 'newPassword', optional: true },
            ].map(({ label, type, field, optional }) => (
                <div key={field}>
                    <label htmlFor={field} className="block text-sm font-medium text-gray-300">
                        {label} {optional && <span className="text-gray-500">(optional)</span>}
                    </label>
                    <input
                        id={field}
                        type={type}
                        {...register(field as keyof UpdateUserFormValues)}
                        className="mt-1 w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                        placeholder={`Enter your ${label.toLowerCase()}`}
                    />
                    {errors[field as keyof UpdateUserFormValues] && (
                        <p className="text-red-400 text-sm mt-1">
                            {errors[field as keyof UpdateUserFormValues]?.message}
                        </p>
                    )}
                </div>
            ))}

            <button
                type="submit"
                disabled={isSubmitting || isUpdating}
                className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
            >
                {isSubmitting || isUpdating ? "Saving..." : "Save Changes"}
            </button>
        </form>
    )
}

export default UpdateUserForm