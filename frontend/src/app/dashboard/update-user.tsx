'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { FaTrash } from 'react-icons/fa'
import { userData as user } from './user'

const schema = z
    .object({
        name: z.string().min(3, 'Name must be at least 3 characters').max(30).optional(),
        email: z.string().email('Invalid email').optional(),
        oldPassword: z.string().min(6, 'Old password must be at least 6 characters').optional(),
        newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
    })
    .refine(
        data => !data.oldPassword || !!data.newPassword,
        {
            message: 'New password is required when old password is provided',
            path: ['newPassword'],
        }
    )


const UpdateForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        oldPassword: '',
        newPassword: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            oldPassword: '',
            newPassword: '',
        })
    }, [])

    const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
        setErrors(prev => ({ ...prev, [field]: '' }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Convert empty strings to undefined for optional validation
            const cleanedData = Object.fromEntries(
                Object.entries(formData).map(([k, v]) => [k, v.trim() === '' ? undefined : v])
            )

            const validated = schema.parse(cleanedData)
            console.log('Updated:', validated)
            alert('Profile updated successfully!')
        } catch (err) {
            if (err instanceof z.ZodError) {
                const map: Record<string, string> = {}
                err.errors.forEach(({ path, message }) => {
                    if (path.length) map[path[0] as string] = message
                })
                setErrors(map)
            }
        } finally {
            setIsSubmitting(false)
        }
    }


    const handleDelete = () => {
        setShowConfirm(false)
        alert('Account deleted (mock)')
    }

    return (
        <div className="w-full md:w-1/2 p-4 bg-gray-900 text-white rounded-lg flex flex-col items-center max-h-screen overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
            <style>{`::-webkit-scrollbar { display: none; }`}</style>

            <h2 className="text-3xl font-bold mb-6">Account Settings</h2>

            <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg space-y-5">
                {[
                    { label: 'Name', type: 'text', field: 'name' },
                    { label: 'Email', type: 'email', field: 'email' },
                    { label: 'Old Password', type: 'password', field: 'oldPassword' },
                    { label: 'New Password', type: 'password', field: 'newPassword' },
                ].map(({ label, type, field }) => (
                    <div key={field}>
                        <label htmlFor={field} className="block text-sm font-medium text-gray-300">{label}</label>
                        <input
                            id={field}
                            type={type}
                            value={formData[field as keyof typeof formData]}
                            onChange={handleChange(field as keyof typeof formData)}
                            className="mt-1 w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                            placeholder={`Enter your ${label.toLowerCase()}`}
                        />
                        {errors[field] && <p className="text-red-400 text-sm mt-1">{errors[field]}</p>}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 text-red-700 bg-white/80 py-2 rounded-md hover:bg-white/90 transition"
                >
                    <FaTrash />
                    Delete Account
                </button>
            </form>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 text-white p-6 rounded-lg w-80 space-y-4 shadow-xl">
                        <h3 className="text-lg font-bold">Confirm Deletion</h3>
                        <p className='text-sm text-amber-400'>This action is irreversible. Are you sure you want to delete your account?</p>
                        <div className="flex justify-between gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UpdateForm
