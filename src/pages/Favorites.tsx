
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import MemoryCard, { Memory } from '@/components/MemoryCard';
import MemoryDialog from '@/components/MemoryDialog';
import { useMemories } from '@/context/MemoryContext';

const FavoritesPage = () => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const { favoriteMemories } = useMemories();
  
  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
  };
  
  const handleCloseDialog = () => {
    setSelectedMemory(null);
  };
  
  const handleNextMemory = () => {
    if (!selectedMemory) return;
    
    const currentIndex = favoriteMemories.findIndex(m => m.id === selectedMemory.id);
    const nextIndex = (currentIndex + 1) % favoriteMemories.length;
    setSelectedMemory(favoriteMemories[nextIndex]);
  };
  
  const handlePreviousMemory = () => {
    if (!selectedMemory) return;
    
    const currentIndex = favoriteMemories.findIndex(m => m.id === selectedMemory.id);
    const prevIndex = (currentIndex - 1 + favoriteMemories.length) % favoriteMemories.length;
    setSelectedMemory(favoriteMemories[prevIndex]);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Favorite Memories</h1>
        </div>
        
        {favoriteMemories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteMemories.map((memory) => (
              <MemoryCard 
                key={memory.id} 
                memory={memory} 
                onClick={handleMemoryClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-medium mb-2">No favorite memories yet</h3>
            <p className="text-muted-foreground">
              Add some memories to your favorites to see them here.
            </p>
          </div>
        )}
        
        <MemoryDialog 
          memory={selectedMemory} 
          onClose={handleCloseDialog}
          onNext={handleNextMemory}
          onPrevious={handlePreviousMemory}
        />
      </div>
    </Layout>
  );
};

export default FavoritesPage;
