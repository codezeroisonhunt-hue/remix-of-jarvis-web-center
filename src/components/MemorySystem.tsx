import React, { useState, useEffect } from 'react';
import { Search, Plus, Tag, Calendar, Link as LinkIcon, FileText, X, Edit, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface MemoryItem {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'link' | 'file';
  tags: string[];
  url?: string;
  createdAt: number;
  updatedAt: number;
  entities?: {
    type: string;
    text: string;
    confidence: number;
  }[];
  sentiment?: {
    score: number;
    type: string;
  };
}

interface MemorySystemProps {
  isHackerMode?: boolean;
  onAnalyzeText?: (text: string) => void;
}

const MemorySystem: React.FC<MemorySystemProps> = ({ 
  isHackerMode = false,
  onAnalyzeText
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [items, setItems] = useState<MemoryItem[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // New item form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [itemType, setItemType] = useState<'note' | 'link' | 'file'>('note');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newItemTags, setNewItemTags] = useState('');
  const [currentTagInput, setCurrentTagInput] = useState('');
  
  // Edit item states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MemoryItem | null>(null);
  
  // Load data from local storage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('jarvis_memory_items');
    const savedTags = localStorage.getItem('jarvis_memory_tags');
    
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (e) {
        console.error('Error parsing saved memory items:', e);
      }
    }
    
    if (savedTags) {
      try {
        setAllTags(JSON.parse(savedTags));
      } catch (e) {
        console.error('Error parsing saved tags:', e);
      }
    }
  }, []);
  
  // Save data to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('jarvis_memory_items', JSON.stringify(items));
  }, [items]);
  
  useEffect(() => {
    localStorage.setItem('jarvis_memory_tags', JSON.stringify(allTags));
  }, [allTags]);
  
  // Filter items based on search query, selected tags, and active tab
  const filteredItems = items.filter(item => {
    // First, filter by search query
    const matchesSearch = 
      searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    // Then, filter by selected tags
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.every(tag => item.tags.includes(tag));
    
    if (!matchesTags) return false;
    
    // Finally, filter by active tab
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });
  
  // Sort items by updated date (most recent first)
  const sortedItems = [...filteredItems].sort((a, b) => b.updatedAt - a.updatedAt);
  
  const addNewItem = () => {
    if (!newItemTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (itemType === 'link' && !newItemUrl.trim()) {
      toast.error("URL is required for links");
      return;
    }
    
    // Parse tags, filter out empty ones, and ensure uniqueness
    const tagsList = newItemTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    // Create new memory item
    const newItem: MemoryItem = {
      id: crypto.randomUUID(),
      title: newItemTitle,
      content: newItemContent,
      type: itemType,
      tags: tagsList,
      ...(itemType === 'link' && { url: newItemUrl }),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Add to items array
    setItems(prev => [...prev, newItem]);
    
    // Add new tags to allTags array
    const newTags = tagsList.filter(tag => !allTags.includes(tag));
    if (newTags.length > 0) {
      setAllTags(prev => [...prev, ...newTags]);
    }
    
    // Reset form
    resetForm();
    
    // Close dialog
    setIsAddDialogOpen(false);
    
    toast.success("Memory item saved successfully");
  };
  
  const updateItem = () => {
    if (!editingItem) return;
    
    if (!editingItem.title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (editingItem.type === 'link' && !editingItem.url?.trim()) {
      toast.error("URL is required for links");
      return;
    }
    
    // Parse tags from comma-separated string, filter out empty ones
    const tagsList = newItemTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    // Update item
    const updatedItems = items.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          title: editingItem.title,
          content: editingItem.content,
          url: editingItem.url,
          tags: tagsList,
          updatedAt: Date.now()
        };
      }
      return item;
    });
    
    setItems(updatedItems);
    
    // Add new tags to allTags array
    const newTags = tagsList.filter(tag => !allTags.includes(tag));
    if (newTags.length > 0) {
      setAllTags(prev => [...prev, ...newTags]);
    }
    
    // Reset form and close dialog
    setEditingItem(null);
    setIsEditDialogOpen(false);
    
    toast.success("Memory item updated successfully");
  };
  
  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    toast.success("Memory item deleted");
  };
  
  const openEditDialog = (item: MemoryItem) => {
    setEditingItem(item);
    setNewItemTags(item.tags.join(', '));
    setIsEditDialogOpen(true);
  };
  
  const resetForm = () => {
    setNewItemTitle('');
    setNewItemContent('');
    setNewItemUrl('');
    setNewItemTags('');
    setItemType('note');
    setCurrentTagInput('');
  };
  
  const addTag = () => {
    if (currentTagInput.trim() === '') return;
    
    const newTag = currentTagInput.trim();
    const currentTags = newItemTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    if (!currentTags.includes(newTag)) {
      const updatedTags = [...currentTags, newTag].join(', ');
      setNewItemTags(updatedTags);
    }
    
    setCurrentTagInput('');
  };
  
  const toggleTagSelection = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // New function to analyze text content with NLP
  const analyzeItemContent = (item: MemoryItem) => {
    if (onAnalyzeText && item.content) {
      onAnalyzeText(item.content);
      toast.success("Analyzing content with NLP...");
    } else if (!item.content) {
      toast.error("This item has no content to analyze");
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search memory..."
            className={`pl-8 ${isHackerMode ? 'bg-black/60 border-red-500/20' : 'bg-black/40 border-jarvis/20'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className={isHackerMode ? 'bg-red-900 hover:bg-red-800' : 'bg-jarvis hover:bg-jarvis/90'}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Memory
        </Button>
      </div>
      
      {/* Tags Row */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedTags.includes(tag)
                  ? (isHackerMode ? 'bg-red-700 hover:bg-red-600' : 'bg-jarvis hover:bg-jarvis/90')
                  : (isHackerMode ? 'border-red-500/20 hover:bg-red-900/20' : 'border-jarvis/20 hover:bg-jarvis/10')
              }`}
              onClick={() => toggleTagSelection(tag)}
            >
              <Tag className="h-3 w-3 mr-1" /> {tag}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Tabs for filtering by type */}
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={setActiveTab}
        className={`w-full ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`}
      >
        <TabsList className={`grid grid-cols-4 ${isHackerMode ? 'bg-black/60' : 'bg-black/40'}`}>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="note">Notes</TabsTrigger>
          <TabsTrigger value="link">Links</TabsTrigger>
          <TabsTrigger value="file">Files</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Memory Items Display */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {sortedItems.length > 0 ? (
          sortedItems.map(item => (
            <Card 
              key={item.id}
              className={`${isHackerMode ? 'bg-black/80 border-red-500/20' : 'bg-black/40 border-jarvis/20'}`}
            >
              <CardHeader className="py-3">
                <div className="flex justify-between">
                  <div className="flex items-start">
                    {item.type === 'note' && <FileText className="h-4 w-4 mt-1 mr-2" />}
                    {item.type === 'link' && <LinkIcon className="h-4 w-4 mt-1 mr-2" />}
                    {item.type === 'file' && <FileText className="h-4 w-4 mt-1 mr-2" />}
                    <div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="text-xs">
                        <Calendar className="h-3 w-3 inline mr-1" /> 
                        {formatDate(item.updatedAt)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {onAnalyzeText && item.content && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0" 
                        onClick={() => analyzeItemContent(item)}
                        title="Analyze with NLP"
                      >
                        <Zap className="h-3 w-3" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0" 
                      onClick={() => openEditDialog(item)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-700" 
                      onClick={() => deleteItem(item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                {item.type === 'link' && item.url && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`text-sm mb-2 block ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`}
                  >
                    {item.url}
                  </a>
                )}
                {item.content && (
                  <p className="text-sm whitespace-pre-line">{item.content}</p>
                )}
                
                {/* Display entity information if available */}
                {item.entities && item.entities.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400">Detected Entities:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.entities.map((entity, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {entity.type}: {entity.text}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Display sentiment if available */}
                {item.sentiment && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400">
                      Sentiment: 
                      <span className={
                        item.sentiment.type === 'positive' ? 'text-green-400' : 
                        item.sentiment.type === 'negative' ? 'text-red-400' : 'text-gray-400'
                      }> {item.sentiment.type} ({Math.round(item.sentiment.score * 100)}%)</span>
                    </p>
                  </div>
                )}
                
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className={`text-xs ${isHackerMode ? 'border-red-500/20' : 'border-jarvis/20'}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-6 text-gray-400">
            {searchQuery || selectedTags.length > 0 ? (
              <p>No items match your current search or filters</p>
            ) : (
              <p>No items in memory. Add your first memory item to get started!</p>
            )}
          </div>
        )}
      </div>
      
      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className={`sm:max-w-[525px] ${isHackerMode ? 'bg-black border-red-500/20' : 'bg-black/90 border-jarvis/20'}`}>
          <DialogHeader>
            <DialogTitle>Add New Memory Item</DialogTitle>
            <DialogDescription>
              Create a new item to store in your memory system.
            </DialogDescription>
          </DialogHeader>
          
          {/* Type Selection Tabs */}
          <Tabs defaultValue="note" value={itemType} onValueChange={(v) => setItemType(v as 'note' | 'link' | 'file')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="note">Note</TabsTrigger>
              <TabsTrigger value="link">Link</TabsTrigger>
              <TabsTrigger value="file">File</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Form Fields */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="col-span-3"
                placeholder="Enter a title for this memory"
              />
            </div>
            
            {itemType === 'link' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  value={newItemUrl}
                  onChange={(e) => setNewItemUrl(e.target.value)}
                  className="col-span-3"
                  placeholder="https://..."
                />
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                value={newItemContent}
                onChange={(e) => setNewItemContent(e.target.value)}
                className="col-span-3"
                placeholder={
                  itemType === 'note' 
                    ? "Enter your note text here..."
                    : itemType === 'link'
                      ? "Add description or notes about this link..."
                      : "Add description or notes about this file..."
                }
              />
            </div>
            
            {/* Tags Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <div className="col-span-3">
                <div className="flex space-x-2">
                  <Input
                    id="add-tag"
                    value={currentTagInput}
                    onChange={(e) => setCurrentTagInput(e.target.value)}
                    className="flex-1"
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  id="tags"
                  value={newItemTags}
                  onChange={(e) => setNewItemTags(e.target.value)}
                  className="mt-2"
                  placeholder="Or enter comma-separated tags"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsAddDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={addNewItem} className={isHackerMode ? 'bg-red-700 hover:bg-red-600' : 'bg-jarvis hover:bg-jarvis/90'}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className={`sm:max-w-[525px] ${isHackerMode ? 'bg-black border-red-500/20' : 'bg-black/90 border-jarvis/20'}`}>
          <DialogHeader>
            <DialogTitle>Edit Memory Item</DialogTitle>
            <DialogDescription>
              Update your memory item.
            </DialogDescription>
          </DialogHeader>
          
          {/* Form Fields */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                value={editingItem?.title || ''}
                onChange={(e) => setEditingItem(prev => prev ? {...prev, title: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            
            {editingItem?.type === 'link' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-url" className="text-right">
                  URL
                </Label>
                <Input
                  id="edit-url"
                  value={editingItem?.url || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, url: e.target.value} : null)}
                  className="col-span-3"
                />
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-content" className="text-right">
                Content
              </Label>
              <Textarea
                id="edit-content"
                value={editingItem?.content || ''}
                onChange={(e) => setEditingItem(prev => prev ? {...prev, content: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            
            {/* Tags Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-tags" className="text-right">
                Tags
              </Label>
              <Input
                id="edit-tags"
                value={newItemTags}
                onChange={(e) => setNewItemTags(e.target.value)}
                className="col-span-3"
                placeholder="Comma-separated tags"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditingItem(null);
              setIsEditDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={updateItem} className={isHackerMode ? 'bg-red-700 hover:bg-red-600' : 'bg-jarvis hover:bg-jarvis/90'}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemorySystem;
