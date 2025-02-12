"use client"
import qs from "query-string";
import { usePathname, useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"



function CategoryItem({ label, value, icon: Icon }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryid = searchParams ? searchParams.get("categoryId") : null;
    const currentTitle = searchParams ? searchParams.get("title") : null;

    const isSelected = currentCategoryid === value;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value,
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url)
    }
    return (
        <button onClick={onClick} className={
            cn("py-2 px-2 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition", isSelected && "border-sky-700 bg-sky-200/20 text-sky-800")}>

            {Icon && <Icon size={20} />}
            <div className="truncate">
                {label}
            </div>
        </button>
    )
}

export default CategoryItem