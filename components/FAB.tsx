"use client"

import { Plus, UserPlus, Package, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function FAB() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-soft-lg bg-gradient-to-r from-[#004CE6] to-[#6E59F9] hover:shadow-xl transition-all hover:scale-105"
          >
            <Plus className={`h-6 w-6 transition-transform ${isOpen ? "rotate-45" : ""}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mb-2">
          <DropdownMenuItem className="gap-3 py-3 cursor-pointer">
            <UserPlus className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Novo Cliente</div>
              <div className="text-xs text-muted-foreground">Adicionar cliente ao CRM</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-3 py-3 cursor-pointer">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Novo Produto</div>
              <div className="text-xs text-muted-foreground">Cadastrar produto</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-3 py-3 cursor-pointer">
            <Target className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Nova Meta</div>
              <div className="text-xs text-muted-foreground">Definir objetivo</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
