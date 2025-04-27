'use client'
import { useState } from 'react'
import { z } from 'zod'
import { FaPaperPlane, FaClock, FaCalendarAlt, FaFileUpload } from 'react-icons/fa'
import { GiScrollQuill, GiTimeBomb } from 'react-icons/gi'
import { motion, AnimatePresence } from 'framer-motion'
import { CapsuleFormValues, capsuleSchema } from '@/schemas/capsule.schema'
import { useCapsuleForm } from '@/hooks/forms/useCapsuleForm'
import { useCapsule } from '@/hooks/mutations/useCapsule'

const NewCapsuleForm = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useCapsuleForm()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [timeEffect, setTimeEffect] = useState(false)
    const [attachments, setAttachments] = useState<File[]>([])

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : []
        setAttachments(files)
        setValue('attachments', files)
    }

    const onSubmit = async (data: CapsuleFormValues) => {
        setIsSubmitting(true)
        try {
            const validated = capsuleSchema.parse({
                ...data,
                deliveryDate: new Date(data.deliveryDate).toISOString(),
                attachments
            })

            setTimeEffect(true)
            await new Promise(res => setTimeout(res, 200))

            console.log("Capsule created:", validated)
            alert("Your time capsule has been launched to the future!")
        } catch (err) {
            if (err instanceof z.ZodError) {
                console.error('Validation failed:', err)
            }
        } finally {
            setTimeEffect(false)
            setIsSubmitting(false)
        }
    }

    const deliveryMinDate = new Date(new Date().setMonth(new Date().getMonth() + 3))
        .toISOString().split('T')[0]

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-4">
            {/* Time Effect */}
            <AnimatePresence>
                {timeEffect && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1.5 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 2 }}
                            className="text-6xl text-yellow-400"
                        >
                            <GiTimeBomb />
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="absolute text-white text-xl font-bold mt-40"
                        >
                            Launching to the future...
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-2xl bg-gray-800/70 backdrop-blur-sm text-white p-8 rounded-xl border border-indigo-400/30 shadow-2xl shadow-indigo-500/20"
            >
                <div className="flex items-center justify-center gap-3 mb-8">
                    <GiTimeBomb className="text-3xl text-yellow-400" />
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                        Time Capsule Portal
                    </h1>
                </div>

                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="text-sm font-medium flex items-center gap-2 mb-2">
                            <FaPaperPlane className="text-indigo-300" />
                            <span>Message Title</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            {...register('title')}
                            placeholder="To my future self..."
                            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.title && <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>}
                    </div>

                    {/* Message */}
                    <div>
                        <label htmlFor="message" className="text-sm font-medium flex items-center gap-2 mb-2">
                            <GiScrollQuill className="text-indigo-300" />
                            <span>Your Message</span>
                        </label>
                        <textarea
                            id="message"
                            rows={6}
                            {...register('message')}
                            placeholder="Write your thoughts for the future..."
                            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.message && <p className="text-sm text-red-400 mt-1">{errors.message.message}</p>}
                    </div>

                    {/* Delivery Date */}
                    <div>
                        <label htmlFor="deliveryDate" className="text-sm font-medium flex items-center gap-2 mb-2">
                            <FaCalendarAlt className="text-indigo-300" />
                            <span>Future Delivery Date</span>
                        </label>
                        <input
                            id="deliveryDate"
                            type="date"
                            min={deliveryMinDate}
                            {...register('deliveryDate')}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.deliveryDate && <p className="text-sm text-red-400 mt-1">{errors.deliveryDate.message}</p>}
                    </div>

                    {/* Attachments */}
                    <div>
                        <label htmlFor="attachments" className="text-sm font-medium flex items-center gap-2 mb-2">
                            <FaFileUpload className="text-indigo-300" />
                            <span>Memory Attachments</span>
                        </label>
                        <input
                            id="attachments"
                            type="file"
                            multiple
                            accept='image/*,video/*'
                            onChange={onFileChange}
                            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                        />
                        {attachments.length > 0 && (
                            <p className="text-sm text-gray-400 mt-2">Selected: {attachments.length} file(s)</p>
                        )}
                    </div>

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-8 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-bold text-lg shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <FaClock />
                                </motion.span>
                                Launching to Future...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <FaPaperPlane />
                                Send to Future
                            </span>
                        )}
                    </motion.button>
                </div>
            </motion.form>
        </div>
    )
}

export default NewCapsuleForm