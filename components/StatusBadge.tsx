import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

type Status = "ativo" | "em_risco" | "cancelado" | "inadimplente" | "finalizado"

interface StatusBadgeProps {
  status: Status
  className?: string
}

const statusConfig = {
  ativo: {
    label: "Ativo",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0",
  },
  em_risco: {
    label: "Em risco",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-0",
  },
  inadimplente: {
    label: "Inadimplente",
    className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-0",
  },
  finalizado: {
    label: "Finalizado",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300 border-0",
    icon: CheckCircle,
  },
  cancelado: {
    label: "Cancelado",
    className: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-0",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge
      className={cn("rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1", config.className, className)}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  )
}
