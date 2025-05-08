"use client"

import { useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useManageUsers } from '@/hooks/admin/useAdmin'

const DeleteUserButton = ({ id, onClose }: { id: string, onClose: () => void }) => {
    const { deleteUser, isDeleting } = useManageUsers(id)
    const [showConfirm, setShowConfirm] = useState(false)
    const [deletePassword, setDeletePassword] = useState('')

    const handleDelete = async () => {
        if (!deletePassword.trim()) {
            toast.warn("Please enter your password to confirm deletion")
            return
        }
        try {
            deleteUser({ id, password: deletePassword }, {
                onSuccess: () => {
                    setDeletePassword('')
                    onClose()
                    setShowConfirm(false)
                    toast.success('User deleted successfully')
                },
                onError: (error) => {
                    toast.error(error.message || 'Failed to delete user')
                }

            })
        } catch (error) {
            toast.error('Failed to delete user')
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
                {isDeleting ? "Deleting..." : "Delete User"}
            </button>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/70 top-0 left-0  flex items-center justify-center z-50">
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

export default DeleteUserButton