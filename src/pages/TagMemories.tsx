
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useMemories } from '@/context/MemoryContext';
import MemoryCard, { Memory } from '@/components/MemoryCard';
import MemoryDialog from '@/components/MemoryDialog';
import AddMemoryDialog from '@/components/AddMemoryDialog';
import { Tag, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TagMemoriesPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const { getMemoriesByTag } = useMemories();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [memories, setMemories] = useState<Memory[]>([]);
  
  useEffect(() => {
    if (tag) {
      const tagMemories = getMemoriesByTag(tag);
      setMemories(tagMemories);
    }
  }, [tag, getMemoriesByTag]);
  
  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
  };
  
  const handleCloseDialog = () => {
    setSelectedMemory(null);
  };
  
  const handleNextMemory = () => {
    if (!selectedMemory || memories.length <= 1) return;
    
    const currentIndex = memories.findIndex(m => m.id === selectedMemory.id);
    const nextIndex = (currentIndex + 1) % memories.length;
    setSelectedMemory(memories[nextIndex]);
  };
  
  const handlePreviousMemory = () => {
    if (!selectedMemory || memories.length <= 1) return;
    
    const currentIndex = memories.findIndex(m => m.id === selectedMemory.id);
    const prevIndex = (currentIndex - 1 + memories.length) % memories.length;
    setSelectedMemory(memories[prevIndex]);
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleGoBack} 
            className="mb-2 -ml-2"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </Button>
          
          <div className="flex items-center">
            <Tag size={24} className="mr-2 text-memora-purple" />
            <h1 className="text-2xl md:text-3xl font-bold">
              {tag}
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {memories.length} {memories.length === 1 ? 'memory' : 'memories'} with this tag
          </p>
        </div>
        
        {memories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {memories.map((memory) => (
              <MemoryCard 
                key={memory.id} 
                memory={memory}
                onClick={handleMemoryClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-medium mb-2">No memories with this tag</h3>
            <p className="text-muted-foreground">
              Try browsing all memories or selecting a different tag.
            </p>
          </div>
        )}
        
        {/* Add new memory floating button */}
        <Button
          className="fixed bottom-20 right-6 sm:bottom-6 sm:right-6 rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus size={24} />
        </Button>
        
        <MemoryDialog 
          memory={selectedMemory} 
          onClose={handleCloseDialog}
          onNext={handleNextMemory}
          onPrevious={handlePreviousMemory}
        />
        
        <AddMemoryDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default TagMemoriesPage;
