import React, { useState, useEffect, useRef } from 'react';
import { Star, Calendar, MoreHorizontal, Heart, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useMemories } from '@/context/MemoryContext';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import EditMemoryDialog from './EditMemoryDialog';

export type Memory = {
  id: string;
  title: string;
  date: string;
  type: 'photo' | 'video';
  thumbnail: string;
  isFavorite: boolean;
  isHighlighted?: boolean;
  tags: string[];
  location?: string;
  description?: string;
};

interface MemoryCardProps {
  memory: Memory;
  onClick?: (memory: Memory) => void;
  index?: number;
}

const MemoryCard = ({ memory, onClick, index = 0 }: MemoryCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const { toggleFavorite, toggleHighlight, deleteMemory } = useMemories();
  const navigate = useNavigate();

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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMemory(memory.id);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    navigate(`/tag/${tag}`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <>
      <div 
        ref={cardRef}
        className={cn(
          "memory-card",
          isVisible && "visible",
          "transform transition-all duration-300 hover:translate-y-[-4px]"
        )}
        onClick={() => onClick?.(memory)}
        style={{
          transitionDelay: `${index * 100}ms`,
        }}
      >
        <div className="relative group">
          <span className="memory-date-badge">
            <Calendar className="w-3 h-3 inline-block mr-1" />
            {memory.date}
          </span>
          <img 
            src={`https://images.unsplash.com/${memory.thumbnail}`}
            alt={memory.title}
            className="memory-image transition-transform duration-300 group-hover:scale-[1.02]"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 backdrop-blur-sm transition-all hover:bg-background hover:shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-40 dropdown-menu-content" 
              sideOffset={5}
              align="end"
            >
              <DropdownMenuItem 
                onClick={handleToggleFavorite}
                className="transition-colors hover:bg-red-50"
              >
                <Heart className={cn(
                  "mr-2 h-4 w-4 transition-transform hover:scale-110", 
                  memory.isFavorite && "fill-current text-red-500"
                )} />
                {memory.isFavorite ? 'Remove Favorite' : 'Add Favorite'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleToggleHighlight}
                className="transition-colors hover:bg-yellow-50"
              >
                <Star className={cn(
                  "mr-2 h-4 w-4 transition-transform hover:scale-110",
                  memory.isHighlighted && "fill-current text-yellow-500"
                )} />
                {memory.isHighlighted ? 'Remove Highlight' : 'Add Highlight'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleEdit}
                className="transition-colors hover:bg-secondary/80"
              >
                <Edit className="mr-2 h-4 w-4 transition-transform hover:scale-110" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete} 
                className="text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4 transition-transform hover:scale-110" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <h3 className="memory-title transition-colors hover:text-primary">
          {memory.title}
        </h3>
        
        {memory.tags.length > 0 && (
          <div className="memory-tags">
            {memory.tags.map((tag, i) => {
              const tagColorClass = tag === 'travel' ? 'tag-travel' :
                                  tag === 'family' ? 'tag-family' :
                                  tag === 'nature' ? 'tag-nature' :
                                  tag === 'pets' ? 'tag-pets' : '';
              
              return (
                <span 
                  key={tag} 
                  className={cn(
                    "memory-tag cursor-pointer",
                    tagColorClass,
                    "hover:opacity-80 transition-opacity"
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={(e) => handleTagClick(e, tag)}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <EditMemoryDialog 
        memory={isEditDialogOpen ? memory : null}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
};

export default MemoryCard;
