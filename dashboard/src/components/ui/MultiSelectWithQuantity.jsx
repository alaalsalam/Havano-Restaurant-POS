import * as React from "react";
import { Check, Plus, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "./input";

export function MultiSelectWithQuantity({
  options = [],
  selectedItems = {},
  onChange,
  placeholder = "Select items",
  searchPlaceholder = "Search...",
  disabled = false,
  className,
  dropdownWidth = "w-[var(--radix-popover-trigger-width)]",
}) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // =========================
  // FILTER OPTIONS
  // =========================
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    const term = searchTerm.toLowerCase();
    return options.filter((option) => {
      const label = option.label || option.name || "";
      return label.toLowerCase().includes(term);
    });
  }, [options, searchTerm]);

  // =========================
  // STATE MODIFIERS
  // =========================
  const toggleItem = (val) => {
    const newItems = { ...selectedItems };
    if (newItems[val]) {
      delete newItems[val];
    } else {
      newItems[val] = 1;
    }
    onChange(newItems);
  };

  const setQuantity = (val, qty) => {
    const newItems = { ...selectedItems };
    if (qty <= 0 || Number.isNaN(qty)) {
      delete newItems[val];
    } else {
      newItems[val] = qty;
    }
    onChange(newItems);
  };

  // =========================
  // KEYBOARD HANDLERS
  // =========================
  // const handleTriggerKeyDown = (e) => {
  //   if (disabled) return;
  //   if (e.key === "Enter" || e.key === " ") {
  //     e.preventDefault();
  //     setOpen(true);
  //   }
  // };

  const handleEscapeClose = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* =========================
          TRIGGER
      ========================== */}
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={open}
          // onKeyDown={handleTriggerKeyDown}
          className={cn(
            "flex flex-wrap gap-1 items-center border rounded p-2 cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            dropdownWidth,
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          {Object.keys(selectedItems).length === 0 && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}

          {Object.entries(selectedItems).map(([val, qty]) => {
            const option = options.find(
              (o) => o.value === val || o.name === val
            );
            const label = option?.label || option?.name || val;

            return (
              <span
                key={val}
                className="flex items-center bg-accent px-2 py-0.5 rounded text-sm text-accent-foreground gap-1"
              >
                {label} × {qty}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(val);
                  }}
                />
              </span>
            );
          })}
        </div>
      </PopoverTrigger>

      {/* =========================
          DROPDOWN
      ========================== */}
      <PopoverContent
        className={cn(`${dropdownWidth} p-0`)}
        align="start"
        onKeyDown={handleEscapeClose}
      >
        {/* SEARCH */}
        <div className="p-2">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>

        {/* OPTION LIST */}
        <div
          role="listbox"
          aria-multiselectable="true"
          className="max-h-[400px] overflow-y-auto p-1"
        >
          {filteredOptions.map((option) => {
            const val = option.value || option.name;
            const label = option.label || option.name;
            const selected = !!selectedItems[val];
            const qty = selectedItems[val] || 0;

            return (
              <div
                key={val}
                role="option"
                aria-selected={selected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleItem(val);
                  }
                }}
                onClick={() => toggleItem(val)}
                className={cn(
                  "flex items-center justify-between px-2 py-1.5 text-sm rounded cursor-pointer",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                  selected && "bg-accent text-accent-foreground"
                )}
              >
                {/* LABEL */}
                <span>{label}</span>

                {/* QUANTITY CONTROLS */}
                {selected && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuantity(val, qty - 1);
                      }}
                    >
                      <Minus size={12} />
                    </Button>

                    <Input
                      type="number"
                      value={qty}
                      min={1}
                      className="w-12 h-7 text-center p-0 focus:ring-2 focus:ring-primary"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setQuantity(val, parseInt(e.target.value))
                      }
                    />

                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuantity(val, qty + 1);
                      }}
                    >
                      <Plus size={12} />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}



