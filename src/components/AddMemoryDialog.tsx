import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, X, ImageIcon, Upload, Tag as TagIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useMemories } from '@/context/MemoryContext';

type AddMemoryDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddMemoryDialog = ({ isOpen, onClose }: AddMemoryDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { toast } = useToast();
  const { addMemory } = useMemories();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!title) {
      toast({
        description: 'Please add a title for your memory',
        duration: 3000,
      });
      return;
    }

    if (uploadedImages.length === 0) {
      toast({
        description: 'Please upload at least one image',
        duration: 3000,
      });
      return;
    }

    const newMemory = {
      id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      date: format(date, 'yyyy-MM-dd'),
      type: 'photo' as const,
      thumbnail: uploadedImages[0],
      images: uploadedImages,
      isFavorite: false,
      isHighlighted: false,
      tags,
      location,
      description
    };

    addMemory(newMemory);
    
    toast({
      description: 'Memory created successfully!',
      duration: 3000,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate(new Date());
    setLocation('');
    setTags([]);
    setTagInput('');
    setUploadedImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const placeholderImages = [
        'https://images.unsplash.com/photo-1609921141835-710b7fa6e438?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG8lMjBhbGJ1bXxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1591715217098-98ff4daec9e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGhvdG8lMjBhbGJ1bXxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1555927073-c53562731fe0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBob3RvJTIwYWxidW18ZW58MHx8MHx8fDA%3D'
      ];
      
      setUploadedImages([...uploadedImages, ...placeholderImages.slice(0, e.target.files.length)]);
      
      toast({
        description: `${e.target.files.length} images uploaded successfully!`,
        duration: 2000,
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Memory</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your memory"
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">
              Date
            </label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => setDate(newDate || new Date())}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="location" className="text-right text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where was this memory from? (optional)"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="tags" className="text-right text-sm font-medium">
              Tags
            </label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tags (press Enter)"
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" size="sm" onClick={handleAddTag}>
                <TagIcon size={16} />
              </Button>
            </div>
          </div>
          
          {tags.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div></div>
              <div className="col-span-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div key={tag} className="flex items-center bg-secondary rounded-full px-3 py-1 text-xs">
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add an optional description for your memory"
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right text-sm font-medium">
              Images
            </label>
            <div className="col-span-3">
              <label htmlFor="image-upload" className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="image-upload" className="relative cursor-pointer rounded-md font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary">
                      <span>Upload images</span>
                      <Input 
                        id="image-upload" 
                        type="file" 
                        className="sr-only" 
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </label>
              
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group aspect-video">
                      <img 
                        src={img} 
                        className="w-full h-full object-cover rounded-md"
                        alt={`Uploaded ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetForm}
          >
            Reset
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Create Memory
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemoryDialog;
