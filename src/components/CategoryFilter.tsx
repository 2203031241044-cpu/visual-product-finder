import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Badge
        onClick={() => onSelectCategory(null)}
        className={cn(
          "cursor-pointer transition-all hover:scale-105",
          selectedCategory === null
            ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
      >
        All Products
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          onClick={() => onSelectCategory(category)}
          className={cn(
            "cursor-pointer transition-all hover:scale-105",
            selectedCategory === category
              ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};
