import { AlertTriangle, CheckCircleIcon } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const bannerVariants = cva(
    "border text-center p-4 text-sm flex items-center w-full",
    {
        variants: {
            variant: {
                warning: "bg-yellow-300/80 border-yelow-30 text-primary",
                success: "bg-emerald-700 border-emerald-800 text-seconary"
            }
        },
        defaultVariants: {
            variant: "warning"
        }
    }
)

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon
}

function Banner({label, variant}) {
    const Icon = iconMap[variant || "warning"]

    return (
        <div className={cn(bannerVariants({ variant }))}>
            <Icon className="h-4 w-4 mr-2"/>
            {label}
        </div>
    )
}

export default Banner