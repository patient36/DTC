'use client'

import { useState } from 'react'
import GetToken from '@/components/auth/reset-password/GetToken'
import ResetForm from '@/components/auth/reset-password/ResetForm'

const ResetPasswordForm = () => {
  const [email, setEmail] = useState<string | null>(null) // holds email to pass to ResetForm

  return (
    <div className="flex min-h-screen flex-col">
      {email ? (
        <ResetForm email={email} />
      ) : (
        <GetToken onTokenSent={(email: string) => setEmail(email)} />
      )}
    </div>
  )
}

export default ResetPasswordForm
