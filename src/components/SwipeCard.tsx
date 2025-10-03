import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type ContentType = "movie" | "series" | "cartoon" | "anime";
export type Category = "watching" | "on-hold" | "plan-to-watch" | "dropped" | "completed";

export interface ContentItem {
  id: string;
  title: string;
  poster: string;
  type: ContentType;
}

interface SwipeCardProps {
  content: ContentItem;
  onSwipe: (direction: "left" | "right", category: Category) => void;
  style?: React.CSSProperties;
}

const SwipeCard = ({ content, onSwipe, style }: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  const getCategoryFromSwipe = (direction: "left" | "right"): Category => {
    // Simple logic: right = plan-to-watch, left = dropped
    return direction === "right" ? "plan-to-watch" : "dropped";
  };

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPosRef.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - startPosRef.current.x;
    const deltaY = clientY - startPosRef.current.y;
    const rotation = deltaX * 0.1;

    setPosition({ x: deltaX, y: deltaY });
    setRotation(rotation);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    if (Math.abs(position.x) > threshold) {
      const direction = position.x > 0 ? "right" : "left";
      const category = getCategoryFromSwipe(direction);
      onSwipe(direction, category);
    } else {
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, position]);

  const getSwipeFeedback = () => {
    if (position.x > 50) return "text-plan-to-watch";
    if (position.x < -50) return "text-dropped";
    return "";
  };

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none select-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        transition: isDragging ? "none" : "transform 0.3s ease-out",
        zIndex: 10,
        ...style,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <Card className="relative h-full w-full overflow-hidden border-2 border-border bg-card shadow-2xl">
        <img
          src={content.poster}
          alt={content.title}
          className="h-full w-full object-cover"
          draggable="false"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Badge className="mb-3 bg-primary/20 text-primary-foreground border-primary">
            {content.type}
          </Badge>
          <h2 className={`text-3xl font-bold text-foreground transition-colors ${getSwipeFeedback()}`}>
            {content.title}
          </h2>
        </div>

        {/* Swipe indicators */}
        {position.x > 50 && (
          <div className="absolute top-8 right-8 rotate-12">
            <Badge className="bg-plan-to-watch/90 text-white text-xl px-6 py-2 border-2 border-white">
              WATCH
            </Badge>
          </div>
        )}
        {position.x < -50 && (
          <div className="absolute top-8 left-8 -rotate-12">
            <Badge className="bg-dropped/90 text-white text-xl px-6 py-2 border-2 border-white">
              SKIP
            </Badge>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SwipeCard;
