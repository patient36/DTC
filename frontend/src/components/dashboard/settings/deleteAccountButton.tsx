"use client"

import { useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { useAuth } from '@/hooks/auth/useAuth'
import { useUser } from '@/hooks/mutations/useUsers'
import { toast } from 'react-toastify'

const DeleteAccountButton = ({ onClose }: { onClose: () => void }) => {
    const { user, logout } = useAuth()
    const { deleteUser, isDeleting } = useUser()
    const [showConfirm, setShowConfirm] = useState(false)
    const [deletePassword, setDeletePassword] = useState('')

    const handleDelete = async () => {
        if (!deletePassword.trim()) {
            toast.warn("Please enter your password to confirm deletion")
            return
        }
        try {
            deleteUser({ id: user?.id, password: deletePassword }, {
                onSuccess: () => {
                    onClose()
                    setDeletePassword('')
                    setShowConfirm(false)
                    logout()
                    toast.success('Account deleted successfully')
                },
                onError: (error) => {
                    toast.error(error.message || 'Failed to delete account')
                }

            })
        } catch (error) {
            toast.error('Failed to delete account')
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
                className="mt-4 w-full max-w-md flex items-center justify-center gap-2 text-red-700 bg-white/80 p-2 rounded-md hover:bg-white/90 transition disabled:opacity-50"
            >
                <FaTrash />
                {isDeleting ? "Deleting..." : "Delete Account"}
            </button>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 text-white p-6 rounded-lg w-80 space-y-4 shadow-xl">
                        <h3 className="text-lg font-bold">Confirm Deletion</h3>
                        <p className="text-sm text-amber-400">
                            This action is irreversible. Are you sure you want to delete your account?
                        </p>
                        <div className="flex flex-col justify-between gap-3">
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    Enter your password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    autoFocus
                                    required
                                    className="mt-1 w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white focus:ring-navy focus:border-navy"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting || !deletePassword.trim()}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirm(false)
                                    setDeletePassword('')
                                }}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DeleteAccountButton