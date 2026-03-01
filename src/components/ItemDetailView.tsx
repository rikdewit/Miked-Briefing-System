import React, { useRef, useEffect, useState } from 'react';
import { BriefItem, Role, Comment } from '../types';
import { StatusBadge } from './Badges';
import { ProviderBadge } from './ProviderBadge';
import { Send, ChevronLeft, Edit2, CheckCircle, Music, UserCog } from 'lucide-react';

interface ItemDetailViewProps {
  item: BriefItem;
  role: Role;
  onClose: () => void;
  onAddComment: (id: string, text: string) => void;
  onUpdateStatus: (id: string, status: BriefItem['status']) => void;
  onEdit: () => void;
  onReopen: (id: string, message: string) => void;
}

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-[520px] shrink-0 bg-[#E4E3E0] border-l border-[#141414] flex flex-col overflow-hidden">
    {children}
  </div>
);

export const ItemDetailView: React.FC<ItemDetailViewProps> = ({
  item,
  role,
  onClose,
  onAddComment,
  onUpdateStatus,
  onEdit,
  onReopen,
}) => {
  const [text, setText] = useState('');
  const [isReopenPromptOpen, setIsReopenPromptOpen] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [item.comments]);

  const scrollToRevision = (commentId: string) => {
    const el = scrollContainerRef.current?.querySelector(`#revision-${commentId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Get the latest revision comment first
  const lastRevisionComment = [...item.comments].reverse().find(c => c.type === 'ITEM_REVISION');
  const lastRevisionIndex = lastRevisionComment
    ? item.comments.findIndex(c => c.id === lastRevisionComment.id)
    : -1;

  // Get agreement comments scoped to the current revision cycle (after the latest revision)
  const agreementComments = item.comments
    .slice(lastRevisionIndex + 1)
    .filter(c => c.type === 'STATUS_CHANGE' && c.newStatus === 'AGREED');
  const agreedByRoles = Array.from(new Set(agreementComments.map(c => c.role)));
  // Use item.status as source of truth: agreement is final when status is AGREED or REOPENED and there's a revision to have agreed on
  // When REOPENED, we still show the agreed spec values (no diffs)
  const bothPartiesAgreed = (item.status === 'AGREED' || item.status === 'REOPENED') && lastRevisionComment !== undefined;

  // Per-field pending revision helpers for spec grid
  // Hide diffs when both parties have agreed — show current values only
  const pendingProvider = !bothPartiesAgreed && lastRevisionComment?.previousData?.provider !== undefined
    ? { old: lastRevisionComment.previousData.provider, new: lastRevisionComment.newData?.provider }
    : null;

  const pendingDescription = !bothPartiesAgreed && lastRevisionComment?.previousData?.description !== undefined
    ? { old: lastRevisionComment.previousData.description, new: lastRevisionComment.newData?.description }
    : null;

  const pendingMake = !bothPartiesAgreed && lastRevisionComment?.previousData?.specs?.make !== undefined
    ? { old: lastRevisionComment.previousData.specs.make, new: lastRevisionComment.newData?.specs?.make }
    : null;

  const pendingModel = !bothPartiesAgreed && lastRevisionComment?.previousData?.specs?.model !== undefined
    ? { old: lastRevisionComment.previousData.specs.model, new: lastRevisionComment.newData?.specs?.model }
    : null;

  const pendingQuantity = !bothPartiesAgreed && lastRevisionComment?.previousData?.specs?.quantity !== undefined
    ? { old: lastRevisionComment.previousData.specs.quantity, new: lastRevisionComment.newData?.specs?.quantity }
    : null;

  const pendingNotes = !bothPartiesAgreed && lastRevisionComment?.previousData?.specs?.notes !== undefined
    ? { old: lastRevisionComment.previousData.specs.notes, new: lastRevisionComment.newData?.specs?.notes }
    : null;

  return (
    <Shell>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#141414] shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={() => {
              onClose();
              setText('');
            }}
            className="p-1.5 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-full shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <span className="text-[10px] font-mono opacity-50 uppercase tracking-wider block">{item.category}</span>
            <h2 className="text-sm font-bold font-mono tracking-tight truncate">{item.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex flex-col items-end">
            <StatusBadge item={item} />
            {item.status === 'PENDING' && item.pendingConfirmationFrom && (
              <span className="text-[10px] font-mono opacity-50 mt-0.5 uppercase">
                Waiting for {item.pendingConfirmationFrom}
              </span>
            )}
          </div>
          <button
            onClick={onEdit}
            className="p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-full shrink-0"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Spec — fixed */}
        <div className="px-6 pt-4 pb-4 shrink-0">
          <div className="grid grid-cols-3 gap-4 font-mono text-sm">
            {/* Provider */}
            <div className="col-span-1 opacity-60">Provider</div>
            <div className="col-span-2">
              {pendingProvider ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="opacity-40 line-through">
                    <ProviderBadge provider={pendingProvider.old} />
                  </span>
                  <span className="text-[10px] opacity-40">→</span>
                  <ProviderBadge provider={pendingProvider.new} />
                </div>
              ) : (
                <ProviderBadge provider={item.provider} />
              )}
            </div>

            {/* Description */}
            <div className="col-span-1 opacity-60">Description</div>
            <div className="col-span-2">
              {pendingDescription ? (
                <div className="flex flex-col gap-0.5">
                  <span className="line-through opacity-40">{pendingDescription.old}</span>
                  <span className="text-emerald-700 font-semibold">{pendingDescription.new}</span>
                </div>
              ) : (
                item.description
              )}
            </div>

            {/* Make */}
            {(item.specs?.make || pendingMake) && (
              <>
                <div className="col-span-1 opacity-60">Make</div>
                <div className="col-span-2">
                  {pendingMake ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="line-through opacity-40">{pendingMake.old}</span>
                      <span className="text-emerald-700 font-semibold">{pendingMake.new}</span>
                    </div>
                  ) : (
                    item.specs?.make
                  )}
                </div>
              </>
            )}

            {/* Model */}
            {(item.specs?.model || pendingModel) && (
              <>
                <div className="col-span-1 opacity-60">Model</div>
                <div className="col-span-2">
                  {pendingModel ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="line-through opacity-40">{pendingModel.old}</span>
                      <span className="text-emerald-700 font-semibold">{pendingModel.new}</span>
                    </div>
                  ) : (
                    item.specs?.model
                  )}
                </div>
              </>
            )}

            {/* Quantity */}
            {(item.specs?.quantity || pendingQuantity) && (
              <>
                <div className="col-span-1 opacity-60">Quantity</div>
                <div className="col-span-2">
                  {pendingQuantity ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="line-through opacity-40">{pendingQuantity.old}</span>
                      <span className="text-emerald-700 font-semibold">{pendingQuantity.new}</span>
                    </div>
                  ) : (
                    item.specs?.quantity
                  )}
                </div>
              </>
            )}

            {/* Notes */}
            {(item.specs?.notes || pendingNotes) && (
              <>
                <div className="col-span-1 opacity-60">Notes</div>
                <div className="col-span-2">
                  {pendingNotes ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="line-through opacity-40">{pendingNotes.old}</span>
                      <span className="text-emerald-700 font-semibold">{pendingNotes.new}</span>
                    </div>
                  ) : (
                    item.specs?.notes
                  )}
                </div>
              </>
            )}
          </div>

          {/* Agreement summary + ACCEPT button — only when revision is pending */}
          {lastRevisionComment && (
            <div className="mt-4 pt-3 border-t border-[#141414]/20 space-y-2">
              {bothPartiesAgreed && item.status === 'AGREED' ? (
                <button
                  onClick={() => scrollToRevision(lastRevisionComment.id)}
                  className="flex items-center gap-1.5 text-emerald-700 font-mono text-[10px] underline underline-offset-2 hover:opacity-70 transition-opacity"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  View agreed revision in log
                </button>
              ) : item.status === 'REOPENED' ? (
                <>
                  <button
                    onClick={() => scrollToRevision(lastRevisionComment.id)}
                    className="flex items-center gap-1.5 text-gray-500 font-mono text-[10px] underline underline-offset-2 hover:opacity-70 transition-opacity opacity-60"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    View agreed revision in log
                  </button>
                  <div className="text-[10px] opacity-50 italic">Agreement voided — awaiting new proposal</div>
                </>
              ) : (
                <>
                  {agreementComments.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] opacity-60 uppercase tracking-wider">Confirmed by</span>
                      <div className="flex gap-1.5">
                        {agreementComments.map(ac => (
                          <div
                            key={ac.id}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              ac.role === 'BAND' ? 'bg-indigo-100 text-indigo-700' : 'bg-cyan-100 text-cyan-700'
                            }`}
                          >
                            {ac.role === 'BAND' ? <Music className="w-3 h-3 -mb-0.5" /> : <UserCog className="w-3 h-3" />}
                            {ac.role === role ? 'You' : ac.author}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.pendingConfirmationFrom && !bothPartiesAgreed ? (
                    <div className="font-mono text-[10px] opacity-50 uppercase tracking-wider">
                      Waiting for {item.pendingConfirmationFrom}
                    </div>
                  ) : null}

                  {lastRevisionComment.pendingUpdates && item.pendingConfirmationFrom === role && (
                    <button
                      onClick={() => onUpdateStatus(item.id, 'AGREED')}
                      className="mt-1 w-full bg-[#141414] text-[#E4E3E0] py-2 px-4 font-mono text-xs hover:bg-emerald-700 transition-colors"
                    >
                      ACCEPT CHANGES
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Discussion — scrollable */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <h3 className="font-serif-italic text-sm opacity-50 uppercase tracking-wider border-b border-[#141414] pb-1 shrink-0 px-6">
            Discussion Log
          </h3>
          <div ref={scrollContainerRef} className="space-y-4 overflow-y-auto flex-1 px-6 pt-4 pb-4">
            {item.comments.length === 0 && (
              <p className="font-mono text-xs text-center opacity-40 py-4">No comments yet.</p>
            )}
            {(() => {
              const lastRevisionId = [...item.comments].reverse().find(c => c.type === 'ITEM_REVISION')
                ?.id;
              return item.comments.map((comment, index) => {
                if (comment.type === 'STATUS_CHANGE') {
                  if (comment.newStatus === 'AGREED') return null;
                  return (
                    <div key={comment.id} className="flex justify-center my-2">
                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                          comment.newStatus === 'DISCUSSING'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : comment.newStatus === 'PENDING'
                              ? 'bg-neutral-100 text-neutral-600 border-neutral-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {comment.author} marked as {comment.newStatus}
                      </div>
                    </div>
                  );
                }
                if (comment.type === 'PROVIDER_CHANGE') {
                  return (
                    <div key={comment.id} className="flex justify-center my-2">
                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                          comment.newProvider === 'BAND'
                            ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                            : comment.newProvider === 'VENUE'
                              ? 'bg-neutral-100 text-neutral-800 border-neutral-200'
                              : 'bg-cyan-100 text-cyan-800 border-cyan-200'
                        }`}
                      >
                        {comment.author} assigned provider: {comment.newProvider}
                      </div>
                    </div>
                  );
                }
                if (comment.type === 'ITEM_REVISION') {
                  const isOwn = comment.role === role;
                  const agreementCommentsForRevision: Comment[] = [];
                  let j = index + 1;
                  while (j < item.comments.length) {
                    const c = item.comments[j];
                    if (c.type === 'STATUS_CHANGE' && c.newStatus === 'AGREED') {
                      agreementCommentsForRevision.push(c);
                    } else if (
                      c.type === 'ITEM_REVISION' ||
                      (c.type === 'STATUS_CHANGE' && c.newStatus !== 'AGREED')
                    ) {
                      break;
                    }
                    j++;
                  }

                  // Check if this is the last revision and it's been agreed to
                  const isLastRevision = comment.id === lastRevisionComment?.id;
                  const isAgreed = isLastRevision && item.status === 'AGREED' && agreementCommentsForRevision.length > 0;

                  return (
                    <div
                      key={comment.id}
                      id={`revision-${comment.id}`}
                      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} my-4 w-full`}
                    >
                      <div
                        className={`relative border p-3 w-full max-w-[85%] text-xs font-mono ${
                          isAgreed
                            ? 'border-emerald-500 border-2 bg-emerald-50'
                            : `border border-[#141414] ${isOwn ? 'bg-[#141414]/5' : 'bg-white'}`
                        }`}
                      >
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
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold opacity-50 line-through ${
                                    comment.previousData.provider === 'BAND'
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : comment.previousData.provider === 'VENUE'
                                        ? 'bg-neutral-100 text-neutral-800'
                                        : 'bg-cyan-100 text-cyan-800'
                                  }`}
                                >
                                  {comment.previousData.provider}
                                </span>
                                <span className="text-[10px] opacity-50">→</span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    comment.newData.provider === 'BAND'
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : comment.newData.provider === 'VENUE'
                                        ? 'bg-neutral-100 text-neutral-800'
                                        : 'bg-cyan-100 text-cyan-800'
                                  }`}
                                >
                                  {comment.newData.provider}
                                </span>
                              </div>
                            </div>
                          )}
                          {comment.previousData?.description !== undefined && comment.newData?.description !== undefined && (
                            <div className="flex flex-col gap-1">
                              <span className="opacity-50 text-[10px] uppercase">Description</span>
                              <div className="line-through opacity-50 italic pl-2 border-l-2 border-[#141414]/10">
                                {comment.previousData.description}
                              </div>
                              <div className="italic pl-2 border-l-2 border-emerald-500/50 text-emerald-700">
                                {comment.newData.description}
                              </div>
                            </div>
                          )}
                          {comment.previousData?.specs && comment.newData?.specs && (
                            <div className="flex flex-col gap-1">
                              <span className="opacity-50 text-[10px] uppercase">Specs</span>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 pl-2 opacity-50 line-through text-[10px]">
                                {Object.entries(comment.previousData.specs).map(([k, v]) => (
                                  <div key={k}>
                                    <span className="capitalize">{k}:</span> {String(v)}
                                  </div>
                                ))}
                              </div>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 pl-2 text-emerald-700 text-[10px]">
                                {Object.entries(comment.newData.specs).map(([k, v]) => (
                                  <div key={k}>
                                    <span className="capitalize">{k}:</span> {String(v)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {comment.pendingUpdates &&
                          comment.id === lastRevisionId &&
                          item.pendingConfirmationFrom === role && (
                            <button
                              onClick={() => onUpdateStatus(item.id, 'AGREED')}
                              className="mt-3 w-full bg-[#141414] text-[#E4E3E0] py-2 px-4 font-mono text-xs hover:bg-emerald-700 transition-colors"
                            >
                              ACCEPT CHANGES
                            </button>
                          )}
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[10px] mt-1 opacity-50">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          comment.role === 'BAND' ? 'bg-indigo-200 text-indigo-700' : 'bg-cyan-200 text-cyan-700'
                        }`}>
                          {comment.role === 'BAND' ? <Music className="w-3 h-3 -mb-0.5" /> : <UserCog className="w-3 h-3" />}
                        </span>
                        {comment.role === role ? 'You' : comment.author} updated brief •{' '}
                        {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {agreementCommentsForRevision.length > 0 && (
                        <div
                          className={`relative flex flex-col gap-0.5 mt-2 ${
                            isOwn ? 'self-start' : 'self-end'
                          } ${item.status === 'REOPENED' ? 'opacity-30' : ''}`}
                        >
                          {item.status !== 'REOPENED' && (
                            <div
                              className={`absolute top-0 bottom-0 w-0.5 bg-emerald-400 ${
                                isOwn ? 'right-0' : 'left-0'
                              }`}
                            />
                          )}
                          {agreementCommentsForRevision.map(ac => (
                            <div key={ac.id} className={`flex flex-col ${isOwn ? 'pr-3' : 'pl-3'}`}>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                    ac.role === 'BAND'
                                      ? 'bg-indigo-200 text-indigo-700'
                                      : 'bg-cyan-200 text-cyan-700'
                                  }`}
                                >
                                  {ac.role === 'BAND' ? (
                                    <Music className="w-3.5 h-3.5 -mb-0.5" />
                                  ) : (
                                    <UserCog className="w-3.5 h-3.5" />
                                  )}
                                </span>
                                <CheckCircle className={`w-5 h-5 shrink-0 ${item.status === 'REOPENED' ? 'text-gray-400' : 'text-emerald-600'}`} />
                                <span className="font-mono text-xs font-semibold">{ac.role === role ? 'You' : ac.author} agreed</span>
                              </div>
                              <span className="font-mono text-[10px] opacity-50 mt-0.5 ml-8">
                                {new Date(ac.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                const bubbleStyle =
                  comment.role === 'BAND'
                    ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                    : 'bg-cyan-100 text-cyan-900 border-cyan-300';
                return (
                  <div key={comment.id} className={`flex flex-col ${comment.role === role ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-3 border ${bubbleStyle}`}>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[10px] mt-1 opacity-50">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        comment.role === 'BAND' ? 'bg-indigo-200 text-indigo-700' : 'bg-cyan-200 text-cyan-700'
                      }`}>
                        {comment.role === 'BAND' ? <Music className="w-3 h-3 -mb-0.5" /> : <UserCog className="w-3 h-3" />}
                      </span>
                      {comment.role === role ? 'You' : comment.author} •{' '}
                      {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              });
            })()}
            {(() => {
              const lastMeaningfulComment = [...item.comments]
                .reverse()
                .find(c => c.type === 'ITEM_REVISION' || c.type === 'STATUS_CHANGE');
              const pendingFromEdit = lastMeaningfulComment?.type === 'ITEM_REVISION';
              const canAgree =
                !pendingFromEdit &&
                item.status === 'PENDING' &&
                (item.pendingConfirmationFrom === role ||
                  (item.createdBy && item.createdBy !== role && !item.pendingConfirmationFrom));
              const canReopen = (item.status === 'PENDING' || item.status === 'AGREED') && !isReopenPromptOpen;
              const isReopened = item.status === 'REOPENED';

              if (!canAgree && !canReopen && !isReopened) return null;
              return (
                <div className="pt-3 pb-2 flex gap-2">
                  {canAgree && (
                    <button
                      onClick={() => onUpdateStatus(item.id, 'AGREED')}
                      className="flex-1 bg-[#141414] text-[#E4E3E0] py-2 px-4 font-mono text-xs hover:bg-emerald-700 transition-colors"
                    >
                      CONFIRM / AGREE
                    </button>
                  )}
                  {canReopen && (
                    <button
                      onClick={() => setIsReopenPromptOpen(true)}
                      className="flex-1 bg-transparent border border-[#141414] text-[#141414] py-2 px-4 font-mono text-xs hover:bg-amber-100 transition-colors"
                    >
                      {item.status === 'AGREED' ? 'RE-OPEN' : 'DISCUSS'}
                    </button>
                  )}
                  {isReopened && (
                    <>
                      <button
                        onClick={() => onEdit()}
                        className="flex-1 bg-transparent border border-[#141414] text-[#141414] py-2 px-4 font-mono text-xs hover:bg-blue-100 transition-colors"
                      >
                        EDIT — PROPOSE CHANGES
                      </button>
                      <button
                        onClick={() => onUpdateStatus(item.id, 'AGREED')}
                        className="flex-1 bg-[#141414] text-[#E4E3E0] py-2 px-4 font-mono text-xs hover:bg-emerald-700 transition-colors"
                      >
                        CONFIRM CURRENT SPEC
                      </button>
                    </>
                  )}
                </div>
              );
            })()}
            <div ref={commentsEndRef} />
          </div>
        </div>
      </div>

      {/* Comment input / Reopen explanation prompt */}
      <div className={`p-4 border-t border-[#141414] shrink-0 ${
        isReopenPromptOpen ? 'bg-amber-50' : 'bg-[#E4E3E0]'
      }`}>
        {isReopenPromptOpen && (
          <div className="mb-2 font-mono text-xs opacity-60 uppercase">Why are you reopening this?</div>
        )}
        <form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            if (text.trim()) {
              if (isReopenPromptOpen) {
                onReopen(item.id, text.trim());
                setIsReopenPromptOpen(false);
              } else {
                onAddComment(item.id, text.trim());
              }
              setText('');
            }
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={isReopenPromptOpen ? "Brief explanation..." : "Type a message..."}
            autoFocus={isReopenPromptOpen}
            className={`flex-1 bg-transparent px-2 py-2 font-mono text-sm focus:outline-none focus:border-b-2 ${
              isReopenPromptOpen
                ? 'border-b border-amber-800'
                : 'border-b border-[#141414]'
            }`}
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className={`p-2 disabled:opacity-50 hover:opacity-80 transition-opacity ${
              isReopenPromptOpen
                ? 'bg-amber-800 text-amber-50'
                : 'bg-[#141414] text-[#E4E3E0]'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
          {isReopenPromptOpen && (
            <button
              type="button"
              onClick={() => {
                setIsReopenPromptOpen(false);
                setText('');
              }}
              className="px-3 py-2 text-xs font-mono opacity-50 hover:opacity-100 transition-opacity"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </Shell>
  );
};
