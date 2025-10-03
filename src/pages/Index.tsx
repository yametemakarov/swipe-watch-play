import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SwipeCard, { ContentItem, Category } from "@/components/SwipeCard";
import CategorySection from "@/components/CategorySection";
import { sampleContent } from "@/data/sampleContent";
import { Undo2, Sparkles, List } from "lucide-react";
import { toast } from "sonner";

interface CategorizedContent {
  watching: ContentItem[];
  "on-hold": ContentItem[];
  "plan-to-watch": ContentItem[];
  dropped: ContentItem[];
  completed: ContentItem[];
}

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledContent, setShuffledContent] = useState<ContentItem[]>([]);
  const [categorizedContent, setCategorizedContent] = useState<CategorizedContent>({
    watching: [],
    "on-hold": [],
    "plan-to-watch": [],
    dropped: [],
    completed: [],
  });
  const [lastAction, setLastAction] = useState<{ item: ContentItem; category: Category } | null>(null);
  const [activeTab, setActiveTab] = useState<"swipe" | "list">("swipe");

  useEffect(() => {
    // Shuffle content on mount
    const shuffled = [...sampleContent].sort(() => Math.random() - 0.5);
    setShuffledContent(shuffled);
  }, []);

  const handleSwipe = (direction: "left" | "right", category: Category) => {
    const currentItem = shuffledContent[currentIndex];
    
    setCategorizedContent((prev) => ({
      ...prev,
      [category]: [...prev[category], currentItem],
    }));

    setLastAction({ item: currentItem, category });
    setCurrentIndex((prev) => prev + 1);

    const categoryLabels: Record<Category, string> = {
      watching: "Watching",
      "on-hold": "On Hold",
      "plan-to-watch": "Plan to Watch",
      dropped: "Dropped",
      completed: "Completed",
    };

    toast.success(`Added to ${categoryLabels[category]}`, {
      description: currentItem.title,
    });

    // Check if we've gone through all content
    if (currentIndex + 1 >= shuffledContent.length) {
      toast.info("You've reviewed all content!", {
        description: "Check your watchlist to see what you've added.",
      });
    }
  };

  const handleUndo = () => {
    if (!lastAction) {
      toast.error("Nothing to undo");
      return;
    }

    setCategorizedContent((prev) => ({
      ...prev,
      [lastAction.category]: prev[lastAction.category].filter(
        (item) => item.id !== lastAction.item.id
      ),
    }));

    setCurrentIndex((prev) => prev - 1);
    setLastAction(null);
    toast.success("Action undone");
  };

  const currentContent = shuffledContent[currentIndex];
  const hasMoreContent = currentIndex < shuffledContent.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative border-b border-border bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 text-4xl font-bold text-foreground md:text-5xl">
            Swipe Watchlist
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover, swipe, organize. Your entertainment at your fingertips.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "swipe" | "list")} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="swipe" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              My Watchlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="swipe" className="mt-0">
            <div className="mx-auto max-w-md">
              {hasMoreContent ? (
                <>
                  <div className="relative mb-6 aspect-[2/3] animate-fade-in">
                    {currentContent && (
                      <SwipeCard
                        key={currentContent.id}
                        content={currentContent}
                        onSwipe={handleSwipe}
                      />
                    )}
                    
                    {/* Next card preview */}
                    {currentIndex + 1 < shuffledContent.length && (
                      <div
                        className="absolute inset-0 -z-10"
                        style={{
                          transform: "scale(0.95) translateY(20px)",
                          opacity: 0.5,
                        }}
                      >
                        <div className="h-full w-full rounded-xl border-2 border-border bg-card shadow-xl" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleUndo}
                      disabled={!lastAction}
                      className="gap-2"
                    >
                      <Undo2 className="h-5 w-5" />
                      Undo
                    </Button>
                    <div className="text-muted-foreground">
                      {currentIndex + 1} / {shuffledContent.length}
                    </div>
                  </div>

                  <div className="mt-8 rounded-lg border border-border bg-card/50 p-4">
                    <p className="text-center text-sm text-muted-foreground">
                      <strong className="text-foreground">Tip:</strong> Swipe right to add to your watchlist, swipe left to skip
                    </p>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-border bg-card p-12 text-center">
                  <Sparkles className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-2xl font-bold text-foreground">
                    All caught up!
                  </h3>
                  <p className="text-muted-foreground">
                    You've reviewed all available content. Check out your watchlist!
                  </p>
                  <Button
                    className="mt-6"
                    onClick={() => setActiveTab("list")}
                  >
                    View Watchlist
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="space-y-8">
              {Object.entries(categorizedContent).every(([_, items]) => items.length === 0) ? (
                <div className="rounded-lg border border-border bg-card p-12 text-center">
                  <List className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-2xl font-bold text-foreground">
                    Your watchlist is empty
                  </h3>
                  <p className="text-muted-foreground">
                    Start swiping to add content to your watchlist!
                  </p>
                  <Button
                    className="mt-6"
                    onClick={() => setActiveTab("swipe")}
                  >
                    Start Discovering
                  </Button>
                </div>
              ) : (
                <>
                  <CategorySection category="watching" items={categorizedContent.watching} />
                  <CategorySection category="plan-to-watch" items={categorizedContent["plan-to-watch"]} />
                  <CategorySection category="on-hold" items={categorizedContent["on-hold"]} />
                  <CategorySection category="completed" items={categorizedContent.completed} />
                  <CategorySection category="dropped" items={categorizedContent.dropped} />
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
