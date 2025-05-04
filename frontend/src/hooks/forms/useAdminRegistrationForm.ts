"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerAdminSchema, RegisterAdminFormValues } from "@/schemas/admin.registration.schema";

export const useRegisterAdminForm = () => {
    return useForm<RegisterAdminFormValues>({
        resolver: zodResolver(registerAdminSchema),
        mode: "onSubmit",
    });
};