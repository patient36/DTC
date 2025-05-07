"use client"

import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa'
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
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl  shadow-2xl space-y-6 border border-gray-700 overflow-y-auto"
        >

            {[
                { label: 'Name', type: 'text', field: 'name', icon: FaUser },
                { label: 'Email', type: 'email', field: 'email', icon: FaEnvelope },
                { label: 'Old Password', type: 'password', field: 'oldPassword', icon: FaLock, optional: true },
                { label: 'New Password', type: 'password', field: 'newPassword', icon: FaLock, optional: true },
            ].map(({ label, type, field, optional, icon: Icon }, index) => (
                <motion.div
                    key={field}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <label htmlFor={field} className="block text-sm font-medium text-gray-300 mb-2">
                        {label} {optional && <span className="text-gray-500">(optional)</span>}
                    </label>
                    <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            id={field}
                            type={type}
                            {...register(field as keyof UpdateUserFormValues)}
                            className="mt-1 w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg bg-gray-900/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                            placeholder={`Enter your ${label.toLowerCase()}`}
                        />
                    </div>
                    {errors[field as keyof UpdateUserFormValues] && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-sm mt-2"
                        >
                            {errors[field as keyof UpdateUserFormValues]?.message}
                        </motion.p>
                    )}
                </motion.div>
            ))}

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || isUpdating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
                {isSubmitting || isUpdating ? "Saving..." : "Save Changes"}
            </motion.button>
        </motion.form>
    )
}

export default UpdateUserForm