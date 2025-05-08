import { useState } from "react"
import Modal from '@/components/gloabal/modal';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ProfileCard from '@/components/admin/user.profile'

const SearchById = () => {
    const [id, setId] = useState('')
    const [viewUser, setViewUser] = useState(false)
    const handleGetData = (id: string) => {
        setId(id)
        setViewUser(true)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 p-6 rounded-2xl shadow-xl border border-gray-700/50"
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl shadow-lg">
                        <FaSearch className="text-white text-2xl" />
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Search
                    </h2>
                </div>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    onFocus={() => setId('')}
                    placeholder="Enter User ID"
                    className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => handleGetData(id)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                    Search
                </button>
                {
                    viewUser && (
                        <Modal onClose={() => setViewUser(false)}>
                            <ProfileCard id={id} onClose={() => setViewUser(false)} />
                        </Modal>
                    )
                }
            </div>
        </motion.div>
    )
}

export default SearchById