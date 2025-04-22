'use client'
import { useState } from 'react'
import { z } from 'zod'
import { FaPaperPlane, FaClock, FaCalendarAlt, FaFileUpload } from 'react-icons/fa'
import { GiScrollQuill, GiTimeBomb } from 'react-icons/gi'
import { motion, AnimatePresence } from 'framer-motion'

// Zod schema for validation
const capsuleSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(50),
    message: z.string().min(20, "Message must be at least 20 characters").max(1000),
    deliveryDate: z.date().min(
        new Date(new Date().setMonth(new Date().getMonth() + 3)),
        "Delivery must be at least 3 months from now"
    ),
    attachments: z.array(z.instanceof(File)).max(5, "Maximum 5 attachments allowed")
})

const NewCapsuleForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        deliveryDate: '',
        attachments: [] as File[]
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [timeEffect, setTimeEffect] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({
                ...prev,
                attachments: Array.from(e.target.files as FileList)
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Validate with Zod
            const validatedData = capsuleSchema.parse({
                ...formData,
                deliveryDate: new Date(formData.deliveryDate)
            })

            // Simulate time portal effect
            setTimeEffect(true)
            await new Promise(resolve => setTimeout(resolve, 2000))

            console.log("Capsule created:", validatedData)
            alert("Your time capsule has been launched to the future!")

        } catch (err) {
            if (err instanceof z.ZodError) {
                const errorMap: Record<string, string> = {}
                err.errors.forEach(error => {
                    if (error.path) {
                        errorMap[error.path[0]] = error.message
                    }
                })
                setErrors(errorMap)
            }
        } finally {
            setTimeEffect(false)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-4">
            {/* Time Portal Effect */}
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
                            transition={{ duration: 2, ease: "easeInOut" }}
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

            {/* Portal Styled Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-gray-800/70 backdrop-blur-sm text-white p-8 rounded-xl border border-indigo-400/30 shadow-2xl shadow-indigo-500/20"
            >
                <div className="flex items-center justify-center gap-3 mb-8">
                    <GiTimeBomb className="text-3xl text-yellow-400" />
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                        Time Capsule Portal
                    </h1>
                </div>

                <div className="space-y-6">
                    {/* Title Field */}
                    <div className="relative">
                        <label htmlFor="title" className="text-sm font-medium mb-2 flex items-center gap-2">
                            <FaPaperPlane className="text-indigo-300" />
                            <span>Message Title</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="To my future self..."
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                    </div>

                    {/* Message Field */}
                    <div className="relative">
                        <label htmlFor="message" className="text-sm font-medium mb-2 flex items-center gap-2">
                            <GiScrollQuill className="text-indigo-300" />
                            <span>Your Message</span>
                        </label>
                        <textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={6}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Write your thoughts for the future..."
                        />
                        {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
                    </div>

                    {/* Delivery Date */}
                    <div className="relative">
                        <label htmlFor="deliveryDate" className=" text-sm font-medium mb-2 flex items-center gap-2">
                            <FaCalendarAlt className="text-indigo-300" />
                            <span>Future Delivery Date</span>
                        </label>
                        <input
                            id="deliveryDate"
                            type="date"
                            value={formData.deliveryDate}
                            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                            min={new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {errors.deliveryDate && <p className="mt-1 text-sm text-red-400">{errors.deliveryDate}</p>}
                    </div>

                    {/* Attachments */}
                    <div className="relative">
                        <label htmlFor="attachments" className="text-sm font-medium mb-2 flex items-center gap-2">
                            <FaFileUpload className="text-indigo-300" />
                            <span>Memory Attachments</span>
                        </label>
                        <input
                            id="attachments"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                        />
                        {errors.attachments && <p className="mt-1 text-sm text-red-400">{errors.attachments}</p>}
                        {formData.attachments.length > 0 && (
                            <p className="mt-2 text-sm text-gray-400">
                                Selected: {formData.attachments.length} file(s)
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-8 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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