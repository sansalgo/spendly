import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { isSameMonth } from "date-fns";
import type { Tag, Expense, TagFormValues } from "@/types";
import { currencies } from "@/constants";

interface ExpenseState {
  allExpenses: Expense[];
  currentMonthExpenses: Expense[];
  currentDate: Date;
  tags: Tag[];
  defaultCurrency: string;
  addExpense: (expense: Omit<Expense, "id" | "currency">) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, updatedExpense: Omit<Expense, "id">) => void;
  setCurrentDate: (date: Date) => void;
  addTag: (tag: TagFormValues) => Tag;
  updateTag: (tag: Tag) => void;
  deleteTag: (id: string) => void;
  setDefaultCurrency: (currency: string) => void;
}

export const useExpenseStore = create<ExpenseState>()(
  devtools(
    persist(
      (set, get) => ({
        allExpenses: [],
        currentMonthExpenses: [],
        currentDate: new Date(),
        tags: [],
        defaultCurrency: currencies[0],

        addExpense: (expense) => {
          const { defaultCurrency } = get();
          const newExpense: Expense = {
            ...expense,
            id: Date.now().toString(),
            date: expense.date,
            currency: defaultCurrency,
          };
          set((state) => {
            const updatedAllExpenses = [...state.allExpenses, newExpense];
            return {
              allExpenses: updatedAllExpenses,
              currentMonthExpenses: updatedAllExpenses.filter((exp) =>
                isSameMonth(new Date(exp.date), state.currentDate)
              ),
            };
          });
        },

        deleteExpense: (id) => {
          set((state) => {
            const updatedAllExpenses = state.allExpenses.filter(
              (expense) => expense.id !== id
            );
            return {
              allExpenses: updatedAllExpenses,
              currentMonthExpenses: updatedAllExpenses.filter((exp) =>
                isSameMonth(new Date(exp.date), state.currentDate)
              ),
            };
          });
        },

        updateExpense: (id, updatedExpense) => {
          set((state) => {
            const updatedAllExpenses = state.allExpenses.map((expense) =>
              expense.id === id ? { ...updatedExpense, id } : expense
            );
            return {
              allExpenses: updatedAllExpenses,
              currentMonthExpenses: updatedAllExpenses.filter((exp) =>
                isSameMonth(new Date(exp.date), state.currentDate)
              ),
            };
          });
        },

        setCurrentDate: (date) => {
          set((state) => ({
            currentDate: date,
            currentMonthExpenses: state.allExpenses.filter((exp) =>
              isSameMonth(new Date(exp.date), date)
            ),
          }));
        },

        addTag: (tag) => {
          const newTag: Tag = { ...tag, id: Date.now().toString() };
          set((state) => ({
            tags: [...state.tags, newTag],
          }));
          return newTag;
        },

        updateTag: (tag) => {
          set((state) => ({
            tags: state.tags.map((t) => (t.id === tag.id ? tag : t)),
          }));
        },

        deleteTag: (id) => {
          const { allExpenses } = get();
          // Check if tag is used in any expense
          const tagInUse = allExpenses.some((expense) => expense.tagId === id);

          if (tagInUse) {
            alert(
              "Cannot delete a tag that is used by expenses. Please reassign or delete those expenses first."
            );
            return;
          }

          set((state) => ({
            tags: state.tags.filter((tag) => tag.id !== id),
          }));
        },

        setDefaultCurrency: (currency) => {
          set({ defaultCurrency: currency });
        },
      }),
      {
        name: "expense-storage",
        // partialize: (state) => ({
        //   allExpenses: state.allExpenses,
        //   tags: state.tags,
        //   defaultCurrency: state.defaultCurrency,
        // }),
        // // Custom serialization to handle Date objects
        // serialize: (state) => JSON.stringify(state),
        // // Custom deserialization to convert date strings back to Date objects
        // deserialize: (str) => {
        //   const parsed = JSON.parse(str);
        //   if (parsed.state && parsed.state.allExpenses) {
        //     parsed.state.allExpenses = parsed.state.allExpenses.map(
        //       (expense: any) => ({
        //         ...expense,
        //         date: new Date(expense.date),
        //       })
        //     );
        //   }
        //   return parsed;
        // },
        // onRehydrateStorage: () => (state) => {
        //   const currentDate = state?.currentDate ?? new Date();
        //   const allExpenses = state?.allExpenses ?? [];

        //   useExpenseStore.setState({
        //     currentMonthExpenses: allExpenses.filter((exp) =>
        //       isSameMonth(new Date(exp.date), currentDate)
        //     ),
        //   });
        // },
      }
    )
  )
);
