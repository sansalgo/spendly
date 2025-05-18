import { colorNames, colors } from "@/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({
  value = colorNames[0],
  onChange,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="flex items-center justify-center rounded-md shadow-none border border-input bg-background inset-ring-1"
          style={
            {
              "--tw-inset-ring-color": colors[value].V1,
              backgroundColor: colors[value].V0,
            } as React.CSSProperties
          }
        >
          <span className="w-4 h-4"></span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="grid grid-cols-5 gap-1">
          {colorNames.map((color) => (
            <button
              key={colors[color].V0}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md inset-ring-1 hover:inset-ring-2 ring-offset-0",
                value === color && `inset-ring-2`
              )}
              style={
                {
                  "--tw-inset-ring-color":
                    value === color ? colors[color].V2 : colors[color].V1,
                  backgroundColor: colors[color].V0,
                } as React.CSSProperties
              }
              onClick={() => onChange(color)}
            ></button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
