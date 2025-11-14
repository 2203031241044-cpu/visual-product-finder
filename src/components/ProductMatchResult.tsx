import { ExternalLink, Package, DollarSign, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image_url: string;
  product_url: string;
}

interface ProductMatchResultProps {
  product: Product;
  similarityScore: number;
  reason: string;
}

export const ProductMatchResult = ({ product, similarityScore, reason }: ProductMatchResultProps) => {
  const scorePercentage = Math.round(similarityScore * 100);
  
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-400";
    if (score >= 0.6) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Best Match Found!
        </h2>
        <div className="flex items-center justify-center gap-2">
          <span className="text-muted-foreground">Similarity Score:</span>
          <span className={`text-2xl font-bold ${getScoreColor(similarityScore)}`}>
            {scorePercentage}%
          </span>
        </div>
      </div>

      <Card className="overflow-hidden border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.1)]">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative bg-muted/50 flex items-center justify-center p-8">
              <img
                src={product.image_url}
                alt={product.name}
                className="max-h-80 w-auto object-contain rounded-lg"
              />
            </div>

            {/* Details Section */}
            <div className="p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-3">
                    <Tag className="h-3 w-3 mr-1" />
                    {product.category}
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  <span className="text-3xl font-bold text-foreground">
                    ${product.price.toLocaleString()}
                  </span>
                </div>

                <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Why this match?
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {reason}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};