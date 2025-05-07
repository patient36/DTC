"use client"

import { motion } from 'framer-motion'
import UpdateUserForm from '@/components/dashboard/settings/updateUserForm'
import DeleteAccountButton from '@/components/dashboard/settings/deleteAccountButton'

const AccountSettingsPage = ({ onClose }: { onClose: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full m-2 md:w-1/2 p-6 bg-gray-900/80 backdrop-blur-lg rounded-xl flex flex-col items-center h-screen"
        >
            <style>{`::-webkit-scrollbar { display: none; }`}</style>
            <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            >
                Account Settings
            </motion.h2>

            <UpdateUserForm onClose={onClose} />
            <DeleteAccountButton onClose={onClose} />
        </motion.div>
    )
}

export default AccountSettingsPage