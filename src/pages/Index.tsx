
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import MemoryCard, { Memory } from '@/components/MemoryCard';
import MemoryDialog from '@/components/MemoryDialog';
import AddMemoryDialog from '@/components/AddMemoryDialog';
import Timeline from '@/components/Timeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ArrowUpZA, ArrowDownAZ } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMemories } from '@/context/MemoryContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Home = () => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'more-images' | 'less-images'>('newest');
  const { toast } = useToast();
  const { memories } = useMemories();
  
  // Filter memories based on search query
  const filteredMemories = memories.filter(memory => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      memory.title.toLowerCase().includes(query) ||
      memory.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (memory.location && memory.location.toLowerCase().includes(query))
    );
  });

  // Sort memories based on selected order
  const sortedMemories = [...filteredMemories].sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'more-images':
        // For demo purposes, using the tags length as a proxy for number of images
        return b.tags.length - a.tags.length;
      case 'less-images':
        // For demo purposes, using the tags length as a proxy for number of images
        return a.tags.length - b.tags.length;
      default:
        return 0;
    }
  });
  
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Your Memories</h1>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {sortOrder === 'newest' || sortOrder === 'oldest' ? (
                    <ArrowDownAZ className="h-4 w-4" />
                  ) : (
                    <ArrowUpZA className="h-4 w-4" />
                  )}
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setSortOrder('newest')}>
                  Newest to Oldest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                  Oldest to Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('more-images')}>
                  Most to Least Images
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('less-images')}>
                  Least to Most Images
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search memories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            {/* View mode tabs */}
            <Tabs defaultValue="grid" onValueChange={(v) => setViewMode(v as 'grid' | 'timeline')}>
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {sortedMemories.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedMemories.map((memory) => (
                <MemoryCard 
                  key={memory.id} 
                  memory={memory} 
                  onClick={handleMemoryClick}
                />
              ))}
            </div>
          ) : (
            <Timeline 
              memories={sortedMemories} 
              onMemoryClick={handleMemoryClick}
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-medium mb-2">No memories found</h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? "Try different search terms or clear your search"
                : "Start by creating your first memory"}
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
        
        {/* Add new memory floating button */}
        <Button
          className="fixed bottom-20 right-6 sm:bottom-6 sm:right-6 rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus size={24} />
        </Button>
        
        {/* Memory dialogs */}
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

export default Home;
