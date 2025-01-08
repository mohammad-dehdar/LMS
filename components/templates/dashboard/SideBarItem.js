import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation"

function SideBarItem(
    {
        icon: Icon,
        lable,
        href
    }) {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = pathname === href
    

    const clickHandler = () => {
        router.push(href);
    }

    return (
        <button
            onClick={clickHandler}
            className={cn(
                "flex items-center gap-x-2  text-slate-500 text-sm font-[500] pl-6 transition-all  hover:text-slate-600 hover:bg-slate-300/20", isActive && "border-r-4 border-sky-700 text-sky-600 bg-sky-200/20 hover:text-sky-600 hover:bg-sky-200/20"
            )}
            type="button"
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={20}
                    className={cn("text-slate-500", isActive && "text-sky-700")}
                />
                {lable}
            </div>
        </button>
    )
}

export default SideBarItem