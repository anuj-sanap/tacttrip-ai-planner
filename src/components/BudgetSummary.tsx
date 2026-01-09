import { Plane, Building, Utensils, TrendingUp, TrendingDown, PiggyBank, CheckCircle2, AlertCircle } from 'lucide-react';
import { BudgetBreakdown } from '@/types/travel';
import { Progress } from '@/components/ui/progress';

interface BudgetSummaryProps {
  budget: BudgetBreakdown;
  totalBudget: number;
}

const BudgetSummary = ({ budget, totalBudget }: BudgetSummaryProps) => {
  const items = [
    { label: 'Transport', value: budget.transport, icon: Plane, color: 'text-blue-500' },
    { label: 'Accommodation', value: budget.hotel, icon: Building, color: 'text-purple-500' },
    { label: 'Daily Expenses', value: budget.dailyExpense * budget.totalDays, icon: Utensils, color: 'text-orange-500' },
  ];

  return (
    <div className="p-6 rounded-xl bg-card border border-border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <PiggyBank className="w-5 h-5 text-primary" />
          Budget Analysis
        </h3>
        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
          budget.isWithinBudget 
            ? 'bg-success/10 text-success' 
            : 'bg-destructive/10 text-destructive'
        }`}>
          {budget.isWithinBudget ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Within Budget
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              Over Budget
            </>
          )}
        </span>
      </div>

      {/* Expense Breakdown */}
      <div className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon;
          const percentage = (item.value / totalBudget) * 100;
          return (
            <div key={item.label} className="flex items-center gap-4">
              <div className={`p-2 rounded-lg bg-secondary ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">₹{item.value.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary/60 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Trip Duration</span>
          <span className="font-medium text-foreground">{budget.totalDays} day{budget.totalDays > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Daily Expense Estimate</span>
          <span className="font-medium text-foreground">₹{budget.dailyExpense.toLocaleString()}/day</span>
        </div>
        <div className="flex items-center justify-between text-lg">
          <span className="font-semibold text-foreground">Total Estimated</span>
          <span className="font-bold text-foreground">₹{budget.totalEstimated.toLocaleString()}</span>
        </div>
      </div>

      {/* Remaining Budget */}
      <div className={`mt-4 p-4 rounded-lg ${
        budget.isWithinBudget ? 'bg-success/10' : 'bg-destructive/10'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`flex items-center gap-2 font-medium ${
            budget.isWithinBudget ? 'text-success' : 'text-destructive'
          }`}>
            {budget.isWithinBudget ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            {budget.isWithinBudget ? 'Remaining' : 'Over by'}
          </span>
          <span className={`text-xl font-bold ${
            budget.isWithinBudget ? 'text-success' : 'text-destructive'
          }`}>
            ₹{Math.abs(budget.remaining).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-muted-foreground">Budget Utilization</span>
          <span className="font-medium text-foreground">{budget.utilizationPercent.toFixed(0)}%</span>
        </div>
        <Progress 
          value={Math.min(budget.utilizationPercent, 100)} 
          className={`h-3 ${budget.isWithinBudget ? '' : '[&>div]:bg-destructive'}`}
        />
      </div>
    </div>
  );
};

export default BudgetSummary;
