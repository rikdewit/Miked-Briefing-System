import React, { useState } from 'react';
import { BriefItem, Role, Comment } from '../types';
import { StatusBadge, TypeBadge } from './Badges';
import { ProviderBadge } from './ProviderBadge';
import { Send, X } from 'lucide-react';
import { motion } from 'motion/react';

interface BriefItemDetailProps {
  item: BriefItem;
  role: Role;
  onClose: () => void;
  onUpdateStatus: (id: string, status: BriefItem['status']) => void;
  onUpdateProvider: (id: string, provider: BriefItem['provider']) => void;
  onAddComment: (id: string, text: string) => void;
}

export const BriefItemDetail: React.FC<BriefItemDetailProps> = ({ item, role, onClose, onUpdateStatus, onUpdateProvider, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(item.id, newComment);
      setNewComment('');
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-[#E4E3E0] border-l border-[#141414] shadow-2xl z-50 flex flex-col"
    >
      <div className="flex items-center justify-between p-6 border-b border-[#141414] bg-[#E4E3E0]">
        <div>
           <span className="font-serif-italic text-xs opacity-50 uppercase tracking-wider block mb-1">
            {item.category}
          </span>
          <h2 className="text-xl font-bold font-mono tracking-tight">{item.title}</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Status Actions */}
        <div className="bg-white/50 p-4 border border-[#141414]">
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono text-xs uppercase opacity-60">Current Status</span>
            <StatusBadge status={item.status} />
          </div>
          
          {/* Provider Selection for Engineer */}
          {role === 'ENGINEER' && (
            <div className="mb-4">
              <span className="font-mono text-xs uppercase opacity-60 block mb-2">Assign Provider</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => onUpdateProvider(item.id, 'VENUE')}
                  className={`flex-1 py-1 text-xs font-mono border ${item.provider === 'VENUE' ? 'bg-neutral-800 text-white border-neutral-800' : 'border-neutral-300 hover:bg-neutral-100'}`}
                >
                  VENUE
                </button>
                <button 
                  onClick={() => onUpdateProvider(item.id, 'ENGINEER')}
                  className={`flex-1 py-1 text-xs font-mono border ${item.provider === 'ENGINEER' ? 'bg-cyan-800 text-white border-cyan-800' : 'border-cyan-300 hover:bg-cyan-100'}`}
                >
                  ENGINEER
                </button>
                <button 
                  onClick={() => onUpdateProvider(item.id, 'BAND')}
                  className={`flex-1 py-1 text-xs font-mono border ${item.provider === 'BAND' ? 'bg-indigo-800 text-white border-indigo-800' : 'border-indigo-300 hover:bg-indigo-100'}`}
                >
                  BAND
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {role === 'ENGINEER' && item.status !== 'AGREED' && (
              <button 
                onClick={() => onUpdateStatus(item.id, 'AGREED')}
                className="flex-1 bg-[#141414] text-[#E4E3E0] py-2 px-4 font-mono text-sm hover:bg-emerald-700 transition-colors"
              >
                CONFIRM / AGREE
              </button>
            )}
            {role === 'ENGINEER' && item.status === 'PENDING' && (
              <button 
                onClick={() => onUpdateStatus(item.id, 'DISCUSSING')}
                className="flex-1 bg-transparent border border-[#141414] text-[#141414] py-2 px-4 font-mono text-sm hover:bg-amber-100 transition-colors"
              >
                DISCUSS
              </button>
            )}
             {role === 'BAND' && item.status === 'AGREED' && (
              <button 
                onClick={() => onUpdateStatus(item.id, 'DISCUSSING')}
                className="flex-1 bg-transparent border border-[#141414] text-[#141414] py-2 px-4 font-mono text-sm hover:bg-amber-100 transition-colors"
              >
                RE-OPEN
              </button>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <h3 className="font-serif-italic text-sm opacity-50 uppercase tracking-wider mb-2 border-b border-[#141414] pb-1">Specification</h3>
          <div className="grid grid-cols-3 gap-4 font-mono text-sm mt-3">
            <div className="col-span-1 opacity-60">Provider</div>
            <div className="col-span-2"><ProviderBadge provider={item.provider} /></div>

            <div className="col-span-1 opacity-60">Type</div>
            <div className="col-span-2"><TypeBadge type={item.type} /></div>
            
            <div className="col-span-1 opacity-60">Description</div>
            <div className="col-span-2">{item.description}</div>

            {item.specs?.make && (
              <>
                <div className="col-span-1 opacity-60">Make</div>
                <div className="col-span-2">{item.specs.make}</div>
              </>
            )}
            {item.specs?.model && (
              <>
                <div className="col-span-1 opacity-60">Model</div>
                <div className="col-span-2">{item.specs.model}</div>
              </>
            )}
             {item.specs?.quantity && (
              <>
                <div className="col-span-1 opacity-60">Quantity</div>
                <div className="col-span-2">{item.specs.quantity}</div>
              </>
            )}
          </div>
        </div>

        {/* Discussion */}
        <div>
          <h3 className="font-serif-italic text-sm opacity-50 uppercase tracking-wider mb-4 border-b border-[#141414] pb-1">Discussion Log</h3>
          <div className="space-y-4">
            {item.comments.length === 0 && (
              <p className="font-mono text-xs text-center opacity-40 py-4">No comments yet.</p>
            )}
            {item.comments.map((comment) => {
              if (comment.type === 'STATUS_CHANGE') {
                return (
                  <div key={comment.id} className="flex justify-center my-2">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                      comment.newStatus === 'AGREED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      comment.newStatus === 'DISCUSSING' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      comment.newStatus === 'PENDING' ? 'bg-neutral-100 text-neutral-600 border-neutral-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {comment.author} marked as {comment.newStatus}
                    </div>
                  </div>
                );
              }

              if (comment.type === 'PROVIDER_CHANGE') {
                return (
                  <div key={comment.id} className="flex justify-center my-2">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                      comment.newProvider === 'BAND' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                      comment.newProvider === 'VENUE' ? 'bg-neutral-100 text-neutral-800 border-neutral-200' :
                      'bg-cyan-100 text-cyan-800 border-cyan-200'
                    }`}>
                      {comment.author} assigned provider: {comment.newProvider}
                    </div>
                  </div>
                );
              }

              return (
                <div key={comment.id} className={`flex flex-col ${comment.role === role ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 border border-[#141414] ${comment.role === role ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-white'}`}>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                  <span className="font-mono text-[10px] mt-1 opacity-50">
                    {comment.author} • {new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#141414] bg-[#E4E3E0]">
        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-b border-[#141414] px-2 py-2 font-mono text-sm focus:outline-none focus:border-b-2"
          />
          <button 
            type="submit"
            disabled={!newComment.trim()}
            className="p-2 bg-[#141414] text-[#E4E3E0] disabled:opacity-50 hover:opacity-80 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
