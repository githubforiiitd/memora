
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Archive, Trash2 } from 'lucide-react';
import { useMemories } from '@/context/MemoryContext';
import MemoryCard from '@/components/MemoryCard';
import { differenceInYears, parse } from 'date-fns';

const SettingsPage = () => {
  const { toast } = useToast();
  const { deletedMemories, restoreMemory, permanentlyDeleteMemory } = useMemories();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Areeb',
    email: 'areeb@gmail.com',
    dob: '2003-04-03',
    bio: 'Photography enthusiast and memory collector. I love capturing moments and reliving them through Memora.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  });

  const calculateAge = (dateString: string) => {
    try {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      return differenceInYears(new Date(), date);
    } catch (e) {
      return 20; // Default to 20 as requested
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      toast({
        description: "Profile updated successfully!",
        duration: 3000
      });
    }
    setIsEditing(!isEditing);
  };

  const handleRestore = (id: string) => {
    restoreMemory(id);
  };

  const handlePermanentlyDelete = (id: string) => {
    permanentlyDeleteMemory(id);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="deleted">Recently Deleted</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <Button 
                  onClick={handleEdit}
                  variant="outline"
                >
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center space-y-4 col-span-1">
                  <Avatar className="w-32 h-32 border-4 border-background">
                    <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button 
                      onClick={() => toast({ description: "Photo upload functionality coming in next update!", duration: 1500 })}
                      className="text-sm text-primary underline"
                    >
                      Change Photo
                    </button>
                  )}
                </div>
                
                <div className="space-y-4 col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input 
                          id="name" 
                          value={profile.name} 
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                        />
                      ) : (
                        <p className="text-lg font-medium">{profile.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input 
                          id="email" 
                          type="email" 
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                      ) : (
                        <p className="text-lg">{profile.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      {isEditing ? (
                        <Input 
                          id="dob" 
                          type="date" 
                          value={profile.dob}
                          onChange={(e) => setProfile({...profile, dob: e.target.value})}
                        />
                      ) : (
                        <p className="text-lg">{profile.dob}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <p className="text-lg">{calculateAge(profile.dob)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <textarea 
                        id="bio"
                        className="w-full px-3 py-2 border rounded-md text-base md:text-sm"
                        rows={3}
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      />
                    ) : (
                      <p className="text-lg">{profile.bio}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deleted">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive size={20} /> Recently Deleted Memories
                </CardTitle>
              </CardHeader>
              <CardContent>
                {deletedMemories.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Memories will be permanently deleted after 30 days. You can restore them or delete them permanently.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {deletedMemories.map((memory) => (
                        <div key={memory.id} className="rounded-lg overflow-hidden bg-card border">
                          <div className="relative aspect-video">
                            <img 
                              src={`https://images.unsplash.com/${memory.thumbnail}`} 
                              alt={memory.title}
                              className="w-full h-full object-cover opacity-80"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium text-sm">{memory.title}</h3>
                            <div className="flex justify-between mt-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleRestore(memory.id)}
                              >
                                Restore
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handlePermanentlyDelete(memory.id)}
                              >
                                <Trash2 size={14} className="mr-1" /> Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 bg-card p-8 text-center">
                    <div className="text-4xl mb-4">🗑️</div>
                    <h3 className="text-xl font-medium mb-2">No deleted memories</h3>
                    <p className="text-muted-foreground">
                      When you delete memories, they will appear here for 30 days.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
