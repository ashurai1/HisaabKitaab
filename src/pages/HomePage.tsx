import React, { useState } from 'react';
import { Header } from '@/features/expense/components/Header';
import { GroupSelector } from '@/features/expense/components/GroupSelector';
import { ExpenseList } from '@/features/expense/components/ExpenseList';
import { GroupSummary } from '@/features/expense/components/GroupSummary';
import { AddExpenseDialog } from '@/features/expense/components/AddExpenseDialog';
import { AddGroupDialog } from '@/features/expense/components/AddGroupDialog';
import { ExpenseDetailDialog } from '@/features/expense/components/ExpenseDetailDialog';
import { Expense } from '@/features/expense/types';
import { useIsMobile } from '@/hooks/use-mobile';

function HomePage() {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const isMobile = useIsMobile();
  
  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense);
  };
  
  const handleCloseExpenseDetail = () => {
    setSelectedExpense(null);
    setIsEditMode(false);
  };
  
  const handleEditExpense = () => {
    // In a real app, this would open an edit form
    // For now, we're just showing a message that editing is not implemented
    setIsEditMode(true);
    setSelectedExpense(null);
    setIsAddExpenseOpen(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onAddExpenseClick={() => setIsAddExpenseOpen(true)} 
        onAddGroupClick={() => setIsAddGroupOpen(true)} 
      />
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left sidebar for group selection */}
        <aside className={`${isMobile ? 'border-b' : 'border-r'} border-border ${
          isMobile ? 'w-full' : 'w-64'
        } shrink-0`}>
          <GroupSelector className="sticky top-0" />
        </aside>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-3'} h-full`}>
            <div className={`${isMobile ? 'w-full' : 'col-span-2'} border-r border-border overflow-auto`}>
              <ExpenseList onExpenseClick={handleExpenseClick} />
            </div>
            <div className={`${isMobile ? 'w-full' : 'col-span-1'}`}>
              <GroupSummary />
            </div>
          </div>
        </main>
      </div>
      
      {/* Dialogs */}
      <AddExpenseDialog
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />
      
      <AddGroupDialog
        isOpen={isAddGroupOpen}
        onClose={() => setIsAddGroupOpen(false)}
      />
      
      {selectedExpense && (
        <ExpenseDetailDialog
          expense={selectedExpense}
          onClose={handleCloseExpenseDetail}
          onEdit={handleEditExpense}
        />
      )}
    </div>
  );
}

export default HomePage;