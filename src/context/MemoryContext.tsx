import React, { createContext, useContext, useState } from 'react';
import { Memory } from '@/components/MemoryCard';
import { useToast } from '@/hooks/use-toast';

const initialMemories: Memory[] = [
  {
    id: "1",
    title: "Garden Flowers in Bloom",
    date: "2025-04-15",
    type: "photo",
    thumbnail: "photo-1465146344425-f00d5f5c8f07",
    isFavorite: false,
    tags: ["garden", "spring", "flowers"],
    location: "Home Garden"
  },
  {
    id: "2",
    title: "Mountain Lake View",
    date: "2025-05-20",
    type: "photo",
    thumbnail: "photo-1506744038136-46273834b3fb",
    isFavorite: true,
    tags: ["nature", "lake", "mountains"],
    location: "Alpine Lake"
  },
  {
    id: "3",
    title: "New Kitten",
    date: "2025-06-10",
    type: "photo",
    thumbnail: "photo-1535268647677-300dbf3d78d1",
    isFavorite: false,
    tags: ["pets", "kitten", "family"],
    location: "Living Room"
  },
  {
    id: "4",
    title: "Wildlife Encounter",
    date: "2025-07-05",
    type: "photo",
    thumbnail: "photo-1472396961693-142e6e269027",
    isFavorite: false,
    tags: ["wildlife", "nature", "deer"],
    location: "National Park"
  },
  {
    id: "5",
    title: "Safari Adventure",
    date: "2025-08-15",
    type: "photo",
    thumbnail: "photo-1466721591366-2d5fba72006d",
    isFavorite: true,
    tags: ["safari", "wildlife", "adventure"],
    location: "Safari Park"
  },
  {
    id: "6",
    title: "Mountain Sunrise",
    date: "2025-09-01",
    type: "photo",
    thumbnail: "photo-1469474968028-56623f02e42e",
    isFavorite: false,
    tags: ["nature", "sunrise", "mountains"],
    location: "Mountain Peak"
  },
  {
    id: "7",
    title: "Ocean Waves",
    date: "2025-10-12",
    type: "photo",
    thumbnail: "photo-1500375592092-40eb2168fd21",
    isFavorite: false,
    tags: ["ocean", "waves", "beach"],
    location: "Coastal Beach"
  },
  {
    id: "8",
    title: "Forest Path",
    date: "2025-11-25",
    type: "photo",
    thumbnail: "photo-1523712999610-f77fbcfc3843",
    isFavorite: false,
    tags: ["forest", "nature", "hiking"],
    location: "National Forest"
  }
];

interface MemoryContextType {
  memories: Memory[];
  favoriteMemories: Memory[];
  highlightedMemories: Memory[];
  deletedMemories: Memory[];
  toggleFavorite: (id: string) => void;
  toggleHighlight: (id: string) => void;
  deleteMemory: (id: string) => void;
  restoreMemory: (id: string) => void;
  permanentlyDeleteMemory: (id: string) => void;
  getMemoriesByTag: (tag: string) => Memory[];
  getMemoriesByDate: (date: string) => Memory[];
  addMemory: (memory: Memory) => void;
  updateMemory: (updatedMemory: Memory) => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [deletedMemories, setDeletedMemories] = useState<Memory[]>([]);
  const { toast } = useToast();
  
  const favoriteMemories = memories.filter(memory => memory.isFavorite);
  const highlightedMemories = memories.filter(memory => memory.isHighlighted);
  
  const toggleFavorite = (id: string) => {
    setMemories(prevMemories => 
      prevMemories.map(memory => 
        memory.id === id 
          ? { ...memory, isFavorite: !memory.isFavorite } 
          : memory
      )
    );
  };
  
  const toggleHighlight = (id: string) => {
    setMemories(prevMemories => 
      prevMemories.map(memory => 
        memory.id === id 
          ? { ...memory, isHighlighted: !memory.isHighlighted } 
          : memory
      )
    );
  };
  
  const deleteMemory = (id: string) => {
    const memoryToDelete = memories.find(memory => memory.id === id);
    
    if (memoryToDelete) {
      setMemories(prevMemories => prevMemories.filter(memory => memory.id !== id));
      setDeletedMemories(prevDeleted => [...prevDeleted, memoryToDelete]);
      
      toast({
        description: "Memory moved to Recently Deleted",
        duration: 3000,
      });
    }
  };
  
  const restoreMemory = (id: string) => {
    const memoryToRestore = deletedMemories.find(memory => memory.id === id);
    
    if (memoryToRestore) {
      setDeletedMemories(prevDeleted => prevDeleted.filter(memory => memory.id !== id));
      setMemories(prevMemories => [...prevMemories, memoryToRestore]);
      
      toast({
        description: "Memory restored successfully",
        duration: 3000,
      });
    }
  };
  
  const permanentlyDeleteMemory = (id: string) => {
    setDeletedMemories(prevDeleted => prevDeleted.filter(memory => memory.id !== id));
    
    toast({
      description: "Memory permanently deleted",
      duration: 3000,
    });
  };
  
  const getMemoriesByTag = (tag: string) => {
    return memories.filter(memory => 
      memory.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  };
  
  const getMemoriesByDate = (date: string) => {
    return memories.filter(memory => memory.date === date);
  };
  
  const addMemory = (memory: Memory) => {
    setMemories(prevMemories => [memory, ...prevMemories]);
  };

  const updateMemory = (updatedMemory: Memory) => {
    setMemories(prevMemories => 
      prevMemories.map(memory => 
        memory.id === updatedMemory.id ? updatedMemory : memory
      )
    );
  };

  return (
    <MemoryContext.Provider value={{ 
      memories, 
      favoriteMemories, 
      highlightedMemories,
      deletedMemories,
      toggleFavorite, 
      toggleHighlight,
      deleteMemory,
      restoreMemory,
      permanentlyDeleteMemory,
      getMemoriesByTag,
      getMemoriesByDate,
      addMemory,
      updateMemory
    }}>
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemories = () => {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error('useMemories must be used within a MemoryProvider');
  }
  return context;
};
