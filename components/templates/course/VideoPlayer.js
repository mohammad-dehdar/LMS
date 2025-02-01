"use client"

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";


function VideoPlayer({
    playbackId,
    courseId,
    chapterId,
    nextChapterId,
    isLocked,
    completeOnEnd,
    title,
}) {
    const [isReady, setIsReady] = useState(false);

    return (
        <div className="relative aspect-video w-full">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 w-full">
                    <Loader2 className="h-12 w-12 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary w-full">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">This chapter is Locked</p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                    title={title}
                    className="w-full h-full"
                    onCanPlay={() => setIsReady(true)}
                    onLoadedData={() => setIsReady(true)}
                    onPlay={() => setIsReady(true)}
                    onEnded={() => {}}
                    autoPlay
                    playbackId={playbackId}
                />
            )}
        </div>
    );
}


export default VideoPlayer
