export const metadata={
    title:"Billing card"
}
import CardForm from "@/components/payment/CardForm"

const PaymentPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <CardForm />
        </div>
    )
}

export default PaymentPage
