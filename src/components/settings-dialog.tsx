"use client";

import { Check, Ellipsis, Plus, X } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Tag, type TagFormValues } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { colorNames, colors, currencies, currencySymbols } from "@/constants";
import { ColorPicker } from "./color-picker";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCurrency: string;
  onDefaultCurrencyChange: (currency: string) => void;
  tags: Tag[];
  onAddTag: (tag: TagFormValues) => void;
  onEditTag: (tag: Tag) => void;
  onDeleteTag: (id: string) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  defaultCurrency,
  onDefaultCurrencyChange,
  tags,
  onAddTag,
  onEditTag,
  onDeleteTag,
}: SettingsModalProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(colorNames[0]);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editedTagName, setEditedTagName] = useState("");
  const [editedTagColor, setEditedTagColor] = useState("");

  const handleStartEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setEditedTagName(tag.name);
    setEditedTagColor(tag.color);
  };

  const handleEditTag = () => {
    if (editingTag && editedTagName.trim()) {
      onEditTag({
        ...editingTag,
        name: editedTagName,
        color: editedTagColor,
      });
      setEditingTag(null);
    }
  };

  const handleAddTag = () => {
    if (newTagName) {
      onAddTag({
        name: newTagName,
        color: newTagColor,
      });
      setNewTagName("");
      setNewTagColor(colorNames[0]);
      setIsAddingTag(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAddingTag(false);
    setNewTagName("");
    setNewTagColor(colorNames[0]);
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your expense tracker preferences
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="defaultCurrency">Default Currency</Label>
            <Select
              value={defaultCurrency}
              onValueChange={onDefaultCurrencyChange}
            >
              <SelectTrigger id="defaultCurrency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    <div className="flex items-center">
                      <span className="mr-2">{currencySymbols[currency]}</span>
                      <span>{currency}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              This currency will be used for all new expenses
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Manage Tags</Label>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setIsAddingTag(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Tag
              </Button>
            </div>
            <ScrollArea className="h-[200px] border rounded-md p-2">
              <div className="divide-y">
                {isAddingTag ? (
                  <div className="flex items-center justify-between p-2 ">
                    <div className="flex-1 flex items-center gap-2">
                      <ColorPicker
                        value={newTagColor}
                        onChange={setNewTagColor}
                      />
                      <Input
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className="flex-1"
                        placeholder="Tag name"
                      />
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleAddTag}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCancelAdd}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
                {tags.map((tag) => (
                  <>
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-2"
                    >
                      {editingTag && editingTag.id === tag.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <ColorPicker
                            value={editedTagColor}
                            onChange={setEditedTagColor}
                          />
                          <Input
                            value={editedTagName}
                            onChange={(e) => setEditedTagName(e.target.value)}
                            className="flex-1"
                            placeholder="Tag name"
                          />
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleEditTag}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded-full mr-2 inset-ring-1"
                              style={
                                {
                                  "--tw-inset-ring-color": colors[tag.color].V1,
                                  backgroundColor: colors[tag.color].V0,
                                } as React.CSSProperties
                              }
                            />
                            <span>{tag.name}</span>
                          </div>
                          <div className="flex gap-1">
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
                                <DropdownMenuItem
                                  onClick={() => handleStartEditTag(tag)}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onDeleteTag(tag.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ))}
              </div>
            </ScrollArea>
            <p className="text-xs text-muted-foreground mt-1">
              Categories in use cannot be deleted until all associated expenses
              are reassigned or deleted
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
