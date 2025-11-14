import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image_url: string;
  product_url: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]">
      <CardContent className="p-0">
        <div className="relative aspect-square bg-muted/50 overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">
            {product.category}
          </Badge>
        </div>
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-accent font-bold text-xl">
            <DollarSign className="h-5 w-5" />
            <span>{product.price.toLocaleString()}</span>
          </div>
          <Button
            asChild
            variant="outline"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Product
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
