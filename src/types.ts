export type Role = 'BAND' | 'ENGINEER';

export interface ChatMessage {
  id: string;
  author: string;
  role: Role;
  text: string;
  timestamp: string;
  isSystemUpdate?: boolean;
  itemId?: string;
  itemTitle?: string;
  itemCategory?: Category;
  updateType?: 'STATUS_CHANGE' | 'PROVIDER_CHANGE' | 'ITEM_REVISION';
  itemSnapshot?: {
    previousStatus?: ItemStatus;
    newStatus?: ItemStatus;
    previousProvider?: string;
    newProvider?: string;
    changes?: string[];
  };
}

export type ItemStatus = 'PENDING' | 'DISCUSSING' | 'AGREED';

export type Category = 'MONITORING' | 'MICROPHONES' | 'PA' | 'BACKLINE' | 'LIGHTING' | 'STAGE' | 'POWER' | 'HOSPITALITY';

export interface Comment {
  id: string;
  author: string;
  role: Role;
  text: string;
  timestamp: string;
  type?: 'TEXT' | 'STATUS_CHANGE' | 'PROVIDER_CHANGE' | 'ITEM_REVISION';
  newStatus?: ItemStatus;
  waitingFor?: Role; // Set when one party agreed but waiting for the other to confirm
  agreement?: {
    agreedBy: Role;
    agreedAt: string;
    isFirstAgreement?: boolean;
    isFinalAgreement?: boolean;
  };
  newProvider?: 'BAND' | 'VENUE' | 'ENGINEER';
  previousProvider?: 'BAND' | 'VENUE' | 'ENGINEER';
  previousData?: {
    category?: Category;
    title?: string;
    description?: string;
    specs?: BriefItem['specs'];
    provider?: BriefItem['provider'];
  };
  newData?: {
    category?: Category;
    title?: string;
    description?: string;
    specs?: BriefItem['specs'];
    provider?: BriefItem['provider'];
  };
  pendingUpdates?: Partial<BriefItem>; // For ITEM_REVISION: proposed changes (not yet applied to item)
  isReopenExplanation?: boolean; // For plain text comments explaining why spec was reopened
  isCurrentSpecAgreement?: boolean; // For agreement comments marking confirmation of current spec
}

export interface BriefItem {
  id: string;
  category: Category;
  title: string;
  description: string;
  provider?: 'BAND' | 'VENUE' | 'ENGINEER'; // New field: Who provides the item
  status: ItemStatus;
  requestedBy: string; // Band member name
  createdBy?: Role; // Who created the item
  pendingConfirmationFrom?: Role; // Who needs to confirm
  assignedTo: string; // Engineer name (optional)
  comments: Comment[];
  specs?: {
    make?: string;
    model?: string;
    quantity?: number;
    notes?: string;
  };
}

export const MOCK_GLOBAL_MESSAGES: ChatMessage[] = [
  {
    id: 'g1',
    author: 'Afke',
    role: 'BAND',
    text: 'Hi! Sending the brief for Afke Flaviana: The Spoken Quintet tour. Let me know if you have questions about our setup.',
    timestamp: '2025-03-01T14:00:00Z',
  },
  {
    id: 'g2',
    author: 'Engineer',
    role: 'ENGINEER',
    text: 'Thanks for the details! I have most of the mics we need. Just checking on the jazz drumkit availability for Youri.',
    timestamp: '2025-03-01T14:15:00Z',
  },
  {
    id: 'g3',
    author: 'System',
    role: 'BAND',
    text: '',
    timestamp: '2025-03-01T14:30:00Z',
    isSystemUpdate: true,
    itemId: '5',
    itemTitle: 'Jazz Drumkit',
    itemCategory: 'BACKLINE',
    updateType: 'STATUS_CHANGE',
    itemSnapshot: { previousStatus: 'PENDING', newStatus: 'DISCUSSING' },
  },
  {
    id: 'g4',
    author: 'Youri',
    role: 'BAND',
    text: 'We prefer the house kit if available to save travel space. Otherwise we bring our own.',
    timestamp: '2025-03-01T14:32:00Z',
  },
  {
    id: 'g5',
    author: 'System',
    role: 'BAND',
    text: '',
    timestamp: '2025-03-01T14:50:00Z',
    isSystemUpdate: true,
    itemId: '9',
    itemTitle: 'Sax FX DI',
    itemCategory: 'MICROPHONES',
    updateType: 'STATUS_CHANGE',
    itemSnapshot: { previousStatus: 'PENDING', newStatus: 'DISCUSSING' },
  },
  {
    id: 'g6',
    author: 'Fabio',
    role: 'BAND',
    text: 'For the FX pedal, stereo is preferred but 2x mono works too if thats easier to set up.',
    timestamp: '2025-03-01T14:52:00Z',
  },
];

export const MOCK_ITEMS: BriefItem[] = [
  // Afke (Vocals)
  {
    id: '1',
    category: 'MICROPHONES',
    title: 'Lead Vocal Mic (Afke)',
    description: 'SM58 or comparable. Afke needs this for vocals.',
    provider: 'ENGINEER',
    status: 'AGREED',
    requestedBy: 'Afke',
    createdBy: 'BAND',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-vocal-1',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'I have a Shure SM58 ready. Should work great for vocals.',
        timestamp: '2025-03-01T14:05:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-vocal-2',
        author: 'Afke',
        role: 'BAND',
        text: '',
        timestamp: '2025-03-01T14:10:00Z',
        isCurrentSpecAgreement: true
      },
      {
        id: 'c-vocal-3',
        author: 'Engineer',
        role: 'ENGINEER',
        text: '',
        timestamp: '2025-03-01T14:12:00Z',
        isCurrentSpecAgreement: true
      }
    ],
    specs: { make: 'Shure', model: 'SM58', quantity: 1 }
  },

  // Fabio (Tenor Sax) - Acoustic Mic
  {
    id: '2',
    category: 'MICROPHONES',
    title: 'Sax Mic - Acoustic (Fabio)',
    description: 'For acoustic sound. Prefer AEA E8 NUVO, otherwise AKG 414 XLII.',
    provider: 'ENGINEER',
    status: 'AGREED',
    requestedBy: 'Fabio',
    createdBy: 'BAND',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-sax-1',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'I have the AEA E8 NUVO available. Perfect choice for tenor sax.',
        timestamp: '2025-03-01T14:08:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-sax-2',
        author: 'Fabio',
        role: 'BAND',
        text: "Excellent! That's exactly what we need.",
        timestamp: '2025-03-01T14:10:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-sax-3',
        author: 'Fabio',
        role: 'BAND',
        text: '',
        timestamp: '2025-03-01T14:11:00Z',
        isCurrentSpecAgreement: true
      },
      {
        id: 'c-sax-4',
        author: 'Engineer',
        role: 'ENGINEER',
        text: '',
        timestamp: '2025-03-01T14:13:00Z',
        isCurrentSpecAgreement: true
      }
    ],
    specs: { make: 'AEA', model: 'E8 NUVO', quantity: 1 }
  },

  // Fabio (Tenor Sax) - FX DI
  {
    id: '3',
    category: 'MICROPHONES',
    title: 'Sax FX DI (Fabio)',
    description: 'For pedal FX sound. Stereo DI or 2x mono for pedalboard.',
    provider: 'ENGINEER',
    status: 'PENDING',
    requestedBy: 'Fabio',
    createdBy: 'BAND',
    pendingConfirmationFrom: 'ENGINEER',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-fx-1',
        author: 'Fabio',
        role: 'BAND',
        text: 'We need a DI for the FX pedal output. Stereo is preferred but 2x mono works too.',
        timestamp: '2025-03-01T14:30:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-fx-2',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'I can do stereo DI. Will set that up for you.',
        timestamp: '2025-03-01T14:45:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-fx-3',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'updated the brief:\nSpecs updated',
        timestamp: '2025-03-01T15:10:00Z',
        type: 'ITEM_REVISION',
        previousData: { specs: { quantity: 1, notes: 'Stereo DI for FX pedal' } },
        newData: { specs: { quantity: 2, notes: '2x Radial ProD2 active DI boxes for best isolation' } },
        waitingFor: 'BAND',
        pendingUpdates: { specs: { quantity: 2, notes: '2x Radial ProD2 active DI boxes for best isolation' } }
      },
      {
        id: 'c-fx-4',
        author: 'Fabio',
        role: 'BAND',
        text: 'Ah, dual DI boxes - that makes sense for stereo separation. Much better than a single stereo unit!',
        timestamp: '2025-03-01T15:12:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-fx-5',
        author: 'Fabio',
        role: 'BAND',
        text: 'agreed — waiting for Engineer confirmation',
        timestamp: '2025-03-01T15:13:00Z',
        type: 'STATUS_CHANGE',
        newStatus: 'PENDING',
        waitingFor: 'ENGINEER'
      }
    ],
    specs: { quantity: 2, notes: '2x Radial ProD2 active DI boxes for best isolation' }
  },

  // Fabio (Tenor Sax) - Monitor
  {
    id: '4',
    category: 'MONITORING',
    title: 'Sax Ground Monitor (Fabio)',
    description: 'Dedicated ground monitor for sax. Stereo preferred.',
    provider: 'VENUE',
    status: 'DISCUSSING',
    requestedBy: 'Fabio',
    createdBy: 'BAND',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-mon-1',
        author: 'Fabio',
        role: 'BAND',
        text: 'I really need a dedicated monitor to hear myself properly. Stereo is ideal.',
        timestamp: '2025-03-01T14:25:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-mon-2',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'updated the brief:\nSpecs updated',
        timestamp: '2025-03-01T15:05:00Z',
        type: 'ITEM_REVISION',
        previousData: { specs: { quantity: 1, notes: 'Stereo wedge preferred' } },
        newData: { specs: { quantity: 1, notes: 'Mono wedge - we only have one monitor output available' } },
        waitingFor: 'BAND',
        pendingUpdates: { specs: { quantity: 1, notes: 'Mono wedge - we only have one monitor output available' } }
      },
      {
        id: 'c-mon-3',
        author: 'Fabio',
        role: 'BAND',
        text: 'Mono is fine. Can we at least get the wedge stage right where I can hear it well?',
        timestamp: '2025-03-01T15:08:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-mon-4',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'Perfect. I can place it stage right, angled toward you. You\'ll have a clear monitor mix.',
        timestamp: '2025-03-01T15:09:00Z',
        type: 'TEXT'
      }
    ],
    specs: { quantity: 1, notes: 'Mono wedge, stage right position' }
  },

  // Abel (Guitar) - Amp
  {
    id: '5',
    category: 'BACKLINE',
    title: 'Koch Jupiter Amp (Abel)',
    description: 'Abel brings his own Koch Jupiter amp.',
    provider: 'BAND',
    status: 'AGREED',
    requestedBy: 'Abel',
    createdBy: 'BAND',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-amp-1',
        author: 'Abel',
        role: 'BAND',
        text: 'I bring my own Koch Jupiter. Just need to mic it up.',
        timestamp: '2025-03-01T14:20:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-amp-2',
        author: 'Engineer',
        role: 'ENGINEER',
        text: '',
        timestamp: '2025-03-01T14:22:00Z',
        isCurrentSpecAgreement: true
      }
    ],
    specs: { make: 'Koch', model: 'Jupiter', quantity: 1 }
  },

  // Abel (Guitar) - Amp Mic
  {
    id: '6',
    category: 'MICROPHONES',
    title: 'Guitar Amp Mic (Abel)',
    description: 'Mic for Koch Jupiter amp.',
    provider: 'ENGINEER',
    status: 'PENDING',
    requestedBy: 'Abel',
    createdBy: 'BAND',
    pendingConfirmationFrom: 'ENGINEER',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-guitar-mic-1',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'I will mic your amp with a Shure SM57. Standard setup for guitar.',
        timestamp: '2025-03-01T14:23:00Z',
        type: 'TEXT'
      }
    ],
    specs: { make: 'Shure', model: 'SM57', quantity: 1 }
  },

  // Abel (Guitar) - Power - WITH REOPEN FLOW
  {
    id: '7',
    category: 'POWER',
    title: 'Guitar Pedalboard Power (Abel)',
    description: 'Power point for Abel pedalboard.',
    provider: 'VENUE',
    status: 'AGREED',
    requestedBy: 'Abel',
    createdBy: 'BAND',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-power-1',
        author: 'Abel',
        role: 'BAND',
        text: 'Need one power point stage left for the pedalboard.',
        timestamp: '2025-03-01T14:19:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-power-2',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'Stage left power is confirmed.',
        timestamp: '2025-03-01T14:20:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-power-3',
        author: 'Abel',
        role: 'BAND',
        text: '',
        timestamp: '2025-03-01T14:21:00Z',
        isCurrentSpecAgreement: true
      },
      {
        id: 'c-power-4',
        author: 'Engineer',
        role: 'ENGINEER',
        text: '',
        timestamp: '2025-03-01T14:22:00Z',
        isCurrentSpecAgreement: true
      },
      {
        id: 'c-power-5',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'Actually, I need to know: will you need a USB extension cable too, or just the power?',
        timestamp: '2025-03-01T16:00:00Z',
        isReopenExplanation: true
      },
      {
        id: 'c-power-6',
        author: 'Abel',
        role: 'BAND',
        text: "No, just power. I bring my own cables and everything else. Just the outlet is what I need.",
        timestamp: '2025-03-01T16:02:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-power-7',
        author: 'Abel',
        role: 'BAND',
        text: '',
        timestamp: '2025-03-01T16:03:00Z',
        isCurrentSpecAgreement: true
      },
      {
        id: 'c-power-8',
        author: 'Engineer',
        role: 'ENGINEER',
        text: '',
        timestamp: '2025-03-01T16:04:00Z',
        isCurrentSpecAgreement: true
      }
    ],
    specs: { quantity: 1, notes: 'Stage left area - power only' }
  },

  // Lester (Bass) - Bass Amp - WITH REVISION PROPOSAL
  {
    id: '8',
    category: 'BACKLINE',
    title: 'Bass Amp (Lester)',
    description: 'If backline is available, we prefer to use it. Otherwise we bring our own.',
    provider: 'VENUE',
    status: 'AGREED',
    requestedBy: 'Lester',
    createdBy: 'BAND',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-bass-1',
        author: 'Lester',
        role: 'BAND',
        text: 'Do you have a decent bass amp available? We can bring our own if needed.',
        timestamp: '2025-03-01T14:18:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-bass-2',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'updated the brief:\nSpecs updated',
        timestamp: '2025-03-01T14:35:00Z',
        type: 'ITEM_REVISION',
        previousData: { specs: { notes: 'House amp or band gear' } },
        newData: { specs: { make: 'Markbass', model: 'Combo 102P', quantity: 1, notes: 'Solid 200W combo, great for intimate venues' } },
        waitingFor: 'BAND',
        pendingUpdates: { specs: { make: 'Markbass', model: 'Combo 102P', quantity: 1, notes: 'Solid 200W combo, great for intimate venues' } }
      },
      {
        id: 'c-bass-3',
        author: 'Lester',
        role: 'BAND',
        text: "The Markbass combo is a solid choice. I've used that model before and it's reliable. Perfect for our needs.",
        timestamp: '2025-03-01T14:37:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-bass-4',
        author: 'Lester',
        role: 'BAND',
        text: '',
        timestamp: '2025-03-01T14:38:00Z',
        isCurrentSpecAgreement: true
      },
      {
        id: 'c-bass-5',
        author: 'Engineer',
        role: 'ENGINEER',
        text: '',
        timestamp: '2025-03-01T14:39:00Z',
        isCurrentSpecAgreement: true
      }
    ],
    specs: { make: 'Markbass', model: 'Combo 102P', quantity: 1, notes: 'Solid 200W combo, great for intimate venues' }
  },

  // Lester (Bass) - Amp Mic
  {
    id: '9',
    category: 'MICROPHONES',
    title: 'Bass Amp Mic (Lester)',
    description: 'Mic for bass amp.',
    provider: 'ENGINEER',
    status: 'PENDING',
    requestedBy: 'Lester',
    createdBy: 'BAND',
    pendingConfirmationFrom: 'ENGINEER',
    assignedTo: 'Engineer',
    comments: [],
    specs: { make: 'Shure', model: 'SM7B', quantity: 1 }
  },

  // Lester (Bass) - Power - WITH REOPEN (BAND-INITIATED)
  {
    id: '10',
    category: 'POWER',
    title: 'Bass Pedalboard Power (Lester)',
    description: 'Power point for Lester pedalboard.',
    provider: 'VENUE',
    status: 'AGREED',
    requestedBy: 'Lester',
    createdBy: 'BAND',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-bass-power-1',
        author: 'Lester',
        role: 'BAND',
        text: 'Need stage right power for bass rig. Two outlets if possible for redundancy.',
        timestamp: '2025-03-01T14:19:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-bass-power-2',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'Stage right only has one outlet available, but it has solid grounding.',
        timestamp: '2025-03-01T14:21:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-bass-power-3',
        author: 'Lester',
        role: 'BAND',
        text: '',
        timestamp: '2025-03-01T14:23:00Z',
        isCurrentSpecAgreement: true
      },
      {
        id: 'c-bass-power-4',
        author: 'Engineer',
        role: 'ENGINEER',
        text: '',
        timestamp: '2025-03-01T14:25:00Z',
        isCurrentSpecAgreement: true
      },
      {
        id: 'c-bass-power-5',
        author: 'Lester',
        role: 'BAND',
        text: 'Wait, just confirmed with the rest of the band — can we add a second outlet? We can bring a quality power strip if needed.',
        timestamp: '2025-03-01T15:45:00Z',
        isReopenExplanation: true
      },
      {
        id: 'c-bass-power-6',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'Good news! I can run a stage box with two outlets to stage right. Much cleaner than a power strip.',
        timestamp: '2025-03-01T15:47:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-bass-power-7',
        author: 'Lester',
        role: 'BAND',
        text: 'Perfect! That sounds even better.',
        timestamp: '2025-03-01T15:48:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-bass-power-8',
        author: 'Lester',
        role: 'BAND',
        text: '',
        timestamp: '2025-03-01T15:49:00Z',
        isCurrentSpecAgreement: true
      },
      {
        id: 'c-bass-power-9',
        author: 'Engineer',
        role: 'ENGINEER',
        text: '',
        timestamp: '2025-03-01T15:50:00Z',
        isCurrentSpecAgreement: true
      }
    ],
    specs: { quantity: 2, notes: 'Stage right area - stage box with dual outlets' }
  },

  // Youri (Drums) - Jazz Drumkit
  {
    id: '11',
    category: 'BACKLINE',
    title: 'Jazz Drumkit (Youri)',
    description: 'If jazz drumkit is available at the venue, we prefer to use it to save travel space.',
    provider: 'VENUE',
    status: 'DISCUSSING',
    requestedBy: 'Youri',
    createdBy: 'BAND',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-drums-1',
        author: 'Youri',
        role: 'BAND',
        text: 'Prefer a house jazz kit if available to save transport space. Otherwise we bring our own.',
        timestamp: '2025-03-01T14:20:00Z',
        type: 'TEXT'
      }
    ],
    specs: { notes: 'Jazz configuration (22" kick, smaller tom sizes)' }
  },

  // Youri (Drums) - Drum Monitoring
  {
    id: '12',
    category: 'MONITORING',
    title: 'Drum Monitor (Youri)',
    description: 'Dedicated monitor for drums.',
    provider: 'VENUE',
    status: 'DISCUSSING',
    requestedBy: 'Youri',
    createdBy: 'BAND',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-drum-mon-1',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'updated the brief:\nDescription updated',
        timestamp: '2025-03-01T15:15:00Z',
        type: 'ITEM_REVISION',
        previousData: { specs: { quantity: 1, notes: 'For kick drum and bass reference' } },
        newData: { specs: { quantity: 2, notes: 'Small wedge behind kit for click/kick. Second larger wedge for full mix' } },
        waitingFor: 'BAND',
        pendingUpdates: { specs: { quantity: 2, notes: 'Small wedge behind kit for click/kick. Second larger wedge for full mix' } }
      },
      {
        id: 'c-drum-mon-2',
        author: 'Youri',
        role: 'BAND',
        text: 'Actually, two monitors sounds perfect! That setup gives me way better control over what I hear.',
        timestamp: '2025-03-01T15:17:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-drum-mon-3',
        author: 'Youri',
        role: 'BAND',
        text: 'agreed — waiting for Engineer confirmation',
        timestamp: '2025-03-01T15:18:00Z',
        type: 'STATUS_CHANGE',
        newStatus: 'PENDING',
        waitingFor: 'ENGINEER'
      }
    ],
    specs: { quantity: 2, notes: 'Small wedge behind kit for click/kick. Second larger wedge for full mix' }
  },

  // Stage Setup
  {
    id: '13',
    category: 'STAGE',
    title: 'Music Stands',
    description: 'If available, we would like to use music stands.',
    provider: 'VENUE',
    status: 'PENDING',
    requestedBy: 'Band',
    createdBy: 'BAND',
    pendingConfirmationFrom: 'ENGINEER',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-stands-1',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'Do you need these for sheet music during the set?',
        timestamp: '2025-03-01T14:40:00Z',
        type: 'TEXT'
      }
    ],
    specs: { quantity: 5, notes: 'For Afke, Fabio, Abel, Lester, and spare' }
  },

  // Hospitality
  {
    id: '14',
    category: 'HOSPITALITY',
    title: 'Beverages & Catering',
    description: 'Water, coffee, and drinks during setup and show.',
    provider: 'VENUE',
    status: 'PENDING',
    requestedBy: 'Band',
    createdBy: 'BAND',
    pendingConfirmationFrom: 'ENGINEER',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-drinks-1',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'I can arrange water and coffee. Will prepare it before soundcheck.',
        timestamp: '2025-03-01T14:50:00Z',
        type: 'TEXT'
      }
    ],
    specs: { notes: '5 band members + water, coffee, tea' }
  },

  {
    id: '15',
    category: 'HOSPITALITY',
    title: 'Crew Meals',
    description: '4x no dietary restrictions, 1x vegan.',
    provider: 'VENUE',
    status: 'DISCUSSING',
    requestedBy: 'Band',
    createdBy: 'BAND',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-meals-1',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'Can you let me know the vegan options available? And yes, Afke, you can eat too! 😄',
        timestamp: '2025-03-01T14:55:00Z',
        type: 'TEXT'
      }
    ],
    specs: { quantity: 5, notes: '4 regular, 1 vegan' }
  },

  {
    id: '16',
    category: 'HOSPITALITY',
    title: 'Parking',
    description: '1 parking spot for the vehicle.',
    provider: 'VENUE',
    status: 'AGREED',
    requestedBy: 'Band',
    createdBy: 'BAND',
    assignedTo: 'Engineer',
    comments: [],
    specs: { quantity: 1, notes: 'Close to load-in area' }
  }
];
