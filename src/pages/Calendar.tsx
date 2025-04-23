
import React, { useState } from 'react';
import { format, parse } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { Calendar } from '@/components/ui/calendar';
import MemoryCard, { Memory } from '@/components/MemoryCard';
import MemoryDialog from '@/components/MemoryDialog';
import { useMemories } from '@/context/MemoryContext';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import AddMemoryDialog from '@/components/AddMemoryDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(new Date());
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const { memories, getMemoriesByDate } = useMemories();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [jumpToDateInput, setJumpToDateInput] = useState('');
  const isMobile = useIsMobile();
  
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const memoriesForSelectedDate = getMemoriesByDate(selectedDateStr);
  
  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
  };
  
  const handleCloseDialog = () => {
    setSelectedMemory(null);
  };
  
  const handleNextMemory = () => {
    if (!selectedMemory) return;
    
    const currentIndex = memoriesForSelectedDate.findIndex(m => m.id === selectedMemory.id);
    const nextIndex = (currentIndex + 1) % memoriesForSelectedDate.length;
    setSelectedMemory(memoriesForSelectedDate[nextIndex]);
  };
  
  const handlePreviousMemory = () => {
    if (!selectedMemory) return;
    
    const currentIndex = memoriesForSelectedDate.findIndex(m => m.id === selectedMemory.id);
    const prevIndex = (currentIndex - 1 + memoriesForSelectedDate.length) % memoriesForSelectedDate.length;
    setSelectedMemory(memoriesForSelectedDate[prevIndex]);
  };

  const hasMemoriesOnDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return memories.some(memory => memory.date === dateStr);
  };
  
  const getMemoriesForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return getMemoriesByDate(dateStr);
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setCalendarMonth(date); // Update calendar view when selecting a date
    
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dateMemories = getMemoriesByDate(dateStr);
      if (dateMemories.length > 0) {
        setSelectedMemory(dateMemories[0]);
      } else {
        setSelectedMemory(null);
      }
    }
  };

  const jumpToDate = () => {
    if (jumpToDateInput) {
      try {
        const date = parse(jumpToDateInput, 'yyyy-MM-dd', new Date());
        setSelectedDate(date);
        setCalendarMonth(date); // Update calendar view when jumping to a date
        
        const dateStr = format(date, 'yyyy-MM-dd');
        const dateMemories = getMemoriesByDate(dateStr);
        if (dateMemories.length > 0) {
          setSelectedMemory(dateMemories[0]);
        } else {
          setSelectedMemory(null);
        }
      } catch (error) {
        console.error('Invalid date format. Please use YYYY-MM-DD', error);
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (calendarMonth) {
      const newDate = new Date(calendarMonth);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      setCalendarMonth(newDate);
      setSelectedDate(newDate); // Also update selected date to match the calendar view
    }
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCalendarMonth(today); // Update calendar view to show current month
    
    const dateStr = format(today, 'yyyy-MM-dd');
    const dateMemories = getMemoriesByDate(dateStr);
    if (dateMemories.length > 0) {
      setSelectedMemory(dateMemories[0]);
    } else {
      setSelectedMemory(null);
    }
  };

  const renderDay = (day: Date) => {
    const dayMemories = getMemoriesForDay(day);
    const hasMemories = dayMemories.length > 0;
    const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    
    return (
      <div className="w-full h-full flex items-center justify-center">
        {hasMemories ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`w-full h-full flex items-center justify-center calendar-day-with-memory ${isSelected ? 'ring-2 ring-primary rounded-full' : ''}`}
                  onClick={() => {
                    setSelectedDate(day);
                    setCalendarMonth(day);
                    // Open the first memory when clicking a date with memories
                    setSelectedMemory(dayMemories[0]);
                  }}
                >
                  {format(day, 'd')}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" align="center" className="w-64 p-2">
                <div className="text-sm font-medium mb-2">{format(day, 'MMMM d, yyyy')}</div>
                <div className="text-xs text-muted-foreground mb-2">
                  {dayMemories.length} {dayMemories.length === 1 ? 'memory' : 'memories'}
                </div>
                {dayMemories.length > 0 && (
                  <div 
                    className="w-full h-24 relative rounded-md overflow-hidden cursor-pointer"
                    onClick={() => {
                      setSelectedDate(day);
                      setCalendarMonth(day);
                      setSelectedMemory(dayMemories[0]);
                    }}
                  >
                    <img 
                      src={dayMemories[0].thumbnail} 
                      alt={dayMemories[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <p className="text-white text-xs font-medium">{dayMemories[0].title}</p>
                    </div>
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className={`text-foreground flex items-center justify-center w-full h-full ${isSelected ? 'ring-2 ring-primary rounded-full' : ''}`}>
            {format(day, 'd')}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 transition-all duration-300">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gradient">Memory Calendar</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          <div className="lg:col-span-1 bg-card p-4 rounded-lg shadow-sm border border-border/50 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="text-xs sm:text-sm transition-all duration-200 hover:bg-secondary"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Prev</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={goToToday}
                className="text-xs sm:text-sm transition-all duration-200 hover:bg-secondary"
              >
                Today
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('next')}
                className="text-xs sm:text-sm transition-all duration-200 hover:bg-secondary"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                className="border rounded-md bg-background w-full max-w-[350px] transition-all duration-300"
                components={{
                  DayContent: ({ date }) => renderDay(date)
                }}
              />
            </div>
            
            {selectedDate && (
              <div className="mt-4 text-center">
                <h2 className="text-lg font-medium">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {memoriesForSelectedDate.length 
                    ? `${memoriesForSelectedDate.length} ${memoriesForSelectedDate.length === 1 ? 'memory' : 'memories'} found` 
                    : 'No memories on this date'}
                </p>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2">
            <Card className="p-4 mb-4 border border-border/50 transition-all duration-300 hover:shadow-md">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto transition-all duration-200 hover:bg-secondary">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Jump to Date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-auto" align="center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="pointer-events-auto"
                      components={{
                        DayContent: ({ date }) => {
                          const hasMemory = hasMemoriesOnDate(date);
                          return (
                            <div className={`w-full h-full flex items-center justify-center ${hasMemory ? 'font-bold text-primary' : 'text-foreground'}`}>
                              {format(date, 'd')}
                            </div>
                          );
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
                
                <div className="flex w-full sm:w-auto flex-1 gap-2">
                  <Input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={jumpToDateInput}
                    onChange={(e) => setJumpToDateInput(e.target.value)}
                    className="flex-1 transition-all duration-200 focus:border-primary"
                  />
                  <Button onClick={jumpToDate} className="transition-all duration-200">Go</Button>
                </div>
              </div>
            </Card>
            
            {memoriesForSelectedDate.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {memoriesForSelectedDate.map((memory) => (
                  <MemoryCard 
                    key={memory.id} 
                    memory={memory}
                    onClick={handleMemoryClick}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8 text-center border border-border/50 transition-all duration-300 hover:shadow-md">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-medium mb-2">No memories on this date</h3>
                <p className="text-muted-foreground">
                  Try selecting a different date or create new memories.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <MemoryDialog 
          memory={selectedMemory} 
          onClose={handleCloseDialog}
          onNext={handleNextMemory}
          onPrevious={handlePreviousMemory}
        />

        <Button
          className="fixed bottom-20 right-6 sm:bottom-6 sm:right-6 rounded-full h-14 w-14 shadow-lg z-10 transition-all duration-300 hover:scale-105"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <span className="text-2xl">+</span>
        </Button>
        
        <AddMemoryDialog 
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default CalendarPage;
