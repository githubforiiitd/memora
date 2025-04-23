
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import MemoryCard, { Memory } from '@/components/MemoryCard';
import MemoryDialog from '@/components/MemoryDialog';
import { Award, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMemories } from '@/context/MemoryContext';

const HighlightsPage = () => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { highlightedMemories } = useMemories();
  
  // Filter memories based on search term
  const filteredMemories = highlightedMemories.filter(memory => 
    memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (memory.location && memory.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
  };
  
  const handleCloseDialog = () => {
    setSelectedMemory(null);
  };
  
  const handleNextMemory = () => {
    if (!selectedMemory) return;
    
    const currentIndex = filteredMemories.findIndex(m => m.id === selectedMemory.id);
    const nextIndex = (currentIndex + 1) % filteredMemories.length;
    setSelectedMemory(filteredMemories[nextIndex]);
  };
  
  const handlePreviousMemory = () => {
    if (!selectedMemory) return;
    
    const currentIndex = filteredMemories.findIndex(m => m.id === selectedMemory.id);
    const prevIndex = (currentIndex - 1 + filteredMemories.length) % filteredMemories.length;
    setSelectedMemory(filteredMemories[prevIndex]);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Memory Highlights</h1>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search highlights..."
              className="pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Award size={20} className="text-memora-purple" />
            <span>Special Moments</span>
          </h2>
          <button className="flex items-center gap-2 text-sm bg-secondary/50 px-3 py-1.5 rounded-md">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
        
        {filteredMemories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMemories.map((memory) => (
              <MemoryCard 
                key={memory.id} 
                memory={memory} 
                onClick={handleMemoryClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-medium mb-2">No highlights yet</h3>
            <p className="text-muted-foreground">
              Add highlights to your special memories.
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

export default HighlightsPage;
