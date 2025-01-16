"use client"

import { useEffect, useState } from "react"
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd";

import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge"


function ChapterList({ items, onReorder, onEdit }) {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const item = Array.from(chapters);
        const [reorderedItem] = item.splice(result.source.index, 1);
        item.splice(result.destination.index, 0, reorderedItem);


        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updaateChapters = item.slice(startIndex, endIndex + 1);

        setChapters(item);

        const bulkUpdateData = updaateChapters.map((chapter) => ({
            id: chapter.id,
            position: item.findIndex((item) => item.id === chapter.id)
        }))

        onReorder(bulkUpdateData);
    }

    if (!isMounted) return null;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) =>
                (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {chapters.map((chapter, index) => (
                            <Draggable
                                key={chapter.id}
                                draggableId={chapter.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div className={cn(
                                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm", chapter.iaPublished && "bg-sky-100 border-sky-200 text-sky-700"
                                    )}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div className={cn(
                                            "p-2 pr-3 border-r  border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                            chapter.iaPublished && "border-r-sky-200 hover:bg-sky-200"
                                        )}
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip className="h-5 w-5" />
                                        </div>
                                        {chapter.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            {chapter.isFree && (
                                                <Badge>
                                                    Free
                                                </Badge>
                                            )}
                                            <Badge
                                                className={cn("bg-slate-500", chapter.isPublished && "bg-sky-700")}
                                            >
                                                {chapter.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                            <Pencil
                                                onClick={() => onEdit(chapter.id)}
                                                className="h-4 w-4 cursor-pointer hover:opacity-75 transition"
                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )
                }
            </Droppable>
        </DragDropContext>
    )
}

export default ChapterList