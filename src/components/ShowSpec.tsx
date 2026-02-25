import React from 'react';
import { BriefItem } from '../types';
import { Download, Printer } from 'lucide-react';

interface ShowSpecProps {
  items: BriefItem[];
}

export const ShowSpec: React.FC<ShowSpecProps> = ({ items }) => {
  const agreedItems = items.filter(i => i.status === 'AGREED');
  const pendingItems = items.filter(i => i.status !== 'AGREED');

  const categories = Array.from(new Set(agreedItems.map(i => i.category)));

  return (
    <div className="max-w-4xl mx-auto bg-white p-12 shadow-xl border border-[#141414] min-h-screen">
      <div className="flex justify-between items-start mb-12 border-b-2 border-[#141414] pb-8">
        <div>
          <h1 className="text-4xl font-bold font-mono tracking-tighter mb-2">SHOW SPECIFICATION</h1>
          <p className="font-serif-italic text-lg opacity-60">Generated via UC-5 Technical Brief</p>
        </div>
        <div className="text-right font-mono text-sm">
          <div className="mb-1">DATE: {new Date().toLocaleDateString()}</div>
          <div className="mb-1">REF: UC5-2023-884</div>
          <div className="flex gap-2 mt-4 justify-end">
            <button className="p-2 border border-[#141414] hover:bg-[#141414] hover:text-white transition-colors">
              <Printer className="w-4 h-4" />
            </button>
            <button className="p-2 border border-[#141414] hover:bg-[#141414] hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 font-mono text-neutral-400">
          No agreed items yet. Finalize items in the brief to populate the spec.
        </div>
      )}

      {categories.map(cat => (
        <div key={cat} className="mb-10">
          <h2 className="text-xl font-bold border-b border-[#141414] mb-4 pb-2 flex items-baseline gap-4">
            <span className="font-mono">{cat}</span>
            <span className="text-xs font-normal font-serif-italic opacity-50">SECTION 0{categories.indexOf(cat) + 1}</span>
          </h2>
          <table className="w-full text-sm text-left">
            <thead className="font-mono text-xs uppercase opacity-50 border-b border-neutral-200">
              <tr>
                <th className="py-2 w-1/4">Item</th>
                <th className="py-2 w-1/2">Details</th>
                <th className="py-2 w-1/4 text-right">Qty / Notes</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {agreedItems.filter(i => i.category === cat).map(item => (
                <tr key={item.id} className="border-b border-neutral-100">
                  <td className="py-3 font-bold">{item.title}</td>
                  <td className="py-3 opacity-80">
                    {item.specs?.make} {item.specs?.model}
                    {item.description && <div className="text-xs opacity-60 mt-1">{item.description}</div>}
                  </td>
                  <td className="py-3 text-right">
                    {item.specs?.quantity && <span>x{item.specs.quantity}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {pendingItems.length > 0 && (
        <div className="mt-16 p-6 bg-neutral-100 border border-neutral-300 border-dashed">
          <h3 className="font-mono font-bold text-red-600 mb-4 flex items-center gap-2">
            PENDING ITEMS (NOT CONFIRMED)
          </h3>
          <ul className="list-disc list-inside font-mono text-sm opacity-70">
            {pendingItems.map(item => (
              <li key={item.id}>{item.title} ({item.status})</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-20 pt-8 border-t border-[#141414] grid grid-cols-2 gap-12">
        <div>
          <div className="h-24 border-b border-[#141414] mb-2"></div>
          <div className="font-mono text-xs uppercase">Band Representative Signature</div>
        </div>
        <div>
          <div className="h-24 border-b border-[#141414] mb-2"></div>
          <div className="font-mono text-xs uppercase">Venue Engineer Signature</div>
        </div>
      </div>
    </div>
  );
};
