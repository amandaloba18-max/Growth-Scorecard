"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  placeholder?: string
  disabled?: boolean
}

export function CurrencyInput({ value, onChange, placeholder, disabled }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("")

  useEffect(() => {
    if (value === 0 && displayValue === "") return
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
    setDisplayValue(formatted)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // Remove all non-numeric characters except comma and period
    const numbers = input.replace(/[^\d,]/g, "").replace(",", ".")
    const numericValue = Number.parseFloat(numbers) || 0

    onChange(numericValue)
    setDisplayValue(input)
  }

  const handleBlur = () => {
    // Format on blur
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
    setDisplayValue(formatted)
  }

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder || "R$ 0,00"}
      disabled={disabled}
    />
  )
}
