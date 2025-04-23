
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Memory } from './MemoryCard';
import { X, Star, Video, Image, MapPin, ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useMemories } from '@/context/MemoryContext';

interface MemoryDialogProps {
  memory: Memory | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const MemoryDialog = ({ memory, onClose, onNext, onPrevious }: MemoryDialogProps) => {
  const { toast } = useToast();
  const { toggleFavorite, toggleHighlight } = useMemories();
  
  if (!memory) return null;
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(memory.id);
    toast({
      description: `${memory.title} ${memory.isFavorite ? 'removed from' : 'added to'} favorites`,
      duration: 1500,
    });
  };

  const handleToggleHighlight = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHighlight(memory.id);
    toast({
      description: `${memory.title} ${memory.isHighlighted ? 'removed from' : 'added to'} highlights`,
      duration: 1500,
    });
  };
  
  return (
    <Dialog open={!!memory} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-heading">{memory.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 mt-2">
          {/* Media */}
          <div className="relative aspect-video bg-black rounded-md overflow-hidden">
            <img 
              src={`https://images.unsplash.com/${memory.thumbnail}`} 
              alt={memory.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            
            {/* Type indicator */}
            <div className="absolute top-3 left-3 bg-black/40 text-white p-1 rounded-md backdrop-blur-sm">
              {memory.type === 'video' ? (
                <Video size={18} />
              ) : (
                <Image size={18} />
              )}
            </div>
            
            {/* Navigation buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40 ml-2 transition-colors"
                onClick={onPrevious}
              >
                <ArrowLeft size={20} />
              </Button>
            </div>
            
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40 mr-2 transition-colors"
                onClick={onNext}
              >
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
          
          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="bg-secondary/80 px-3 py-1 rounded-full">{memory.date}</span>
                {memory.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {memory.location}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleToggleFavorite}
                  className={cn(
                    "gap-1 transition-all duration-300 hover:scale-105",
                    memory.isFavorite && "text-red-500 bg-red-50 dark:bg-red-950/30 border-red-200"
                  )}
                >
                  <Heart size={16} className="transition-transform hover:scale-110" fill={memory.isFavorite ? "currentColor" : "none"} />
                  <span>{memory.isFavorite ? "Favorited" : "Add to favorites"}</span>
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleToggleHighlight}
                  className={cn(
                    "gap-1 transition-all duration-300 hover:scale-105",
                    memory.isHighlighted && "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200"
                  )}
                >
                  <Star size={16} className="transition-transform hover:scale-110" fill={memory.isHighlighted ? "currentColor" : "none"} />
                  <span>{memory.isHighlighted ? "Highlighted" : "Add to highlights"}</span>
                </Button>
              </div>
            </div>
            
            {/* Description */}
            {memory.description && (
              <div className="mt-2 text-foreground/90">
                <p>{memory.description}</p>
              </div>
            )}
            
            {/* Tags */}
            {memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {memory.tags.map((tag) => {
                  let tagColor;
                  
                  switch(tag) {
                    case 'travel':
                      tagColor = 'bg-blue-100 text-blue-800 border-blue-200';
                      break;
                    case 'family':
                      tagColor = 'bg-orange-100 text-orange-800 border-orange-200';
                      break;
                    case 'nature':
                      tagColor = 'bg-green-100 text-green-800 border-green-200';
                      break;
                    case 'pets':
                      tagColor = 'bg-pink-100 text-pink-800 border-pink-200';
                      break;
                    default:
                      tagColor = 'bg-secondary text-secondary-foreground';
                  }
                  
                  return (
                    <span 
                      key={tag} 
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        tagColor
                      )}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemoryDialog;
