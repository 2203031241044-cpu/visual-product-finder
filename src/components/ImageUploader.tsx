import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isLoading?: boolean;
}

export const ImageUploader = ({ onImageSelect, isLoading }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clearImage = useCallback(() => {
    setPreview(null);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!preview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
            isDragging ? "border-primary bg-primary/5 scale-105" : "border-border hover:border-primary/50",
            "cursor-pointer group"
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            id="image-upload"
            disabled={isLoading}
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary to-accent transition-transform group-hover:scale-110">
                <Upload className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground mb-1">
                  Drop your product image here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse from your device
                </p>
              </div>
              <Button type="button" variant="secondary" className="mt-2">
                Choose Image
              </Button>
            </div>
          </label>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden bg-card border border-border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-96 object-contain"
          />
          <Button
            onClick={clearImage}
            size="icon"
            variant="destructive"
            className="absolute top-4 right-4 rounded-full shadow-lg"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};