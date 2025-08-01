import React from 'react';
import { useExpenseStore } from '../store/expense-store';
import { EXPENSE_CATEGORIES } from '../types';
import { formatCurrency } from '../utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '../utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface AddExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  paidBy: z.string().min(1, "Payer is required"),
  date: z.string().min(1, "Date is required"),
  splitBetween: z.array(z.string()).min(1, "Select at least one member"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddExpenseDialog({ isOpen, onClose }: AddExpenseDialogProps) {
  const { groups, activeGroupId, currentUser, addExpense } = useExpenseStore();
  
  const activeGroup = groups.find(group => group.id === activeGroupId);
  
  // Set up form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      amount: '',
      category: 'food',
      paidBy: currentUser.id,
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
      splitBetween: activeGroup?.members.map(m => m.id) || [],
      notes: '',
    },
  });
  
  // Handle form submission
  const onSubmit = (data: FormValues) => {
    addExpense({
      groupId: activeGroupId || '',
      title: data.title,
      amount: parseFloat(data.amount),
      category: data.category,
      paidBy: data.paidBy,
      date: new Date(data.date).toISOString(),
      splitBetween: data.splitBetween,
      notes: data.notes,
    });
    
    onClose();
    form.reset();
  };
  
  // Early return if no active group
  if (!activeGroup) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg modal-animate-in overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Expense</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="What was this expense for?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input 
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00" 
                          className="pl-8"
                          {...field}
                          onChange={(e) => {
                            // Format to 2 decimal places
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value)) {
                              e.target.value = value.toFixed(2);
                            }
                            field.onChange(e);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {EXPENSE_CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paidBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid by</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Who paid?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {activeGroup.members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                </Avatar>
                                <span>{member.name}</span>
                                {member.id === currentUser.id && <span className="ml-1">(You)</span>}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any additional notes here"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="col-span-2">
                <Label>Split between</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeGroup.members.map((member) => {
                    // Check if member is selected
                    const isSelected = form.watch('splitBetween').includes(member.id);
                    
                    return (
                      <button
                        key={member.id}
                        type="button"
                        className={`flex items-center px-3 py-1.5 rounded-full text-sm transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                        onClick={() => {
                          const currentValues = form.watch('splitBetween');
                          const newValues = isSelected
                            ? currentValues.filter(id => id !== member.id)
                            : [...currentValues, member.id];
                          
                          form.setValue('splitBetween', newValues);
                        }}
                      >
                        <Avatar className="h-5 w-5 mr-1.5">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                        {member.id === currentUser.id && <span className="ml-1">(You)</span>}
                      </button>
                    );
                  })}
                </div>
                {form.formState.errors.splitBetween && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.splitBetween.message}
                  </p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">Add Expense</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}