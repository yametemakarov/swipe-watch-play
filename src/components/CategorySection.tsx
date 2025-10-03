import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentItem, Category } from "./SwipeCard";

interface CategorySectionProps {
  category: Category;
  items: ContentItem[];
}

const categoryConfig: Record<Category, { label: string; color: string }> = {
  watching: { label: "Watching", color: "bg-watching" },
  "on-hold": { label: "On Hold", color: "bg-on-hold" },
  "plan-to-watch": { label: "Plan to Watch", color: "bg-plan-to-watch" },
  dropped: { label: "Dropped", color: "bg-dropped" },
  completed: { label: "Completed", color: "bg-completed" },
};

const CategorySection = ({ category, items }: CategorySectionProps) => {
  const config = categoryConfig[category];

  if (items.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-2 h-8 rounded-full ${config.color}`} />
        <h3 className="text-2xl font-bold text-foreground">{config.label}</h3>
        <Badge variant="secondary" className="ml-2">
          {items.length}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="group relative overflow-hidden border-border bg-card hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <div className="aspect-[2/3]">
              <img
                src={item.poster}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-sm font-semibold text-foreground line-clamp-2">
                {item.title}
              </p>
              <Badge className="mt-2 text-xs" variant="secondary">
                {item.type}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
