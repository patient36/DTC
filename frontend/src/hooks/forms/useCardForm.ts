"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { billingSchema, BillingFormValues } from "@/schemas/billing.card.schema";

export const useCardForm = () => {
  return useForm<BillingFormValues>({
    resolver: zodResolver(billingSchema),
    mode: "onSubmit",
  });
};