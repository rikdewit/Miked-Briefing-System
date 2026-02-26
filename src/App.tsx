import React, { useState, useEffect } from 'react';
import { BriefItem, MOCK_ITEMS, Role, Comment } from './types';
import { BriefList } from './components/BriefList';
import { BriefItemDetail } from './components/BriefItemDetail';
import { ShowSpec } from './components/ShowSpec';
import { EditItemPanel } from './components/EditItemPanel';
import { NewItemPanel } from './components/NewItemPanel';
import { LayoutDashboard, FileText, Settings, UserCircle2, Activity, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function App() {
  const [items, setItems] = useState<BriefItem[]>(() => {
    const saved = localStorage.getItem('briefItems');
    return saved ? JSON.parse(saved) : MOCK_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('briefItems', JSON.stringify(items));
  }, [items]);

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);


  const handleResetData = () => {
    setIsResetDialogOpen(true);
  };

  const confirmResetData = () => {
    setItems(MOCK_ITEMS);
    localStorage.removeItem('briefItems');
    setSelectedItem(null);
    setIsResetDialogOpen(false);
  };

  const [selectedItem, setSelectedItem] = useState<BriefItem | null>(null);
  const [activeTab, setActiveTab] = useState<'BRIEF' | 'SPEC'>('BRIEF');
  const [currentUserRole, setCurrentUserRole] = useState<Role>('BAND');
  const [isNewItemPanelOpen, setIsNewItemPanelOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BriefItem | null>(null);

  const handleUpdateStatus = (id: string, newStatus: BriefItem['status']) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;

      let updatedItem = { ...item };
      let actualNewStatus = newStatus;
      let pendingConfirmationFrom: Role | undefined = undefined;

      // Logic for Agreement Flow
      if (newStatus === 'AGREED') {
        if (item.status === 'DISCUSSING') {
          // If discussing, first move to PENDING waiting for other party
          actualNewStatus = 'PENDING';
          pendingConfirmationFrom = currentUserRole === 'BAND' ? 'ENGINEER' : 'BAND';
        } else if (item.status === 'PENDING') {
          // If pending, check if we are the one confirming
          if (item.pendingConfirmationFrom === currentUserRole || 
              (item.createdBy && item.createdBy !== currentUserRole && !item.pendingConfirmationFrom)) {
            actualNewStatus = 'AGREED';
            pendingConfirmationFrom = undefined;
          } else {
             // Should not happen if UI is correct, but safe fallback
             return item;
          }
        }
      } else if (newStatus === 'DISCUSSING') {
        // Reset confirmation if moving back to discussion
        pendingConfirmationFrom = undefined;
      }

      const statusChangeComment: Comment = {
        id: `sys-${Date.now()}`,
        author: currentUserRole === 'BAND' ? 'Band' : 'Engineer',
        role: currentUserRole,
        text: `changed status to ${actualNewStatus}${pendingConfirmationFrom ? ` (waiting for ${pendingConfirmationFrom})` : ''}`,
        timestamp: new Date().toISOString(),
        type: 'STATUS_CHANGE',
        newStatus: actualNewStatus
      };

      const newItem = {
        ...updatedItem,
        status: actualNewStatus,
        pendingConfirmationFrom,
        comments: [...item.comments, statusChangeComment]
      };

      // Update selected item if it matches
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(newItem);
      }

      return newItem;
    }));
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
      createdBy: currentUserRole,
      pendingConfirmationFrom: currentUserRole === 'BAND' ? 'ENGINEER' : 'BAND'
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
    const newData: any = {};

    if (updates.category && updates.category !== item.category) {
      changes.push(`Category: "${item.category}" -> "${updates.category}"`);
      previousData.category = item.category;
      newData.category = updates.category;
    }
    if (updates.title && updates.title !== item.title) {
      changes.push(`Title: "${item.title}" -> "${updates.title}"`);
      previousData.title = item.title;
      newData.title = updates.title;
    }
    if (updates.description && updates.description !== item.description) {
      changes.push(`Description updated`);
      previousData.description = item.description;
      newData.description = updates.description;
    }
    if (updates.provider && updates.provider !== item.provider) {
      changes.push(`Provider: "${item.provider}" -> "${updates.provider}"`);
      previousData.provider = item.provider;
      newData.provider = updates.provider;
    }
    // Simple check for specs changes (could be more granular)
    if (JSON.stringify(updates.specs) !== JSON.stringify(item.specs)) {
      changes.push(`Specs updated`);
      previousData.specs = item.specs;
      newData.specs = updates.specs;
    }

    if (changes.length === 0) return;

    const revisionComment: Comment = {
      id: `sys-${Date.now()}`,
      author: currentUserRole === 'BAND' ? 'Band' : 'Engineer',
      role: currentUserRole,
      text: `updated the brief:\n${changes.join('\n')}`,
      timestamp: new Date().toISOString(),
      type: 'ITEM_REVISION',
      previousData,
      newData
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
          
          <button 
            onClick={handleResetData}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-[10px] font-mono opacity-30 hover:opacity-100 hover:text-red-400 transition-all border border-transparent hover:border-red-400/20 rounded"
          >
            <RefreshCw className="w-3 h-3" />
            RESET MOCK DATA
          </button>
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
              selectedItem={selectedItem}
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

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {isResetDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#E4E3E0] p-6 rounded-lg shadow-xl max-w-md w-full border border-[#141414]"
            >
              <h3 className="text-lg font-bold font-mono mb-2">RESET DATA?</h3>
              <p className="text-sm opacity-70 mb-6">
                Are you sure you want to reset all data to the initial mock state? This cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsResetDialogOpen(false)}
                  className="px-4 py-2 text-xs font-mono border border-[#141414] hover:bg-[#141414]/5 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={confirmResetData}
                  className="px-4 py-2 text-xs font-mono bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  RESET EVERYTHING
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Modal */}
      <AnimatePresence>

      </AnimatePresence>
    </div>
  );
}

export default App;
