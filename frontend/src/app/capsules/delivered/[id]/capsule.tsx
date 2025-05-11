'use client'

import FileOpener from '@/components/gloabal/file-opener'
import { useParams } from 'next/navigation'
import { FaRegClock, FaRegCalendar, FaHistory, FaHeart, FaLockOpen, FaCamera, FaTrash } from 'react-icons/fa'
import { GiTimeBomb, GiScrollQuill, GiWaxSeal } from 'react-icons/gi'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from '@/components/gloabal/modal'
import { useEffect, useState } from 'react'
import { useSound } from 'use-sound'
import confetti from 'canvas-confetti'
import { useCapsule } from '@/hooks/mutations/useCapsule'
import { formatDate } from '@/utils/formatDates'
import LoadingSpinner from '@/components/gloabal/Spinner'
import { useAuth } from '@/hooks/auth/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const CapsulePage = () => {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [selectedAttachment, setSelectedAttachment] = useState<null | {
        path: string
        size: number
        type: string
    }>(null)
    const [unlocked, setUnlocked] = useState(false)
    const [playUnlock] = useSound('/sounds/unlock.mp3', { volume: 0.5 })
    const [playPaper] = useSound('/sounds/paper.mp3')
    const [confirmShow, setConfirmShow] = useState(false)

    const { capsule, capsuleError, capsuleErrorDetail, capsuleLoading, deleteCapsule } = useCapsule(id)
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        if (!capsuleLoading && !isAuthenticated) {
            router.push('/');
        }
        if (!capsuleLoading && capsuleError) {
            const isPaymentRequired = capsuleErrorDetail instanceof Error &&
                capsuleErrorDetail.message === 'Payment required';

            if (isPaymentRequired) {
                router.push('/payment');
            } else {
                console.error('Error fetching capsules:', capsuleErrorDetail);
            }
        }
    }, [capsuleLoading, isAuthenticated, capsuleError, capsuleErrorDetail]);

    if (capsuleError) {
        const isPaymentRequired =
            capsuleErrorDetail instanceof Error &&
            capsuleErrorDetail.message === 'Payment required';

        if (!isPaymentRequired) {
            console.error('Error fetching capsules:', capsuleErrorDetail);
        }

        return null;
    }

    if (capsuleLoading || !isAuthenticated) {
        return <LoadingSpinner />
    }

    if (capsuleError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-amber-500">Failed to retrieve capsule</p>
            </div>
        )
    }

    if (!capsule) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-amber-500">Capsule not found</p>
            </div>
        )
    }

    const handleUnlock = () => {
        playUnlock()
        setUnlocked(true)
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: unlocked ? 0 : 0.5
            }
        }
    }

    const handleDelete = (id: string) => {
        setConfirmShow(false)
        deleteCapsule({ id }, {
            onSuccess: () => {
                toast.success('Capsule deleted')
                router.push('/capsules/delivered')
            },
            onError: () => toast.error('Failed to delete capsule')
        })
    }

    return (
        <div className="min-h-screen bg-[url('/textures/old-paper.jpg')] bg-cover bg-fixed px-4 pt-10 md:p-8">
            {!unlocked ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-screen gap-8"
                >
                    <GiTimeBomb className="text-6xl text-yellow-600 animate-pulse" />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleUnlock}
                        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full text-white shadow-lg"
                    >
                        <FaLockOpen />
                        <span>Open Time Capsule</span>
                    </motion.button>
                    <p className="text-amber-600 text-sm">Created: {formatDate(capsule.createdAt)}</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Wax Seal Decoration */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="relative"
                    >
                        <GiWaxSeal className="absolute -top-8 -left-8 text-5xl text-red-700/90 rotate-12" />
                    </motion.div>

                    {/* Time Capsule Contents */}
                    <motion.div variants={container} initial="hidden" animate="show">
                        {/* Header */}
                        <motion.div variants={container} className="mb-8">
                            <motion.h1
                                variants={item}
                                className="font-serif text-4xl md:text-5xl text-center mb-2 font-bold text-amber-500"
                            >
                                {capsule.title}
                            </motion.h1>
                            <motion.p
                                variants={item}
                                className="flex items-center justify-center gap-2 text-sm text-amber-800"
                            >
                                <FaHistory /> A message from your past self
                            </motion.p>
                        </motion.div>

                        {/* Message */}
                        <motion.div
                            variants={item}
                            onClick={() => playPaper()}
                            className="relative p-8 mb-8 bg-white/90 rounded-lg shadow-md border-l-4 border-amber-700"
                        >
                            <GiScrollQuill className="absolute -top-4 -left-4 text-3xl text-amber-600/70" />
                            <p className="text-lg leading-relaxed text-gray-800 font-serif">
                                {capsule.message}
                            </p>
                            <div className="absolute bottom-4 right-6 text-amber-600">
                                <FaHeart />
                            </div>
                        </motion.div>

                        {/* Attachments */}
                        {capsule.attachments.length > 0 && (
                            <motion.div
                                variants={item}
                                className="flex items-center justify-center gap-2 mb-4 text-lg font-semibold text-amber-300"
                            >
                                <FaCamera /> Attachments from {formatDate(capsule.createdAt)}
                            </motion.div>
                        )}
                        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {capsule.attachments.map((att) => (
                                <motion.div
                                    key={att.path}
                                    whileHover={{ y: -5 }}
                                    className="relative h-64 rounded-lg overflow-hidden shadow-md border border-amber-200/50"
                                    onClick={() => {
                                        setSelectedAttachment(att)
                                    }}
                                >
                                    <FileOpener type={att.type} path={att.path} size={att.size} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Metadata */}
                        <motion.div variants={item} className="flex flex-wrap gap-4 justify-center">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 bg-white/80 px-4 py-3 rounded-lg shadow-sm"
                            >
                                <FaRegClock className="text-amber-600" />
                                <div>
                                    <p className="text-xs text-amber-800">Created</p>
                                    <p className="text-sm">{formatDate(capsule.createdAt)}</p>
                                </div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 bg-white/80 px-4 py-3 rounded-lg shadow-sm"
                            >
                                <FaRegCalendar className="text-amber-600" />
                                <div>
                                    <p className="text-xs text-amber-800">Delivered</p>
                                    <p className="text-sm">{formatDate(capsule.deliveryDate)}</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Delete button */}
                        <motion.div className="flex justify-center mt-8">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setConfirmShow(true)}
                                className="px-6 py-3 flex items-center gap-2 cursor-pointer bg-red-600 text-white rounded-full shadow-lg"
                            >
                                <FaTrash />
                                Delete Capsule
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* File view Modal */}
                    <AnimatePresence>
                        {selectedAttachment && (
                            <Modal onClose={() => setSelectedAttachment(null)}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="w-[90vw] h-[90vh] max-w-4xl"
                                >
                                    <FileOpener
                                        type={selectedAttachment.type}
                                        path={selectedAttachment.path}
                                        size={selectedAttachment.size}
                                        isInModal={true}
                                    />
                                </motion.div>
                            </Modal>
                        )}
                    </AnimatePresence>

                    {/* Confirmation Modal */}
                    <AnimatePresence>
                        {confirmShow && (
                            <Modal onClose={() => setConfirmShow(false)}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="w-[90vw] h-[90vh] flex items-center justify-center bg-black/80 rounded-2xl max-w-4xl"
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <GiWaxSeal className="text-5xl text-amber-600" />
                                        <h1 className="text-2xl font-bold text-amber-600">Delete Capsule</h1>
                                        <p className="text-lg text-amber-600">
                                            Are you sure you want to delete this capsule? This action cannot be undone.
                                        </p>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setConfirmShow(false)}
                                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleDelete(capsule.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </Modal>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    )
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default CapsulePage