export type Role = 'BAND' | 'ENGINEER';

export type ItemStatus = 'PENDING' | 'DISCUSSING' | 'AGREED' | 'REJECTED';

export type Category = 'MONITORING' | 'MICROPHONES' | 'PA' | 'BACKLINE' | 'LIGHTING' | 'STAGE' | 'POWER' | 'HOSPITALITY';

export interface Comment {
  id: string;
  author: string;
  role: Role;
  text: string;
  timestamp: string;
  type?: 'TEXT' | 'STATUS_CHANGE' | 'PROVIDER_CHANGE' | 'ITEM_REVISION';
  newStatus?: ItemStatus;
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

export const MOCK_ITEMS: BriefItem[] = [
  // Afke (Vocals)
  {
    id: '1',
    category: 'MICROPHONES',
    title: 'Lead Vocal Mic',
    description: 'SM58 or comparable for Afke.',
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
        text: 'changed specs to Shure Beta 58A',
        timestamp: '2023-10-26T10:15:00Z',
        type: 'ITEM_REVISION',
        previousData: { specs: { make: 'Shure', model: 'SM58', quantity: 1 } },
        newData: { specs: { make: 'Shure', model: 'Beta 58A', quantity: 1 } }
      },
      {
        id: 'c-vocal-2',
        author: 'Afke',
        role: 'BAND',
        text: 'even better!',
        timestamp: '2023-10-26T10:20:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-vocal-3',
        author: 'Afke',
        role: 'BAND',
        text: 'changed status to AGREED',
        timestamp: '2023-10-26T10:21:00Z',
        type: 'STATUS_CHANGE',
        newStatus: 'AGREED'
      }
    ],
    specs: { make: 'Shure', model: 'Beta 58A', quantity: 1 }
  },
  // Fabio (Sax)
  {
    id: '2',
    category: 'MICROPHONES',
    title: 'Tenor Sax Mic (Acoustic)',
    description: 'For acoustic sound. Prefer AEA E8 NUVO, otherwise AKG 414 XLII.',
    provider: 'ENGINEER',
    status: 'PENDING',
    requestedBy: 'Fabio',
    createdBy: 'BAND',
    pendingConfirmationFrom: 'ENGINEER',
    assignedTo: 'Engineer',
    comments: [],
    specs: { make: 'AEA', model: 'E8 NUVO', quantity: 1 }
  },
  {
    id: '3',
    category: 'MICROPHONES',
    title: 'Sax FX DI',
    description: 'For pedal FX sound. Stereo DI or 2x Mono.',
    provider: 'ENGINEER',
    status: 'PENDING',
    requestedBy: 'Fabio',
    createdBy: 'BAND',
    pendingConfirmationFrom: 'ENGINEER',
    assignedTo: 'Engineer',
    comments: [],
    specs: { quantity: 2, notes: 'Stereo DI' }
  },
  {
    id: '4',
    category: 'MONITORING',
    title: 'Sax Monitor',
    description: 'Dedicated ground monitor, stereo preferred.',
    provider: 'VENUE',
    status: 'PENDING',
    requestedBy: 'Fabio',
    createdBy: 'BAND',
    pendingConfirmationFrom: 'ENGINEER',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-sax-mon-1',
        author: 'Engineer',
        role: 'ENGINEER',
        text: "I can't do stereo monitors, is mono okay?",
        timestamp: '2023-10-26T10:30:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-sax-mon-2',
        author: 'Fabio',
        role: 'BAND',
        text: "That's fine.",
        timestamp: '2023-10-26T10:35:00Z',
        type: 'TEXT'
      },
      {
        id: 'c-sax-mon-3',
        author: 'Fabio',
        role: 'BAND',
        text: 'changed status to PENDING (waiting for ENGINEER)',
        timestamp: '2023-10-26T10:36:00Z',
        type: 'STATUS_CHANGE',
        newStatus: 'PENDING'
      }
    ],
    specs: { quantity: 1, notes: 'Stereo wedge' }
  },
  // Abel (Guitar)
  {
    id: '5',
    category: 'POWER',
    title: 'Guitar Power',
    description: 'Power point for Pedalboard.',
    provider: 'VENUE',
    status: 'AGREED',
    requestedBy: 'Abel',
    assignedTo: 'Engineer',
    comments: [],
    specs: { quantity: 1 }
  },
  {
    id: '6',
    category: 'MICROPHONES',
    title: 'Guitar Amp Mic',
    description: 'Mic for Koch Jupiter amp.',
    provider: 'ENGINEER',
    status: 'PENDING',
    requestedBy: 'Abel',
    createdBy: 'BAND',
    pendingConfirmationFrom: 'ENGINEER',
    assignedTo: 'Engineer',
    comments: [],
    specs: { quantity: 1 }
  },
  {
    id: '6b',
    category: 'BACKLINE',
    title: 'Koch Jupiter Amp',
    description: 'Abel brings his own amp.',
    provider: 'BAND',
    status: 'AGREED',
    requestedBy: 'Abel',
    assignedTo: 'Engineer',
    comments: [],
    specs: { make: 'Koch', model: 'Jupiter', quantity: 1 }
  },
  // Lester (Bass)
  {
    id: '7',
    category: 'BACKLINE',
    title: 'Bass Amp',
    description: 'If backline is available, we would like to use it. Otherwise we bring our own.',
    provider: 'VENUE',
    status: 'DISCUSSING',
    requestedBy: 'Lester',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c1',
        author: 'Lester',
        role: 'BAND',
        text: 'Do you have a bass amp available?',
        timestamp: '2023-10-26T10:00:00Z'
      }
    ],
    specs: { notes: 'House amp preferred' }
  },
  {
    id: '8',
    category: 'POWER',
    title: 'Bass Power',
    description: 'Power point for Pedalboard.',
    provider: 'VENUE',
    status: 'AGREED',
    requestedBy: 'Lester',
    assignedTo: 'Engineer',
    comments: [],
    specs: { quantity: 1 }
  },
  // Youri (Drums)
  {
    id: '9',
    category: 'BACKLINE',
    title: 'Drum Kit',
    description: 'If jazz drumkit is available, we would like to use it. Otherwise we bring our own.',
    provider: 'VENUE',
    status: 'DISCUSSING',
    requestedBy: 'Youri',
    assignedTo: 'Engineer',
    comments: [
       {
        id: 'c2',
        author: 'Youri',
        role: 'BAND',
        text: 'Prefer house kit to save travel space.',
        timestamp: '2023-10-26T10:05:00Z'
      }
    ],
    specs: { notes: 'Jazz kit' }
  },
  // General / Hospitality
  {
    id: '10',
    category: 'STAGE',
    title: 'Music Stands',
    description: 'If available, we would like to use them.',
    provider: 'VENUE',
    status: 'PENDING',
    requestedBy: 'Band',
    createdBy: 'BAND',
    pendingConfirmationFrom: 'ENGINEER',
    assignedTo: 'Engineer',
    comments: [],
    specs: { quantity: 5 }
  },
  {
    id: '11',
    category: 'HOSPITALITY',
    title: 'Crew Meals',
    description: '4x no restrictions, 1x vegan.',
    provider: 'VENUE',
    status: 'DISCUSSING',
    requestedBy: 'Band',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-meals-1',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'can I have food too?!',
        timestamp: '2023-10-26T11:00:00Z',
        type: 'TEXT'
      }
    ],
    specs: { quantity: 5 }
  },
  {
    id: '12',
    category: 'HOSPITALITY',
    title: 'Parking',
    description: '1 parking spot required.',
    provider: 'VENUE',
    status: 'AGREED',
    requestedBy: 'Band',
    assignedTo: 'Engineer',
    comments: [],
    specs: { quantity: 1 }
  },
  // Engineer Added Items
  {
    id: '13',
    category: 'PA',
    title: 'House PA',
    description: 'Main PA system for the venue.',
    provider: 'VENUE',
    status: 'PENDING',
    requestedBy: 'Engineer',
    createdBy: 'ENGINEER',
    pendingConfirmationFrom: 'BAND',
    assignedTo: 'Engineer',
    comments: [
      {
        id: 'c-pa-1',
        author: 'Engineer',
        role: 'ENGINEER',
        text: 'Suggest using the house PA of Fifth NRE.',
        timestamp: '2023-10-26T09:00:00Z',
        type: 'TEXT'
      }
    ],
    specs: { notes: 'Fifth NRE House System' }
  },
  {
    id: '14',
    category: 'STAGE',
    title: 'Stage Size',
    description: 'The stage will be 5 x 3 meters, is that big enough for you?',
    provider: 'VENUE',
    status: 'DISCUSSING',
    requestedBy: 'Engineer',
    createdBy: 'ENGINEER',
    assignedTo: 'Engineer',
    comments: [],
    specs: { notes: '5m x 3m' }
  }
];
