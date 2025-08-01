import React from 'react';
import { useExpenseStore } from '../store/expense-store';
import { Expense } from '../types';
import { 
  formatCurrency, 
  formatDate, 
  getInitials,
  getCategoryColorClass,
  calculateUserBalance
} from '../utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Trash2,
  Edit,
  Calendar,
  Users,
  Receipt
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ExpenseDetailDialogProps {
  expense: Expense | null;
  onClose: () => void;
  onEdit: () => void;
}

export function ExpenseDetailDialog({ expense, onClose, onEdit }: ExpenseDetailDialogProps) {
  const { groups, expenses, currentUser, deleteExpense } = useExpenseStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  
  if (!expense) return null;
  
  // Find the group this expense belongs to
  const group = groups.find(g => g.id === expense.groupId);
  if (!group) return null;
  
  // Get members map for lookup
  const membersMap = Object.fromEntries(
    group.members.map(member => [member.id, member])
  );
  
  // Find who paid this expense
  const paidByUser = membersMap[expense.paidBy];
  
  // Get expense category details
  const categoryClass = getCategoryColorClass(expense.category);
  
  // Category icon mapping
  const categoryIconMap: Record<string, React.ReactNode> = {
    'food': <Utensils className="h-5 w-5" />,
    'transport': <Car className="h-5 w-5" />,
    'entertainment': <Film className="h-5 w-5" />,
    'shopping': <ShoppingBag className="h-5 w-5" />,
    'utilities': <Zap className="h-5 w-5" />,
    'rent': <Home className="h-5 w-5" />,
    'travel': <Map className="h-5 w-5" />,
    'medical': <Activity className="h-5 w-5" />,
    'other': <MoreHorizontal className="h-5 w-5" />,
  };
  
  // Calculate the split amount
  const splitAmount = expense.amount / expense.splitBetween.length;
  
  // Handle delete expense
  const handleDelete = () => {
    deleteExpense(expense.id);
    onClose();
  };
  
  const isUserPayer = expense.paidBy === currentUser.id;
  
  return (
    <>
      <Dialog open={Boolean(expense)} onOpenChange={onClose}>
        <DialogContent className="max-w-lg modal-animate-in overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl">Expense Details</DialogTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={onEdit}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-2">
            {/* Header with expense title and amount */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">{expense.title}</h2>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className={`w-2 h-2 rounded-full ${categoryClass} mr-1.5`}></span>
                  <span className="capitalize">{expense.category}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatCurrency(expense.amount)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(splitAmount)} / person
                </p>
              </div>
            </div>
            
            {/* Details Section */}
            <div className="space-y-4">
              {/* Paid by */}
              <div className="flex items-center p-3 bg-muted rounded-lg">
                <div className={`p-2 rounded-full ${categoryClass} mr-3`}>
                  {categoryIconMap[expense.category] || <MoreHorizontal className="h-5 w-5 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Paid by</p>
                  <div className="flex items-center">
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarImage src={paidByUser?.avatar} />
                      <AvatarFallback>{paidByUser ? getInitials(paidByUser.name) : '??'}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">
                      {isUserPayer ? 'You' : paidByUser?.name || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-medium">{formatCurrency(expense.amount)}</p>
                </div>
              </div>
              
              {/* Date */}
              <div className="flex items-center p-3 bg-muted rounded-lg">
                <div className="p-2 rounded-full bg-blue-500 mr-3">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(expense.date)}</p>
                </div>
              </div>
              
              {/* Split between */}
              <div>
                <div className="flex items-center mb-2">
                  <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  <p className="text-sm font-medium">Split between {expense.splitBetween.length} people</p>
                </div>
                
                <div className="grid gap-2">
                  {expense.splitBetween.map(userId => {
                    const user = membersMap[userId];
                    const isCurrentUser = userId === currentUser.id;
                    
                    return (
                      <div key={userId} className="flex items-center justify-between p-2 bg-accent rounded-md">
                        <div className="flex items-center">
                          <Avatar className="h-7 w-7 mr-2">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback>{user ? getInitials(user.name) : '??'}</AvatarFallback>
                          </Avatar>
                          <span>{isCurrentUser ? 'You' : user?.name || 'Unknown'}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{formatCurrency(splitAmount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Notes */}
              {expense.notes && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Notes</p>
                  <p className="text-sm">{expense.notes}</p>
                </div>
              )}
              
              {/* Receipt */}
              {expense.receipt && (
                <div className="p-3 bg-muted rounded-lg flex items-center">
                  <Receipt className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="flex-1 text-sm">Receipt</span>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="modal-animate-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}