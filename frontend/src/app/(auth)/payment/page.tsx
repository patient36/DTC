// app/payment/page.tsx
'use client'
import CardForm from "../CardForm"

const PaymentPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <CardForm />
        </div>
    )
}

export default PaymentPage
