"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, ResetPasswordFormValues, GetResetTokenSchema, GetResetTokenFormValues } from "@/schemas/reset.password.schema";

export const useResetPasswordForm = () => {
    return useForm<ResetPasswordFormValues>({
        resolver: zodResolver(ResetPasswordSchema),
        mode: "onSubmit",
    });
};

export const useGetResetTokenForm = () => {
    return useForm<GetResetTokenFormValues>({
        resolver: zodResolver(GetResetTokenSchema),
        mode: "onSubmit"
    })
}