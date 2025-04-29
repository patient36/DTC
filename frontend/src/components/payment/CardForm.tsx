'use client'

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaLock, FaSpinner } from 'react-icons/fa'
import { useCardForm } from '@/hooks/forms/useCardForm'
import { BillingFormValues } from '@/schemas/billing.card.schema'

const CardForm = () => {
    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors }
    } = useCardForm()

    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const onSubmit = async (data: BillingFormValues) => {
        if (!stripe || !elements) return
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) return

        setLoading(true)
        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: { name: data.cardHolderName },
            })

            if (error || !paymentMethod) throw error || new Error('Payment method creation failed')

            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/payment/card/default`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
                credentials: 'include',
            })

            const resData = await res.json()
            if (!res.ok) throw new Error(resData.message)

            setIsVisible(false)
            setTimeout(() => {
                alert('Card attached successfully!')
                if (elements.getElement(CardElement)) elements.getElement(CardElement)?.clear()
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

                        <form onSubmit={handleFormSubmit(onSubmit)} className="p-8 space-y-6">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
                                    Billing Card
                                </h1>
                                <p className="text-gray-300 text-sm mt-2">
                                    Provide your card details below to register it as your default payment.
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
                                            {...register('cardHolderName')}
                                            className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400 transition-all"
                                        />
                                    </motion.div>
                                    {errors.cardHolderName && (
                                        <p className="text-sm text-red-400 mt-1">{errors.cardHolderName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Card Details</label>
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
                                            <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Attach Card Securely'
                                    )}
                                </span>
                            </motion.button>

                            <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs">
                                <FaLock className="w-4 h-4" />
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
