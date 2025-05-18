"use client";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { addMonths, format, isAfter } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface MonthNavigationProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onCurrentMonth: () => void;
}

export function MonthNavigation({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onCurrentMonth,
}: MonthNavigationProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <CardTitle className="text-xl font-bold">
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" onClick={onPreviousMonth}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onCurrentMonth}>
              {format(currentDate, "MMM yyyy")}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onNextMonth}
              disabled={isAfter(addMonths(currentDate, 1), new Date())}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </div>
    </div>
  );
}
