# This file is only for editing file nodes, do not break the structure

## Project Description
Modern and interactive Expense Management Web App with animated UI for expense tracking. The app supports multiple groups (Family, Friends, Office) with designated leaders and animated expense tracking interface.

## Key Features
- Multiple expense groups with animated group switching
- Group management with designated leaders
- Expense tracking with interactive visualizations
- Animated cards and modals with smooth transitions
- Fully responsive design with mobile-first approach

/src
├── assets/          # Static resources directory, storing static files like images and fonts
│
├── components/      # Components directory
│   ├── ui/         # Pre-installed shadcn/ui components, avoid modifying or rewriting unless necessary
│
├── features/        # Feature modules organized by business domain
│   └── expense/    # Expense management feature
│       ├── components/  # Expense-related UI components
│       │   ├── Header.tsx             # App header with notifications and user menu
│       │   ├── GroupSelector.tsx      # Group selection sidebar with animations
│       │   ├── ExpenseList.tsx        # List of expenses with animated cards
│       │   ├── GroupSummary.tsx       # Group statistics and members display
│       │   ├── AddExpenseDialog.tsx   # Modal for adding new expenses
│       │   ├── AddGroupDialog.tsx     # Modal for creating new groups
│       │   └── ExpenseDetailDialog.tsx # Modal for viewing expense details
│       │
│       ├── store/       # State management
│       │   └── expense-store.ts       # Zustand store for expenses and groups
│       │
│       ├── types.ts     # TypeScript type definitions
│       └── utils.ts     # Utility functions for formatting and calculations
│
├── hooks/          # Custom Hooks directory
│   ├── use-mobile.ts # Pre-installed mobile detection Hook from shadcn (import { useIsMobile } from '@/hooks/use-mobile')
│   └── use-toast.ts  # Toast notification system hook for displaying toast messages (import { useToast } from '@/hooks/use-toast')
│
├── lib/            # Utility library directory
│   └── utils.ts    # Utility functions, including the cn function for merging Tailwind class names
│
├── pages/          # Page components directory, based on React Router structure
│   ├── HomePage.tsx # Home page component with expense tracking interface
│   └── NotFoundPage.tsx # 404 error page component, displays when users access non-existent routes
│
├── App.tsx         # Root component, with React Router routing system configured
│                   # Add new route configurations in this file
│                   # Includes catch-all route (*) for 404 page handling
│
├── main.tsx        # Entry file, rendering the root component and mounting to the DOM
│
├── index.css       # Global styles file, containing Tailwind configuration, custom animations and design system
│                   # Includes animation keyframes and utility classes for transitions
│
└── tailwind.config.js  # Tailwind CSS v3 configuration file
                      # Contains theme customization, plugins, and content paths
                      # Includes shadcn/ui theme configuration 