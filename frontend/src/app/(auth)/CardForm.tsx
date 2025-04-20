'use client'

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const CardForm = () => {
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)
    const [cardholderName, setCardholderName] = useState('')
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements || !cardholderName.trim()) return

        setLoading(true)
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) return

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: { name: cardholderName },
            })

            if (error || !paymentMethod) {
                throw error || new Error('Payment method creation failed')
            }

            const res = await fetch('/api/attach-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            // Success animation
            setIsVisible(false)
            setTimeout(() => {
                alert('Card attached successfully!')
                setCardholderName('')
                if (elements.getElement(CardElement)) {
                    elements.getElement(CardElement)?.clear()
                }
                setIsVisible(true)
            }, 500)
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#ffffff',
                '::placeholder': {
                    color: '#a1a1aa',
                },
            },
        },
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-lg opacity-30"></div>
                    <div className="relative bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700 border-opacity-50">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
                                    Secure Card Attachment
                                </h1>
                                <p className="text-gray-300 text-sm">
                                    Safely link your payment method to your account
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Name on Card
                                    </label>
                                    <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={cardholderName}
                                            onChange={(e) => setCardholderName(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400 transition-all"
                                        />
                                    </motion.div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Card Details
                                    </label>
                                    <motion.div 
                                        whileHover={{ scale: 1.01 }}
                                        className="p-4 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-cyan-500 transition-all"
                                    >
                                        <CardElement options={cardElementOptions} />
                                    </motion.div>
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading || !stripe}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${loading || !stripe 
                                    ? 'bg-gray-600 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg'
                                }`}
                            >
                                <span className="flex items-center justify-center">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        'Attach Card Securely'
                                    )}
                                </span>
                            </motion.button>

                            <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                </svg>
                                <span>256-bit SSL encryption</span>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default CardForm