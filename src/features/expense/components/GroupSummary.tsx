import React from 'react';
import { useExpenseStore } from '../store/expense-store';
import { formatCurrency, getGroupColorClass, calculateGroupTotal } from '../utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '../utils';
import { User } from '../types';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

export function GroupSummary() {
  const { groups, activeGroupId, expenses } = useExpenseStore();
  
  const activeGroup = groups.find(group => group.id === activeGroupId);
  if (!activeGroup) return null;
  
  const groupColor = getGroupColorClass(activeGroup.color);
  const totalAmount = calculateGroupTotal(expenses, activeGroupId);
  const leaderMember = activeGroup.members.find(member => member.id === activeGroup.leaderId);
  
  return (
    <div className="p-4 animate-fade-in">
      <Card className="bg-card p-4 shadow-sm">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{activeGroup.name}</h2>
            <span className={`text-xs px-2 py-1 rounded-full ${groupColor.bg || ''} text-white`}>
              {activeGroup.members.length} members
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{activeGroup.description}</p>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${groupColor.bg || ''}`}>
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total expenses</p>
            <p className="text-xl font-semibold">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <p className="text-sm font-medium">Group Leader</p>
          </div>
          <div className="flex items-center">
            {leaderMember && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={leaderMember.avatar} />
                <AvatarFallback>{getInitials(leaderMember.name)}</AvatarFallback>
              </Avatar>
            )}
            <span className="font-medium text-sm">{leaderMember?.name || 'Unknown'}</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-2">
            <p className="text-sm font-medium">Members</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeGroup.members.map(member => (
              <MemberChip key={member.id} member={member} isLeader={member.id === activeGroup.leaderId} />
            ))}
          </div>
        </div>
      </Card>
      
      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard 
          title="Highest Expense" 
          value={formatCurrency(85.50)} 
          description="Dinner last week"
          icon={<ArrowUpRight className="h-4 w-4 text-destructive" />}
          trend="up"
        />
        <StatCard 
          title="Average/Person" 
          value={formatCurrency(totalAmount / activeGroup.members.length)} 
          description="This month"
          icon={<ArrowDownRight className="h-4 w-4 text-green-500" />}
          trend="down"
        />
      </div>
    </div>
  );
}

interface MemberChipProps {
  member: User;
  isLeader: boolean;
}

function MemberChip({ member, isLeader }: MemberChipProps) {
  return (
    <div className={`flex items-center px-2 py-1 rounded-full bg-accent text-sm animate-scale`}>
      <Avatar className="h-5 w-5 mr-1">
        <AvatarImage src={member.avatar} />
        <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
      </Avatar>
      <span>{member.name.split(' ')[0]}</span>
      {isLeader && (
        <span className="ml-1 text-xs bg-primary text-primary-foreground px-1 rounded">
          Leader
        </span>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card className="p-3 animate-fade-in">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className={`p-1 rounded-full ${trend === 'up' ? 'bg-red-100' : 'bg-green-100'}`}>
          {icon}
        </div>
      </div>
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Card>
  );
}