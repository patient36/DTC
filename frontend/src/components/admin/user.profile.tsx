import { useManageUsers } from "@/hooks/admin/useAdmin";
import { formatDate } from "@/utils/formatDates";
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaShieldAlt, FaDatabase, FaCalendarCheck, FaRocket, FaBoxOpen, FaClock, FaTrash } from 'react-icons/fa';
import LoadingSpinner from '@/components/gloabal/Spinner'
import { toast } from 'react-toastify'
import { useEffect } from "react";
import DeleteUserButton from "@/components/admin/DeleteUserButton";

const ProfileCard = ({ id, onClose }: { id: string, onClose: () => void }) => {
    const { data, userLoading, userError } = useManageUsers(id)
    useEffect(() => {
        if (userError) {
            toast.error('Failed to fetch user')
        }
    }, [userError])
    if (userLoading) {
        return (
            <div className="h-screen w-full">
                <LoadingSpinner />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center bg-gray-900 rounded-xl p-6 w-full max-w-2xl">
                No user found
            </div>
        );
    }

    const { user, capsules } = data!

    return (
        <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl"
        >
            <div className="border-b border-gray-700 pb-4 mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaUser className="text-blue-400" />
                    {user.name}
                    <span className="text-sm bg-blue-900 text-blue-300 px-3 py-1 rounded-full ml-2">
                        {user.role}
                    </span>
                </h2>
                <p className="text-gray-400 flex items-center gap-2 mt-2">
                    <FaEnvelope className="text-purple-400" />
                    {user.email}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FaDatabase className="text-green-400" />
                        Storage Usage
                    </h3>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{Math.round(user.usedStorage * 100) / 100} GB Used</span>
                        <span className="text-blue-400">{(Math.max(0.1 - user.usedStorage, 0)).toFixed(2)} GB Free</span>
                    </div>

                    <div className="h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                            style={{ width: `${Math.min((user.usedStorage / 0.1) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FaCalendarCheck className="text-yellow-400" />
                        Subscription Status
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-sm ${new Date(user.paidUntil) > new Date()
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'}`}>
                            {new Date(user.paidUntil) > new Date() ? 'Active' : 'Expired'}
                        </span>
                        <p className="text-sm text-gray-400">
                            {new Date(user.paidUntil) > new Date() ? 'Until' : 'at'} {formatDate(user.paidUntil)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FaRocket className="text-purple-400" />
                    Capsule Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <FaBoxOpen className="text-3xl mx-auto text-green-400" />
                        <p className="text-2xl font-bold mt-2">{capsules.delivered}</p>
                        <p className="text-sm text-gray-400">Delivered</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <FaClock className="text-3xl mx-auto text-yellow-400" />
                        <p className="text-2xl font-bold mt-2">{capsules.pending}</p>
                        <p className="text-sm text-gray-400">Pending</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-sm text-gray-400 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-red-400" />
                    User ID: {user.id}
                </div>
                <p>Joined: {formatDate(user.createdAt)}</p>
            </div>
            {user.role !== 'ADMIN' &&
                <div className="flex items-center justify-center p-4">
                    <DeleteUserButton id={id} onClose={onClose} />
                </div>
            }
        </motion.div>
    );
}

export default ProfileCard;