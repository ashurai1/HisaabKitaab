import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Format a date string as a readable date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
}

/**
 * Format a date as relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Get the initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Get a color class based on a category or group
 */
export function getCategoryColorClass(category: string): string {
  const colorMap: Record<string, string> = {
    food: 'bg-orange-500',
    transport: 'bg-blue-500',
    entertainment: 'bg-purple-500',
    shopping: 'bg-pink-500',
    utilities: 'bg-yellow-500',
    rent: 'bg-emerald-500',
    travel: 'bg-indigo-500',
    medical: 'bg-red-500',
    other: 'bg-gray-500',
  };

  return colorMap[category] || 'bg-gray-500';
}

/**
 * Get a color class based on a group color
 */
export function getGroupColorClass(color: string): { bg: string; text: string; border: string } {
  const colorMap: Record<string, { bg: string, text: string, border: string }> = {
    blue: { 
      bg: 'bg-blue-500', 
      text: 'text-blue-500',
      border: 'border-blue-500'
    },
    green: { 
      bg: 'bg-emerald-500', 
      text: 'text-emerald-500',
      border: 'border-emerald-500'
    },
    violet: { 
      bg: 'bg-violet-500', 
      text: 'text-violet-500',
      border: 'border-violet-500'
    },
    orange: { 
      bg: 'bg-orange-500', 
      text: 'text-orange-500',
      border: 'border-orange-500'
    },
    pink: { 
      bg: 'bg-pink-500', 
      text: 'text-pink-500',
      border: 'border-pink-500'
    },
    teal: { 
      bg: 'bg-teal-500', 
      text: 'text-teal-500',
      border: 'border-teal-500'
    },
    red: { 
      bg: 'bg-red-500', 
      text: 'text-red-500',
      border: 'border-red-500'
    },
    yellow: { 
      bg: 'bg-yellow-500', 
      text: 'text-yellow-500',
      border: 'border-yellow-500'
    },
    indigo: { 
      bg: 'bg-indigo-500', 
      text: 'text-indigo-500',
      border: 'border-indigo-500'
    },
  };

  return colorMap[color] || { 
    bg: 'bg-gray-500', 
    text: 'text-gray-500',
    border: 'border-gray-500'
  };
}

/**
 * Calculate the total expenses for a given group
 */
export function calculateGroupTotal(expenses: Array<{amount: number, groupId: string}>, groupId: string): number {
  return expenses
    .filter(expense => expense.groupId === groupId)
    .reduce((total, expense) => total + expense.amount, 0);
}

/**
 * Calculate what a user owes or is owed in a group
 */
export function calculateUserBalance(
  expenses: Array<{amount: number, paidBy: string, splitBetween: string[]}>, 
  userId: string
): number {
  let balance = 0;
  
  for (const expense of expenses) {
    const splitCount = expense.splitBetween.length;
    const splitAmount = expense.amount / splitCount;
    
    // If user paid for this expense, add what others owe them
    if (expense.paidBy === userId) {
      balance += expense.amount - splitAmount;
    } 
    // If user is part of the split, subtract what they owe
    else if (expense.splitBetween.includes(userId)) {
      balance -= splitAmount;
    }
  }
  
  return balance;
}