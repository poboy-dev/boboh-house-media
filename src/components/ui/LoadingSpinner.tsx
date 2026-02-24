import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    size?: number;
    className?: string;
}

export const LoadingSpinner = ({ size = 32, className }: LoadingSpinnerProps) => {
    return (
        <div className="flex justify-center items-center p-4">
            <Loader2
                className={cn("animate-spin text-primary", className)}
                size={size}
            />
        </div>
    );
};
