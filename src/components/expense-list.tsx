"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { colorNames, colors, currencySymbols } from "@/constants";
import {
  type Expense,
  type ExpenseGroupByDate,
  type ExpenseGroupByTag,
  type Tag,
} from "@/types";
import { format } from "date-fns";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import type React from "react";

interface ExpenseListProps {
  groupedExpenses: (ExpenseGroupByDate | ExpenseGroupByTag)[];
  defaultCurrency: string;
  tags: Tag[];
  groupBy: "date" | "tag";
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseList({
  groupedExpenses,
  defaultCurrency,
  tags,
  groupBy,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  if (groupedExpenses.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
        <p className="text-muted-foreground">No expenses for this period</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedExpenses.map((group) => (
        <div key={group.key} className="border rounded-lg overflow-hidden ">
          <div className="p-3 bg-muted flex justify-between items-center">
            <div className="flex items-center">
              {groupBy === "tag" && (
                <div
                  className="w-3 h-3 rounded-full mr-2 inset-ring-1"
                  style={
                    {
                      "--tw-inset-ring-color":
                        colors[
                          (group as ExpenseGroupByTag).color ?? colorNames[0]
                        ].V1,
                      backgroundColor:
                        colors[
                          (group as ExpenseGroupByTag).color ?? colorNames[0]
                        ].V0,
                    } as React.CSSProperties
                  }
                />
              )}
              <span className="font-medium">{group.label}</span>
            </div>
            <span className="font-semibold text-primary">
              {currencySymbols[defaultCurrency]}
              {group.total.toFixed(2)}
            </span>
          </div>
          <Separator />
          <div className="divide-y">
            {group.expenses.map((expense) => {
              const tag = tags.find((t) => t.id === expense.tagId);
              return (
                <div
                  key={expense.id}
                  className="p-3 flex justify-between items-center hover:bg-muted/10"
                >
                  <div>
                    <div className="font-medium">{expense.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                      {groupBy === "tag" ? (
                        format(new Date(expense.date), "MMM d")
                      ) : (
                        <Badge
                          variant="outline"
                          className="font-normal text-xs py-0 h-5 "
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mr-1 inset-ring-1"
                            style={
                              {
                                "--tw-inset-ring-color":
                                  colors[tag?.color ?? colorNames[0]].V1,
                                backgroundColor:
                                  colors[tag?.color ?? colorNames[0]].V0,
                              } as React.CSSProperties
                            }
                          />
                          {tag?.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="font-medium">
                      {currencySymbols[defaultCurrency]}
                      {expense.amount.toFixed(2)}
                    </div>
                    <div className="flex">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant="ghost"
                            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                          >
                            <Ellipsis className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => onEdit(expense)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(expense.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
