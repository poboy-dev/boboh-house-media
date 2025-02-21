
import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";

interface ImagePickerProps {
  onChange: (file: File) => void;
  value?: string;
  onRemove?: () => void;
  loading?: boolean;
  className?: string;
}

export function ImagePicker({
  onChange,
  value,
  onRemove,
  loading = false,
  className,
}: ImagePickerProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onChange(file);
      }
    },
    [onChange]
  );

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div className="flex items-center justify-center w-full">
        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full"
            />
            {onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={onRemove}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-gray-400 transition-colors">
            <ImagePlus className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Add Image</span>
            <input
              type="file"
              className="hidden"
              onChange={handleChange}
              accept="image/*"
            />
          </label>
        )}
      </div>
      {loading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
