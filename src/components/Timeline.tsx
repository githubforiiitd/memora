
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Memory } from './MemoryCard';

interface TimelineProps {
  memories: Memory[];
  onMemoryClick: (memory: Memory) => void;
}

interface GroupedMemories {
  [key: string]: Memory[];
}

const Timeline = ({ memories, onMemoryClick }: TimelineProps) => {
  // Group memories by date (just using the date string for demo)
  const groupedMemories: GroupedMemories = memories.reduce((groups, memory) => {
    const date = memory.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(memory);
    return groups;
  }, {} as GroupedMemories);

  // Convert to array and sort by date (newest first)
  const sortedDates = Object.keys(groupedMemories).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-8 py-2">
      {sortedDates.map((date) => (
        <div key={date} className="animate-fade-in transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="timeline-dot w-3 h-3 rounded-full bg-primary" />
            <h2 className="text-lg font-medium">{date}</h2>
            <span className="text-sm text-muted-foreground">
              {getRelativeTime(date)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pl-4">
            {groupedMemories[date].map((memory, index) => (
              <div 
                key={memory.id}
                className="animate-fade-in-up transition-all duration-300 hover:transform hover:scale-105"
                onClick={() => onMemoryClick(memory)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <img 
                  src={`https://images.unsplash.com/${memory.thumbnail}`} 
                  alt={memory.title} 
                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow-md" 
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <h3 className="mt-2 text-sm font-medium">{memory.title}</h3>
                
                {/* Display colored tags */}
                {memory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {memory.tags.slice(0, 2).map((tag) => {
                      const tagColorClass = tag === 'travel' ? 'tag-travel' :
                                          tag === 'family' ? 'tag-family' :
                                          tag === 'nature' ? 'tag-nature' :
                                          tag === 'pets' ? 'tag-pets' : '';
                      return (
                        <span 
                          key={tag} 
                          className={cn("text-xs px-2 py-0.5 rounded-full", tagColorClass)}
                        >
                          {tag}
                        </span>
                      );
                    })}
                    {memory.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{memory.tags.length - 2} more</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function for class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default Timeline;
