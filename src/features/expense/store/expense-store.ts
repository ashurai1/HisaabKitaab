import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Group, Expense, User } from '../types';
import { nanoid } from 'nanoid';

interface ExpenseState {
  // User state
  currentUser: User;
  
  // Groups state
  groups: Group[];
  activeGroupId: string | null;
  
  // Expenses state
  expenses: Expense[];
  
  // Actions
  setActiveGroup: (groupId: string) => void;
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => void;
  updateGroup: (groupId: string, updates: Partial<Omit<Group, 'id' | 'createdAt'>>) => void;
  deleteGroup: (groupId: string) => void;
  
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expenseId: string, updates: Partial<Omit<Expense, 'id'>>) => void;
  deleteExpense: (expenseId: string) => void;
}

// Mock data for initial state
const mockCurrentUser: User = {
  id: 'user-1',
  name: 'Rajesh Sharma',
  email: 'rajesh@example.com',
  avatar: 'https://i.pravatar.cc/150?img=1'
};

const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 'user-2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 'user-3',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: 'user-4',
    name: 'Sunita Singh',
    email: 'sunita@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4'
  }
];

const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Parivar',
    description: 'Family expenses',
    leaderId: 'user-1',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    color: 'blue',
    icon: 'home',
    createdAt: new Date().toISOString()
  },
  {
    id: 'group-2',
    name: 'Dost Log',
    description: 'Weekend trips and dinners',
    leaderId: 'user-2',
    members: [mockUsers[0], mockUsers[1], mockUsers[3]],
    color: 'green',
    icon: 'users',
    createdAt: new Date().toISOString()
  },
  {
    id: 'group-3',
    name: 'Karyalaya',
    description: 'Work-related expenses',
    leaderId: 'user-1',
    members: [mockUsers[0], mockUsers[2], mockUsers[3]],
    color: 'violet',
    icon: 'briefcase',
    createdAt: new Date().toISOString()
  }
];

const mockExpenses: Expense[] = [
  {
    id: 'expense-1',
    groupId: 'group-1',
    title: 'Grocery from Big Bazaar',
    amount: 3750.50,
    category: 'food',
    paidBy: 'user-1',
    date: new Date().toISOString(),
    splitBetween: ['user-1', 'user-2', 'user-3'],
    notes: 'Weekly groceries'
  },
  {
    id: 'expense-2',
    groupId: 'group-1',
    title: 'BSES Electricity bill',
    amount: 5200,
    category: 'utilities',
    paidBy: 'user-1',
    date: new Date(Date.now() - 86400000).toISOString(), // yesterday
    splitBetween: ['user-1', 'user-2']
  },
  {
    id: 'expense-3',
    groupId: 'group-2',
    title: 'PVR Cinemas movie',
    amount: 1800,
    category: 'entertainment',
    paidBy: 'user-2',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    splitBetween: ['user-1', 'user-2', 'user-3']
  },
  {
    id: 'expense-4',
    groupId: 'group-2',
    title: 'Dinner at Punjab Grill',
    amount: 4350.75,
    category: 'food',
    paidBy: 'user-1',
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    splitBetween: ['user-1', 'user-2', 'user-3']
  },
  {
    id: 'expense-5',
    groupId: 'group-3',
    title: 'Office supplies from Croma',
    amount: 2895.25,
    category: 'shopping',
    paidBy: 'user-3',
    date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    splitBetween: ['user-1', 'user-2', 'user-3']
  },
  {
    id: 'expense-6',
    groupId: 'group-3',
    title: 'Team lunch at Taj',
    amount: 3580.50,
    category: 'food',
    paidBy: 'user-1',
    date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    splitBetween: ['user-1', 'user-2', 'user-3', 'user-4']
  }
];

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      currentUser: mockCurrentUser,
      groups: mockGroups,
      activeGroupId: mockGroups[0].id,
      expenses: mockExpenses,
      
      setActiveGroup: (groupId) => 
        set(() => ({ activeGroupId: groupId })),
      
      addGroup: (group) => 
        set((state) => ({ 
          groups: [
            ...state.groups, 
            { 
              ...group, 
              id: `group-${nanoid(6)}`, 
              createdAt: new Date().toISOString() 
            }
          ] 
        })),
      
      updateGroup: (groupId, updates) => 
        set((state) => ({ 
          groups: state.groups.map(group => 
            group.id === groupId ? { ...group, ...updates } : group
          ) 
        })),
      
      deleteGroup: (groupId) => 
        set((state) => ({
          groups: state.groups.filter(group => group.id !== groupId),
          expenses: state.expenses.filter(expense => expense.groupId !== groupId),
          activeGroupId: state.activeGroupId === groupId 
            ? (state.groups.find(g => g.id !== groupId)?.id || null) 
            : state.activeGroupId
        })),
      
      addExpense: (expense) => 
        set((state) => ({ 
          expenses: [
            ...state.expenses, 
            { ...expense, id: `expense-${nanoid(6)}` }
          ] 
        })),
      
      updateExpense: (expenseId, updates) => 
        set((state) => ({ 
          expenses: state.expenses.map(expense => 
            expense.id === expenseId ? { ...expense, ...updates } : expense
          ) 
        })),
      
      deleteExpense: (expenseId) => 
        set((state) => ({ 
          expenses: state.expenses.filter(expense => expense.id !== expenseId) 
        })),
    }),
    {
      name: 'expense-store',
    }
  )
);