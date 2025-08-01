import React from 'react';
import { useExpenseStore } from '../store/expense-store';
import { GROUP_COLORS, GROUP_ICONS } from '../types';
import { getGroupColorClass } from '../utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Home, 
  Users, 
  Briefcase, 
  Coffee, 
  Heart, 
  Plane, 
  Car, 
  ShoppingBag, 
  Utensils 
} from 'lucide-react';

interface AddGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the form validation schema
const formSchema = z.object({
  name: z.string().min(1, "Group name is required").max(50, "Group name is too long"),
  description: z.string().max(200, "Description is too long"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function AddGroupDialog({ isOpen, onClose }: AddGroupDialogProps) {
  const { currentUser, addGroup } = useExpenseStore();
  
  // Icon mapping
  const iconComponents = {
    'home': <Home className="h-5 w-5" />,
    'users': <Users className="h-5 w-5" />,
    'briefcase': <Briefcase className="h-5 w-5" />,
    'coffee': <Coffee className="h-5 w-5" />,
    'heart': <Heart className="h-5 w-5" />,
    'plane': <Plane className="h-5 w-5" />,
    'car': <Car className="h-5 w-5" />,
    'shopping-bag': <ShoppingBag className="h-5 w-5" />,
    'utensils': <Utensils className="h-5 w-5" />,
  };
  
  // Set up form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      color: GROUP_COLORS[0], // Default to first color
      icon: GROUP_ICONS[0], // Default to first icon
    },
  });
  
  // Handle form submission
  const onSubmit = (data: FormValues) => {
    addGroup({
      name: data.name,
      description: data.description,
      color: data.color,
      icon: data.icon,
      leaderId: currentUser.id, // Current user becomes the group leader
      members: [currentUser], // Add current user as the only member initially
    });
    
    onClose();
    form.reset();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg modal-animate-in overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Group</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Family, Friends, Trip to Paris..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What is this group for?"
                      {...field}
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Color</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {GROUP_COLORS.map((color) => {
                      const colorClasses = getGroupColorClass(color);
                      const isSelected = field.value === color;
                      
                      return (
                        <button
                          key={color}
                          type="button"
                          className={`h-8 w-8 rounded-full transition-all ${colorClasses.bg || ''} ${
                            isSelected ? 'ring-2 ring-offset-2 ring-primary' : ''
                          }`}
                          onClick={() => form.setValue('color', color)}
                        />
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Icon</FormLabel>
                  <div className="flex flex-wrap gap-3 mt-1.5">
                    {GROUP_ICONS.map((icon) => {
                      const isSelected = field.value === icon;
                      const colorClass = getGroupColorClass(form.watch('color'));
                      
                      return (
                        <button
                          key={icon}
                          type="button"
                          className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                            isSelected 
                              ? `${colorClass.bg || ''} text-white` 
                              : 'bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                          onClick={() => form.setValue('icon', icon)}
                        >
                          {iconComponents[icon as keyof typeof iconComponents]}
                        </button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">Create Group</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}