"use client";

import { addMonths, isAfter, subMonths } from "date-fns";
import { Plus, Settings } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { ExpenseFormDialog } from "@/components/expense-form-dialog";
import { ExpenseList } from "@/components/expense-list";
import { ExpenseSummary } from "@/components/expense-summary";
import { MonthNavigation } from "@/components/month-navigation";

import { useExpenseStore } from "@/store/expense-store";
import type { Expense, ExpenseFormValues } from "@/types";
import { groupExpensesByDate, groupExpensesByTag } from "@/utils/expense-utils";
import { SettingsDialog } from "./components/settings-dialog";
import { currencies } from "./constants";

export default function App() {
  // UI state
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [groupBy, setGroupBy] = useState<"date" | "tag">("date");

  // Global state from Zustand
  const {
    currentDate,
    setCurrentDate,
    currentMonthExpenses: expenses,
    tags,
    defaultCurrency,
    addExpense,
    updateExpense,
    deleteExpense,
    addTag,
    updateTag,
    deleteTag,
    setDefaultCurrency,
  } = useExpenseStore();

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    if (!isAfter(nextMonth, new Date())) {
      setCurrentDate(nextMonth);
    }
  };

  const handleCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const handleAddOrUpdateExpense = (values: ExpenseFormValues) => {
    if (isEditMode && editingExpense) {
      updateExpense(editingExpense.id, values);
      setIsEditMode(false);
      setEditingExpense(null);
    } else {
      addExpense(values);
    }
    setIsAddExpenseOpen(false);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditMode(true);
    setIsAddExpenseOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete);
      setExpenseToDelete(null);
    }
  };

  const groupedExpenses =
    groupBy === "date"
      ? groupExpensesByDate(expenses)
      : groupExpensesByTag(expenses, tags);

  return (
    <div className="min-h-svh  bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full shadow-none border gap-0">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <MonthNavigation
                currentDate={currentDate}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
                onCurrentMonth={handleCurrentMonth}
              />
              <div className="gap-2 flex items-center">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setIsEditMode(false);
                    setEditingExpense(null);
                    setIsAddExpenseOpen(true);
                  }}
                  title="Add Expense"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  title="Settings"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-0">
            <ExpenseSummary
              expenses={expenses}
              defaultCurrency={defaultCurrency}
              tags={tags}
              currency={currencies[0]}
            />

            {expenses.length > 0 && (
              <>
                <Tabs
                  value={groupBy}
                  className="w-full mb-4"
                  onValueChange={(value) => setGroupBy(value as "date" | "tag")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="date">By Date</TabsTrigger>
                    <TabsTrigger value="tag">By Tag</TabsTrigger>
                  </TabsList>
                </Tabs>

                <ExpenseList
                  groupedExpenses={groupedExpenses}
                  defaultCurrency={defaultCurrency}
                  tags={tags}
                  groupBy={groupBy}
                  onEdit={handleEditExpense}
                  onDelete={(id) => setExpenseToDelete(id)}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <ExpenseFormDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onSubmit={handleAddOrUpdateExpense}
        defaultCurrency={defaultCurrency}
        tags={tags}
        onAddTag={addTag}
        initialValues={editingExpense || undefined}
        isEditMode={isEditMode}
      />

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        defaultCurrency={defaultCurrency}
        onDefaultCurrencyChange={setDefaultCurrency}
        tags={tags}
        onAddTag={addTag}
        onEditTag={updateTag}
        onDeleteTag={deleteTag}
      />

      <DeleteConfirmationDialog
        open={!!expenseToDelete}
        onOpenChange={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
