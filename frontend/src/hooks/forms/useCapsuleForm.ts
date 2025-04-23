"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { capsuleSchema } from '@/schemas/capsule.schema'
import { CapsuleFormValues } from '@/schemas/capsule.schema'

export const useCapsuleForm = () => {
    return useForm<CapsuleFormValues>({
        resolver: zodResolver(capsuleSchema),
        mode: "onSubmit",
    })
}