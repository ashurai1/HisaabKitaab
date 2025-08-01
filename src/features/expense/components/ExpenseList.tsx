import React from 'react';
import { useExpenseStore } from '../store/expense-store';
import { Expense } from '../types';
import { 
  formatCurrency, 
  formatRelativeTime, 
  getInitials,
  getCategoryColorClass
} from '../utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Utensils, 
  Car, 
  Film, 
  ShoppingBag, 
  Zap, 
  Home, 
  Map, 
  Activity, 
  MoreHorizontal, 
  ChevronRight,
  Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ExpenseListProps {
  onExpenseClick: (expense: Expense) => void;
}

export function ExpenseList({ onExpenseClick }: ExpenseListProps) {
  const { expenses, activeGroupId, groups, currentUser } = useExpenseStore();
  
  // Get the active group
  const activeGroup = groups.find(group => group.id === activeGroupId);
  
  // Filter expenses for the active group
  const groupExpenses = expenses
    .filter(expense => expense.groupId === activeGroupId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get group members map for quick lookup
  const groupMembersMap = activeGroup 
    ? Object.fromEntries(activeGroup.members.map(member => [member.id, member]))
    : {};
    
  // Category icon mapping
  const categoryIconMap: Record<string, React.ReactNode> = {
    'food': <Utensils className="h-4 w-4" />,
    'transport': <Car className="h-4 w-4" />,
    'entertainment': <Film className="h-4 w-4" />,
    'shopping': <ShoppingBag className="h-4 w-4" />,
    'utilities': <Zap className="h-4 w-4" />,
    'rent': <Home className="h-4 w-4" />,
    'travel': <Map className="h-4 w-4" />,
    'medical': <Activity className="h-4 w-4" />,
    'other': <MoreHorizontal className="h-4 w-4" />,
  };
  
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-xl">
          {activeGroup?.name || 'All'} Expenses
        </h2>
      </div>
      
      {groupExpenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <div className="p-3 bg-muted rounded-full mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg mb-1">No expenses yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first expense to start tracking
          </p>
          <Button size="sm">Add an expense</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {groupExpenses.map((expense, index) => {
            const paidByUser = groupMembersMap[expense.paidBy];
            const categoryColor = getCategoryColorClass(expense.category);
            const isPaidByCurrentUser = expense.paidBy === currentUser.id;
            
            return (
              <Card 
                key={expense.id} 
                className="expense-card p-4 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
                onClick={() => onExpenseClick(expense)}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${categoryColor} mr-3`}>
                    {categoryIconMap[expense.category] || 
                      <MoreHorizontal className="h-4 w-4 text-white" />}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{expense.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      {isPaidByCurrentUser ? (
                        <span>You paid</span>
                      ) : (
                        <>
                          <span>Paid by </span>
                          <span className="font-medium ml-1">{paidByUser?.name || 'Unknown'}</span>
                        </>
                      )}
                      <span className="mx-1">•</span>
                      {formatRelativeTime(expense.date)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="font-semibold">{formatCurrency(expense.amount)}</span>
                    <div className="flex -space-x-2">
                      {expense.splitBetween.slice(0, 3).map((userId) => {
                        const user = groupMembersMap[userId];
                        return (
                          <Avatar key={userId} className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="text-xs">
                              {user ? getInitials(user.name) : '??'}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                      {expense.splitBetween.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                          +{expense.splitBetween.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground ml-2" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}