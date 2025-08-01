import React from 'react';
import { useExpenseStore } from '../store/expense-store';
import { Group } from '../types';
import { getGroupColorClass } from '../utils';
import { 
  Home, 
  Users, 
  Briefcase, 
  Coffee, 
  Heart, 
  Plane, 
  Car, 
  ShoppingBag, 
  Utensils,
  MoreHorizontal
} from 'lucide-react';

interface GroupSelectorProps {
  className?: string;
}

export function GroupSelector({ className }: GroupSelectorProps) {
  const { groups, activeGroupId, setActiveGroup } = useExpenseStore();
  
  // Map group icon names to Lucide React components
  const iconMap: Record<string, React.ReactNode> = {
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
  
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="font-semibold mb-3 text-lg">Your Groups</h2>
      <div className="space-y-3 animate-slide-up" style={{ "--animate-duration": "0.4s" } as React.CSSProperties}>
        {groups.map((group, index) => (
          <GroupCard 
            key={group.id} 
            group={group} 
            isActive={group.id === activeGroupId}
            onClick={() => setActiveGroup(group.id)}
            icon={iconMap[group.icon] || <MoreHorizontal className="h-5 w-5" />}
            animationDelay={(index + 1) * 0.1}
          />
        ))}
      </div>
    </div>
  );
}

interface GroupCardProps {
  group: Group;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  animationDelay: number;
}

function GroupCard({ group, isActive, onClick, icon, animationDelay }: GroupCardProps) {
  const colorClasses = getGroupColorClass(group.color);
  
  return (
    <div 
      className={`group-card flex items-center p-3 rounded-lg cursor-pointer animate-fade-in transition-all duration-300 ${
        isActive 
          ? `${colorClasses.bg || ''} text-white shadow-lg` 
          : `bg-card hover:bg-accent`
      }`}
      onClick={onClick}
      style={{ animationDelay: `${animationDelay}s` } as React.CSSProperties}
    >
      <div className={`mr-3 p-2 rounded-full ${isActive ? 'bg-white bg-opacity-20' : (colorClasses.bg || '')}`}>
        {React.cloneElement(icon as React.ReactElement, { 
          className: `h-5 w-5 ${isActive ? 'text-white' : 'text-white'}` 
        })}
      </div>
      <div>
        <h3 className="font-medium">{group.name}</h3>
        <p className={`text-sm ${isActive ? 'text-white text-opacity-80' : 'text-muted-foreground'}`}>
          {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
        </p>
      </div>
    </div>
  );
}