"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, UpdateUserFormValues } from "@/schemas/user.update.shema";

export const useUpdateUserForm = (defaultValues?: UpdateUserFormValues) => {
    return useForm<UpdateUserFormValues>({
        resolver: zodResolver(updateUserSchema),
        mode: "onSubmit",
        defaultValues
    });
};