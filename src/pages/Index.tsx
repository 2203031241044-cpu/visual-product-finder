import { useState, useMemo } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ProductMatchResult } from "@/components/ProductMatchResult";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Sparkles, Search, Package } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import productsData from "@/data/products.json";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image_url: string;
  product_url: string;
}

interface MatchResult {
  product: Product;
  similarity_score: number;
  reason: string;
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(productsData.map(p => p.category))];
    return uniqueCategories.sort();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return productsData;
    return productsData.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setMatchResult(null);
  };

  const handleFindMatch = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    setIsMatching(true);
    setMatchResult(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const { data, error } = await supabase.functions.invoke('match-product', {
          body: { image: base64Image }
        });

        if (error) {
          console.error('Error matching product:', error);
          toast.error("Failed to match product. Please try again.");
          return;
        }

        if (data && data.product) {
          setMatchResult(data);
          toast.success("Match found!");
        } else {
          toast.error("No match found. Please try another image.");
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read image file");
      };
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred while matching");
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(138,75,175,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,208,232,0.1),transparent_50%)]" />
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by Gemini 2.0 Flash</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
              AI Visual Product Matcher
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
              Upload any product image and let AI find the closest match from our curated collection
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <ImageUploader onImageSelect={handleImageSelect} isLoading={isMatching} />
            
            {selectedFile && !matchResult && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleFindMatch}
                  disabled={isMatching}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg"
                >
                  {isMatching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Find Best Match
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Results Section */}
          {matchResult && (
            <div className="mb-12">
              <ProductMatchResult
                product={matchResult.product}
                similarityScore={matchResult.similarity_score}
                reason={matchResult.reason}
              />
              
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => {
                    setMatchResult(null);
                    setSelectedFile(null);
                  }}
                  variant="outline"
                >
                  Try Another Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Browser Section */}
      <div className="container mx-auto px-4 py-16 border-t border-border">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Package className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Browse Collection</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Explore Products by Category
          </h2>
          <p className="text-muted-foreground mb-6">
            Browse our curated collection of {productsData.length} products across {categories.length} categories
          </p>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 border-t border-border">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
            <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">
              Advanced vision AI analyzes your image for accurate product matching
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
            <div className="inline-flex p-3 rounded-full bg-accent/10 mb-4">
              <Search className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Smart Matching</h3>
            <p className="text-sm text-muted-foreground">
              Compares against 50+ products to find your perfect match
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
            <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Instant Results</h3>
            <p className="text-sm text-muted-foreground">
              Get detailed match results with similarity scores in seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;