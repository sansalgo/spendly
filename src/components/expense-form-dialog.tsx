"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, TagIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  type Expense,
  ExpenseFormSchema,
  type ExpenseFormValues,
  type Tag,
  type TagFormValues,
} from "@/types";
import { ColorPicker } from "./color-picker";
import { colorNames, colors, currencies, currencySymbols } from "@/constants";

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCurrency: string;
  onSubmit: (values: ExpenseFormValues) => void;
  tags: Tag[];
  onAddTag: (tag: TagFormValues) => Tag;
  initialValues?: Expense;
  isEditMode?: boolean;
}

export function ExpenseFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultCurrency,
  tags,
  onAddTag,
  initialValues,
  isEditMode = false,
}: ExpenseFormDialogProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(colorNames[0]);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: initialValues || {
      name: "",
      amount: 0,
      currency: currencies[0],
      date: new Date(),
      tagId: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name ?? "",
        amount: initialValues.amount ?? 0,
        currency: initialValues.currency ?? currencies[0],
        date: initialValues.date ? new Date(initialValues.date) : new Date(),
        tagId: initialValues.tagId ?? "",
      });
    }
  }, [initialValues, form]);

  const handleAddTag = () => {
    if (newTagName) {
      const newTag = onAddTag({
        name: newTagName,
        color: newTagColor,
      });
      form.setValue("tagId", newTag.id);
      setNewTagName("");
      setNewTagColor(colorNames[0]);
      setIsAddingTag(false);
    }
  };

  const handleFormSubmit = (values: ExpenseFormValues) => {
    onSubmit(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details of your expense"
              : "Enter the details of your expense"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lunch, Taxi, etc." {...field} />
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
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {currencySymbols[defaultCurrency]}
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-7"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value) || 0)
                        }
                        value={field.value || ""}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <Label>Tag</Label>
              {isAddingTag ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tag name"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="flex-1"
                    />
                    <ColorPicker
                      value={newTagColor}
                      onChange={setNewTagColor}
                    />
                  </div>
                  <div className="flex justify-end">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setIsAddingTag(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="flex-1"
                        onClick={handleAddTag}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="tagId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select a tag" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tags.map((tag) => (
                              <SelectItem key={tag.id} value={tag.id}>
                                <div className="flex items-center">
                                  <div
                                    className="w-3 h-3 rounded-full mr-2 inset-ring-1"
                                    style={
                                      {
                                        "--tw-inset-ring-color":
                                          colors[tag.color].V1,
                                        backgroundColor: colors[tag.color].V0,
                                      } as React.CSSProperties
                                    }
                                  />
                                  {tag.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setIsAddingTag(true)}
                          title="Add new tag"
                        >
                          <TagIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? "Update Expense" : "Add Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
