import React, { useState } from 'react';
import { BriefItem, MOCK_ITEMS, Role, Comment } from './types';
import { BriefList } from './components/BriefList';
import { BriefItemDetail } from './components/BriefItemDetail';
import { ShowSpec } from './components/ShowSpec';
import { EditItemPanel } from './components/EditItemPanel';
import { NewItemPanel } from './components/NewItemPanel';
import { LayoutDashboard, FileText, Settings, UserCircle2, Activity } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function App() {
  const [items, setItems] = useState<BriefItem[]>(MOCK_ITEMS);
  const [selectedItem, setSelectedItem] = useState<BriefItem | null>(null);
  const [activeTab, setActiveTab] = useState<'BRIEF' | 'SPEC'>('BRIEF');
  const [currentUserRole, setCurrentUserRole] = useState<Role>('BAND');
  const [isNewItemPanelOpen, setIsNewItemPanelOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BriefItem | null>(null);

  const handleUpdateStatus = (id: string, status: BriefItem['status']) => {
    const item = items.find(i => i.id === id);
    const oldStatus = item?.status;

    if (oldStatus === status) return;

    const statusChangeComment: Comment = {
      id: `sys-${Date.now()}`,
      author: currentUserRole === 'BAND' ? 'Band' : 'Engineer',
      role: currentUserRole,
      text: `changed status to ${status}`,
      timestamp: new Date().toISOString(),
      type: 'STATUS_CHANGE',
      newStatus: status
    };

    setItems(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        status,
        comments: [...item.comments, statusChangeComment]
      } : item
    ));
    
    // Update selected item as well to reflect change immediately in modal
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(prev => prev ? { 
        ...prev, 
        status,
        comments: [...prev.comments, statusChangeComment]
      } : null);
    }
  };

  const handleUpdateProvider = (id: string, provider: BriefItem['provider']) => {
    const getUpdatedComments = (item: BriefItem, newProvider: BriefItem['provider']) => {
      const lastComment = item.comments[item.comments.length - 1];
      let newComments = [...item.comments];

      if (lastComment && lastComment.type === 'PROVIDER_CHANGE') {
        // If reverting to the original provider before the sequence of changes
        if (lastComment.previousProvider === newProvider) {
          newComments.pop();
        } else {
          // Update the existing change record
          newComments[newComments.length - 1] = {
            ...lastComment,
            newProvider: newProvider,
            text: `changed provider to ${newProvider}`,
            timestamp: new Date().toISOString()
          };
        }
      } else {
        // Create new change record
        const providerChangeComment: Comment = {
          id: `sys-${Date.now()}`,
          author: currentUserRole === 'BAND' ? 'Band' : 'Engineer',
          role: currentUserRole,
          text: `changed provider to ${newProvider}`,
          timestamp: new Date().toISOString(),
          type: 'PROVIDER_CHANGE',
          newProvider: newProvider,
          previousProvider: item.provider
        };
        newComments.push(providerChangeComment);
      }
      return newComments;
    };

    setItems(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        provider,
        status: 'DISCUSSING', // Auto-switch to discussing on provider change
        comments: getUpdatedComments(item, provider)
      } : item
    ));

    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(prev => prev ? { 
        ...prev, 
        provider,
        status: 'DISCUSSING', // Auto-switch to discussing on provider change
        comments: getUpdatedComments(prev, provider)
      } : null);
    }
  };

  const handleAddItem = (itemData: Omit<BriefItem, 'id' | 'status' | 'comments' | 'assignedTo'>) => {
    const newItem: BriefItem = {
      ...itemData,
      id: Date.now().toString(),
      status: 'PENDING',
      comments: [],
      assignedTo: 'Unassigned',
    };
    setItems(prev => [newItem, ...prev]);
    setIsNewItemPanelOpen(false);
    setSelectedItem(newItem);
  };

  const handleEditItem = (id: string, updates: Partial<BriefItem>) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    // Detect changes
    const changes: string[] = [];
    const previousData: any = {};

    if (updates.title && updates.title !== item.title) {
      changes.push(`Title: "${item.title}" -> "${updates.title}"`);
      previousData.title = item.title;
    }
    if (updates.description && updates.description !== item.description) {
      changes.push(`Description updated`);
      previousData.description = item.description;
    }
    if (updates.provider && updates.provider !== item.provider) {
      changes.push(`Provider: "${item.provider}" -> "${updates.provider}"`);
      previousData.provider = item.provider;
    }
    // Simple check for specs changes (could be more granular)
    if (JSON.stringify(updates.specs) !== JSON.stringify(item.specs)) {
      changes.push(`Specs updated`);
      previousData.specs = item.specs;
    }

    if (changes.length === 0) return;

    const revisionComment: Comment = {
      id: `sys-${Date.now()}`,
      author: currentUserRole === 'BAND' ? 'Band' : 'Engineer',
      role: currentUserRole,
      text: `updated the brief:\n${changes.join('\n')}`,
      timestamp: new Date().toISOString(),
      type: 'ITEM_REVISION',
      previousData
    };

    setItems(prev => prev.map(i => 
      i.id === id ? { 
        ...i, 
        ...updates,
        status: 'DISCUSSING', // Auto-switch to discussing on edit
        comments: [...i.comments, revisionComment]
      } : i
    ));

    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(prev => prev ? { 
        ...prev, 
        ...updates,
        status: 'DISCUSSING',
        comments: [...prev.comments, revisionComment]
      } : null);
    }
  };

  const handleAddComment = (id: string, text: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: currentUserRole === 'BAND' ? 'You (Band)' : 'You (Eng)',
      role: currentUserRole,
      text,
      timestamp: new Date().toISOString()
    };

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          comments: [...item.comments, newComment]
        };
      }
      return item;
    }));

    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newComment]
      } : null);
    }
  };

  const pendingCount = items.filter(i => i.status === 'PENDING').length;
  const discussingCount = items.filter(i => i.status === 'DISCUSSING').length;
  const agreedCount = items.filter(i => i.status === 'AGREED').length;

  return (
    <div className="flex h-screen bg-[#E4E3E0] text-[#141414] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141414] text-[#E4E3E0] flex flex-col border-r border-[#141414] shrink-0 h-full">
        <div className="p-6 border-b border-[#E4E3E0]/10">
          <h1 className="text-2xl font-bold tracking-tighter font-mono">
            TECH<span className="text-emerald-500">RIDER</span>
          </h1>
          <div className="text-[10px] opacity-50 font-mono mt-1">
            COLLABORATIVE STAGE PLOT
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('BRIEF')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'BRIEF' ? 'bg-[#E4E3E0] text-[#141414] font-bold' : 'hover:bg-[#E4E3E0]/10 opacity-70 hover:opacity-100'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="font-mono text-xs tracking-wider">BRIEF OVERVIEW</span>
          </button>
          <button 
            onClick={() => setActiveTab('SPEC')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'SPEC' ? 'bg-[#E4E3E0] text-[#141414] font-bold' : 'hover:bg-[#E4E3E0]/10 opacity-70 hover:opacity-100'}`}
          >
            <FileText className="w-4 h-4" />
            <span className="font-mono text-xs tracking-wider">SHOW SPEC</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#E4E3E0]/10 bg-[#141414]">
          <div className="bg-[#E4E3E0]/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2 opacity-50">
              <UserCircle2 className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase">Current Role</span>
            </div>
            <div className="flex gap-1 bg-black/20 p-1 rounded">
              <button 
                onClick={() => setCurrentUserRole('BAND')}
                className={`flex-1 py-1 text-[10px] font-mono rounded text-center transition-colors ${currentUserRole === 'BAND' ? 'bg-[#E4E3E0] text-[#141414] font-bold' : 'opacity-50 hover:opacity-100'}`}
              >
                BAND
              </button>
              <button 
                onClick={() => setCurrentUserRole('ENGINEER')}
                className={`flex-1 py-1 text-[10px] font-mono rounded text-center transition-colors ${currentUserRole === 'ENGINEER' ? 'bg-[#E4E3E0] text-[#141414] font-bold' : 'opacity-50 hover:opacity-100'}`}
              >
                ENGINEER
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 border-b border-[#141414] bg-[#E4E3E0] flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-lg tracking-tight">
              {activeTab === 'BRIEF' ? 'Technical Brief' : 'Show Specification'}
            </h2>
            <div className="h-4 w-px bg-[#141414]/20" />
            <p className="text-xs font-mono opacity-60">
              {items.filter(i => i.status === 'AGREED').length} / {items.length} Items Confirmed
            </p>
          </div>
          <div className="hidden md:block text-right font-mono text-xs opacity-50">
            <div>ARTIST: AFKE FLAVIANA</div>
            <div>EVENT: THE SPOKEN QUINTET TOUR</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 pb-24">
          {activeTab === 'BRIEF' ? (
            <BriefList 
              items={items} 
              onSelectItem={(item) => {
                setSelectedItem(item);
                setIsNewItemPanelOpen(false);
              }} 
              role={currentUserRole}
              onAddItem={() => {
                setIsNewItemPanelOpen(true);
                setSelectedItem(null);
              }}
            />
          ) : (
            <ShowSpec items={items} />
          )}
        </div>
      </main>

      {/* Detail Panel / Modal */}
      <AnimatePresence mode="wait">
        {selectedItem && !isNewItemPanelOpen && !editingItem && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-40 h-full shadow-2xl"
          >
            <BriefItemDetail 
              item={selectedItem} 
              role={currentUserRole}
              onClose={() => setSelectedItem(null)}
              onUpdateStatus={handleUpdateStatus}
              onUpdateProvider={handleUpdateProvider}
              onAddComment={handleAddComment}
              onEdit={() => setEditingItem(selectedItem)}
            />
          </motion.div>
        )}
        {isNewItemPanelOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-40 h-full shadow-2xl"
          >
            <NewItemPanel 
              onClose={() => setIsNewItemPanelOpen(false)}
              onSave={handleAddItem}
              role={currentUserRole}
            />
          </motion.div>
        )}
        {editingItem && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-40 h-full shadow-2xl"
          >
            <EditItemPanel 
              item={editingItem}
              onClose={() => setEditingItem(null)}
              onSave={(id, updates) => {
                handleEditItem(id, updates);
                setEditingItem(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
