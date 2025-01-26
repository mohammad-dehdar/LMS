"use client"

import CategoryItem from "./CategoryItem"


import {
    FcEngineering,
    FcFilmReel,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode,
} from "react-icons/fc"

const iconMap = {
    "Music": FcMusic,
    "Photography" : FcOldTimeCamera,
    "Fitness" : FcSportsMode,
    "Accounting" : FcSalesPerformance,
    "Computer Scients" : FcMultipleDevices,
    "Filming" : FcFilmReel,
    "Engineering" : FcEngineering  
}

function Categories({items}) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
        {items.map((item) => (
            <CategoryItem key={item.id} label={item.name} icon={iconMap[item.name]} value={item.id}/>
        ))}

    </div>
  )
}

export default Categories