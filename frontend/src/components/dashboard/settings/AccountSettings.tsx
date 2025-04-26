"use client"

import UpdateUserForm from '@/components/dashboard/settings/updateUserForm'
import DeleteAccountButton from '@/components/dashboard/settings/deleteAccountButton'

const AccountSettingsPage = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="w-full m-2 md:w-1/2 p-4 bg-gray-900 text-white rounded-lg flex flex-col items-center max-h-screen overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
            <style>{`::-webkit-scrollbar { display: none; }`}</style>

            <h2 className="text-3xl font-bold mb-6">Account Settings</h2>

            <UpdateUserForm onClose={onClose} />
            <DeleteAccountButton onClose={onClose} />
        </div>
    )
}

export default AccountSettingsPage