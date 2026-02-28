import React, { useState, useEffect, useRef } from 'react';
import { BriefItem, Role, Comment } from '../types';
import { StatusBadge } from './Badges';
import { ProviderBadge } from './ProviderBadge';
import { Send, X, Edit2, CheckCircle, Clock, Truck, UserCog } from 'lucide-react';
import { motion } from 'motion/react';

interface BriefItemDetailProps {
  item: BriefItem;
  role: Role;
  onClose: () => void;
  onUpdateStatus: (id: string, status: BriefItem['status']) => void;
  onUpdateProvider: (id: string, provider: BriefItem['provider']) => void;
  onAddComment: (id: string, text: string) => void;
  onEdit: () => void;
}

export const BriefItemDetail: React.FC<BriefItemDetailProps> = ({ item, role, onClose, onUpdateStatus, onUpdateProvider, onAddComment, onEdit }) => {
  const [newComment, setNewComment] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const discussionScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView();
  }, [item.comments]);

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (discussionScrollRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(item.id, newComment);
      setNewComment('');
    }
  };

  return (
    <motion.div
      ref={sidebarRef}
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
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-full" title="Edit Item">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 space-y-8 shrink-0">
        {/* Status Actions */}
        <div className="bg-white/50 p-4 border border-[#141414]">
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono text-xs uppercase opacity-60">Current Status</span>
            <div className="flex flex-col items-end">
              <StatusBadge item={item} />
              {item.status === 'PENDING' && item.pendingConfirmationFrom && (
                <span className="text-[10px] font-mono opacity-50 mt-1 uppercase">
                  Waiting for {item.pendingConfirmationFrom}
                </span>
              )}
            </div>
          </div>
          
          {/* Provider Selection for Engineer */}
          {/* Removed as provider selection is now in edit mode */}

          {(() => {
            const lastMeaningfulComment = [...item.comments].reverse().find(c => c.type === 'ITEM_REVISION' || c.type === 'STATUS_CHANGE');
            const pendingFromEdit = lastMeaningfulComment?.type === 'ITEM_REVISION';
            return (
              <div className="flex gap-2">
                {/* Engineer Actions */}
                {role === 'ENGINEER' && (
                  <>
                    {(item.status === 'DISCUSSING' || (item.status === 'PENDING' && (item.pendingConfirmationFrom === 'ENGINEER' || (item.createdBy === 'BAND' && !item.pendingConfirmationFrom)))) && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'AGREED')}
                        className="flex-1 bg-[#141414] text-[#E4E3E0] py-2 px-4 font-mono text-sm hover:bg-emerald-700 transition-colors"
                      >
                        {pendingFromEdit ? 'ACCEPT CHANGES' : 'CONFIRM / AGREE'}
                      </button>
                    )}
                    {(item.status === 'PENDING' || item.status === 'AGREED') && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'DISCUSSING')}
                        className="flex-1 bg-transparent border border-[#141414] text-[#141414] py-2 px-4 font-mono text-sm hover:bg-amber-100 transition-colors"
                      >
                        {item.status === 'AGREED' ? 'RE-OPEN' : 'DISCUSS'}
                      </button>
                    )}
                  </>
                )}

                {/* Band Actions */}
                {role === 'BAND' && (
                  <>
                    {(item.status === 'DISCUSSING' || (item.status === 'PENDING' && (item.pendingConfirmationFrom === 'BAND' || (item.createdBy === 'ENGINEER' && !item.pendingConfirmationFrom)))) && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'AGREED')}
                        className="flex-1 bg-[#141414] text-[#E4E3E0] py-2 px-4 font-mono text-sm hover:bg-emerald-700 transition-colors"
                      >
                        {pendingFromEdit ? 'ACCEPT CHANGES' : 'CONFIRM / AGREE'}
                      </button>
                    )}
                    {(item.status === 'PENDING' || item.status === 'AGREED') && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'DISCUSSING')}
                        className="flex-1 bg-transparent border border-[#141414] text-[#141414] py-2 px-4 font-mono text-sm hover:bg-amber-100 transition-colors"
                      >
                        {item.status === 'AGREED' ? 'RE-OPEN' : 'DISCUSS'}
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })()}
        </div>

        {/* Details */}
        <div>
          <h3 className="font-serif-italic text-sm opacity-50 uppercase tracking-wider mb-2 border-b border-[#141414] pb-1">Specification</h3>
          <div className="grid grid-cols-3 gap-4 font-mono text-sm mt-3">
            <div className="col-span-1 opacity-60">Provider</div>
            <div className="col-span-2"><ProviderBadge provider={item.provider} /></div>
            
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

        </div>{/* end fixed sections */}

        {/* Discussion */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <h3 className="font-serif-italic text-sm opacity-50 uppercase tracking-wider border-b border-[#141414] pb-1 shrink-0 px-6">Discussion Log</h3>
          <div ref={discussionScrollRef} className="space-y-4 overflow-y-auto flex-1 px-6 pt-4 pb-6">
            {item.comments.length === 0 && (
              <p className="font-mono text-xs text-center opacity-40 py-4">No comments yet.</p>
            )}
            {item.comments.map((comment, index) => {
              // Skip STATUS_CHANGE to AGREED if it's part of a revision block
              if (comment.type === 'STATUS_CHANGE' && comment.newStatus === 'AGREED') {
                const prevComment = index > 0 ? item.comments[index - 1] : null;
                if (prevComment?.type === 'ITEM_REVISION') {
                  return null; // Skip rendering, it will be part of the revision block
                }
              }

              if (comment.type === 'STATUS_CHANGE') {
                // First party agreed — waiting for the other
                if (comment.waitingFor) {
                  return (
                    <div key={comment.id} className="flex justify-center my-3">
                      <div className="w-full max-w-[85%] bg-amber-50 border border-amber-300 px-4 py-3 flex items-start gap-3">
                        <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wide">{comment.author} agrees</p>
                          <p className="text-[11px] font-mono text-amber-700 mt-0.5">Waiting for {comment.waitingFor} confirmation</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                // Both parties agreed (standalone, not after revision)
                if (comment.newStatus === 'AGREED') {
                  return (
                    <div key={comment.id} className="flex justify-center my-3">
                      <div className="w-full max-w-[85%] bg-emerald-50 border border-emerald-300 px-4 py-3 flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wide">{comment.author} confirmed</p>
                          <p className="text-[11px] font-mono text-emerald-700 mt-0.5">Both parties agreed</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                // Re-open / DISCUSSING / other status transitions — small pill
                return (
                  <div key={comment.id} className="flex justify-center my-2">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                      comment.newStatus === 'DISCUSSING' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      comment.newStatus === 'PENDING' ? 'bg-neutral-100 text-neutral-600 border-neutral-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {comment.author} {comment.newStatus === 'DISCUSSING' ? 're-opened for discussion' : `marked as ${comment.newStatus}`}
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

              if (comment.type === 'ITEM_REVISION') {
                const isOwn = comment.role === role;
                const agreementComments: Comment[] = [];
                let j = index + 1;
                while (j < item.comments.length) {
                  const c = item.comments[j];
                  if (c.type === 'STATUS_CHANGE' && c.newStatus === 'AGREED') {
                    agreementComments.push(c);
                  } else if (c.type === 'ITEM_REVISION' || (c.type === 'STATUS_CHANGE' && c.newStatus !== 'AGREED')) {
                    break;
                  }
                  j++;
                }

                return (
                  <div key={comment.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} my-4 w-full`}>
                    <div className={`border border-[#141414] p-3 w-full max-w-[85%] text-xs font-mono ${isOwn ? 'bg-[#141414]/5' : 'bg-white'}`}>
                      <div className="space-y-3 opacity-70">
                        {comment.previousData?.category && comment.newData?.category && (
                          <div className="flex flex-col gap-1">
                            <span className="opacity-50 text-[10px] uppercase">Category</span>
                            <div className="line-through opacity-50">{comment.previousData.category}</div>
                            <div className="font-bold text-emerald-700">{comment.newData.category}</div>
                          </div>
                        )}
                        {comment.previousData?.title && comment.newData?.title && (
                          <div className="flex flex-col gap-1">
                            <span className="opacity-50 text-[10px] uppercase">Title</span>
                            <div className="line-through opacity-50">{comment.previousData.title}</div>
                            <div className="font-bold text-emerald-700">{comment.newData.title}</div>
                          </div>
                        )}
                        {comment.previousData?.provider && comment.newData?.provider && (
                          <div className="flex flex-col gap-1">
                            <span className="opacity-50 text-[10px] uppercase">Provider</span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold opacity-50 line-through ${
                                comment.previousData.provider === 'BAND' ? 'bg-indigo-100 text-indigo-800' :
                                comment.previousData.provider === 'VENUE' ? 'bg-neutral-100 text-neutral-800' :
                                'bg-cyan-100 text-cyan-800'
                              }`}>
                                {comment.previousData.provider}
                              </span>
                              <span className="text-[10px] opacity-50">→</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                comment.newData.provider === 'BAND' ? 'bg-indigo-100 text-indigo-800' :
                                comment.newData.provider === 'VENUE' ? 'bg-neutral-100 text-neutral-800' :
                                'bg-cyan-100 text-cyan-800'
                              }`}>
                                {comment.newData.provider}
                              </span>
                            </div>
                          </div>
                        )}
                        {comment.previousData?.description && comment.newData?.description && (
                          <div className="flex flex-col gap-1">
                            <span className="opacity-50 text-[10px] uppercase">Description</span>
                            <div className="line-through opacity-50 italic pl-2 border-l-2 border-[#141414]/10">{comment.previousData.description}</div>
                            <div className="italic pl-2 border-l-2 border-emerald-500/50 text-emerald-700">{comment.newData.description}</div>
                          </div>
                        )}
                        {comment.previousData?.specs && comment.newData?.specs && (
                          <div className="flex flex-col gap-1">
                            <span className="opacity-50 text-[10px] uppercase">Specs</span>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 pl-2 opacity-50 line-through text-[10px]">
                              {Object.entries(comment.previousData.specs).map(([key, value]) => (
                                <div key={key}>
                                  <span className="capitalize">{key}:</span> {value}
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 pl-2 text-emerald-700 text-[10px]">
                              {Object.entries(comment.newData.specs).map(([key, value]) => (
                                <div key={key}>
                                  <span className="capitalize">{key}:</span> {value}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] mt-1 opacity-50">
                      {comment.author} updated brief • {new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    {agreementComments.length > 0 && (
                      <div className={`relative flex flex-col gap-0.5 mt-2 ${isOwn ? 'self-start' : 'self-end'}`}>
                        <div className={`absolute top-0 bottom-0 w-0.5 bg-emerald-400 ${isOwn ? 'right-0' : 'left-0'}`} />
                        {agreementComments.map(ac => (
                          <div key={ac.id} className={`flex flex-col ${isOwn ? 'pr-3' : 'pl-3'}`}>
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                ac.role === 'BAND' ? 'bg-indigo-200 text-indigo-700' : 'bg-cyan-200 text-cyan-700'
                              }`}>
                                {ac.role === 'BAND' ? <Truck className="w-3.5 h-3.5" /> : <UserCog className="w-3.5 h-3.5" />}
                              </span>
                              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                              <span className="font-mono text-xs font-semibold">{ac.author} agreed</span>
                            </div>
                            <span className="font-mono text-[10px] opacity-50 mt-0.5 ml-8">
                              {new Date(ac.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const bubbleStyle = comment.role === 'BAND'
                ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                : 'bg-cyan-100 text-cyan-900 border-cyan-300';

              return (
                <div key={comment.id} className={`flex flex-col ${comment.role === role ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 border ${bubbleStyle}`}>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                  <span className="font-mono text-[10px] mt-1 opacity-50">
                    {comment.author} • {new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              );
            })}
            <div ref={commentsEndRef} />
          </div>
        </div>
      </div>{/* end flex-1 flex flex-col */}

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
