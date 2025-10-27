"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Home, Users, Package, Lightbulb, FileText, Settings, Plus, Activity } from "lucide-react"

const commands = [
  {
    group: "Navegação",
    items: [
      { label: "Ir para Dashboard", icon: Home, action: "/" },
      { label: "Ir para Clientes", icon: Users, action: "/clientes" },
      { label: "Ir para Produtos", icon: Package, action: "/produtos" },
      { label: "Ir para KPIs de Crescimento", icon: Activity, action: "/metricas" },
      { label: "Ir para Recomendações", icon: Lightbulb, action: "/recomendacoes" },
      { label: "Ir para Relatórios", icon: FileText, action: "/relatorios" },
      { label: "Ir para Configurações", icon: Settings, action: "/configuracoes" },
    ],
  },
  {
    group: "Ações",
    items: [
      { label: "Adicionar Cliente", icon: Plus, action: "add-client" },
      { label: "Adicionar Produto", icon: Plus, action: "add-product" },
      { label: "Gerar Recomendações", icon: Lightbulb, action: "generate-recomendacoes" },
    ],
  },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (action: string) => {
    setOpen(false)
    if (action.startsWith("/")) {
      router.push(action)
    } else {
      // Handle custom actions
      console.log("[v0] Command action:", action)
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Digite um comando ou busque..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        {commands.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => (
              <CommandItem key={item.label} onSelect={() => handleSelect(item.action)}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
