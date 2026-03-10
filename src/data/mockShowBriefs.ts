import { BriefItem } from '../types';
import { MOCK_ITEMS } from '../types';

// Helper to create varied mock briefs for different shows using the same workflow structure
const createShowBriefs = (baseCount: number, showName: string): BriefItem[] => {
  const briefs: BriefItem[] = [];
  const categories: Array<BriefItem['category']> = ['MICROPHONES', 'MONITORING', 'PA', 'BACKLINE', 'LIGHTING', 'STAGE', 'POWER', 'HOSPITALITY'];
  const statuses: Array<BriefItem['status']> = ['AGREED', 'PENDING', 'DISCUSSING'];
  const roles: Array<'BAND' | 'VENUE' | 'ENGINEER'> = ['BAND', 'VENUE', 'ENGINEER'];

  for (let i = 0; i < baseCount; i++) {
    const status = statuses[i % statuses.length];
    const category = categories[i % categories.length];
    const provider = roles[i % roles.length];
    const isBand = i % 2 === 0;

    const comments: any[] = [
      {
        id: `c-${i}-1`,
        author: isBand ? 'Band' : 'Engineer',
        role: isBand ? 'BAND' : 'ENGINEER',
        text: `We need ${category.toLowerCase()} for this setup.`,
        timestamp: new Date(Date.now() - 86400000 * (baseCount - i)).toISOString(),
        type: 'TEXT'
      }
    ];

    if (status === 'AGREED') {
      comments.push({
        id: `c-${i}-2`,
        author: isBand ? 'Engineer' : 'Band',
        role: isBand ? 'ENGINEER' : 'BAND',
        text: `Confirmed, we can provide ${category.toLowerCase()}.`,
        timestamp: new Date(Date.now() - 86400000 * (baseCount - i - 1)).toISOString(),
        type: 'TEXT'
      },
      {
        id: `c-${i}-3`,
        author: isBand ? 'Band' : 'Engineer',
        role: isBand ? 'BAND' : 'ENGINEER',
        text: '',
        timestamp: new Date(Date.now() - 86400000 * (baseCount - i - 1) + 300000).toISOString(),
        isCurrentSpecAgreement: true
      },
      {
        id: `c-${i}-4`,
        author: isBand ? 'Engineer' : 'Band',
        role: isBand ? 'ENGINEER' : 'BAND',
        text: '',
        timestamp: new Date(Date.now() - 86400000 * (baseCount - i - 1) + 600000).toISOString(),
        isCurrentSpecAgreement: true
      });
    } else if (status === 'PENDING') {
      comments.push({
        id: `c-${i}-2`,
        author: isBand ? 'Engineer' : 'Band',
        role: isBand ? 'ENGINEER' : 'BAND',
        text: `Let me check what we have available for ${category.toLowerCase()}.`,
        timestamp: new Date(Date.now() - 86400000 * (baseCount - i - 1)).toISOString(),
        type: 'TEXT'
      },
      {
        id: `c-${i}-3`,
        author: isBand ? 'Band' : 'Engineer',
        role: isBand ? 'BAND' : 'ENGINEER',
        text: 'agreed — waiting for confirmation',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'STATUS_CHANGE',
        newStatus: 'PENDING',
        waitingFor: isBand ? 'ENGINEER' : 'BAND'
      });
    } else if (status === 'DISCUSSING') {
      comments.push({
        id: `c-${i}-2`,
        author: isBand ? 'Engineer' : 'Band',
        role: isBand ? 'ENGINEER' : 'BAND',
        text: `Actually, can we adjust the specs for ${category.toLowerCase()}?`,
        timestamp: new Date(Date.now() - 86400000 * (baseCount - i - 1)).toISOString(),
        type: 'TEXT'
      },
      {
        id: `c-${i}-3`,
        author: isBand ? 'Band' : 'Engineer',
        role: isBand ? 'BAND' : 'ENGINEER',
        text: 'opened for discussion',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        type: 'STATUS_CHANGE',
        newStatus: 'DISCUSSING'
      });
    }

    briefs.push({
      id: String(i + 1),
      category,
      title: `${category} Setup (${showName})`,
      description: `${category} requirements for ${showName} show.`,
      provider,
      status,
      requestedBy: isBand ? 'Band Manager' : 'Venue Coordinator',
      createdBy: isBand ? 'BAND' : 'ENGINEER',
      pendingConfirmationFrom: status === 'PENDING' ? (isBand ? 'ENGINEER' : 'BAND') : undefined,
      assignedTo: 'Sound Engineer',
      comments,
      specs: {
        make: `${category} Make`,
        model: `Model ${i + 1}`,
        quantity: (i % 3) + 1
      }
    });
  }

  return briefs;
};

export const MOCK_SHOW_BRIEFS: Record<string, BriefItem[]> = {
  'show-0': MOCK_ITEMS, // Fake Flaviana Quintet (original mock data)
  'show-1': createShowBriefs(12, 'Paradiso'), // 12 briefs
  'show-2': createShowBriefs(8, 'Melkweg'), // 8 briefs
  'show-3': createShowBriefs(18, 'Shelter'), // 18 briefs (complex venue)
  'show-4': createShowBriefs(9, 'Tolhuistuin'), // 9 briefs (outdoor)
};
