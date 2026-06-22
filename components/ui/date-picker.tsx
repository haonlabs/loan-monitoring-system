"use client";

import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarDays, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function fromIso(value?: string) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  return year && month && day ? new Date(year, month - 1, day) : undefined;
}

function toIso(value?: Date) {
  if (!value) return "";
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

type DatePickerProps = {
  name: string;
  id?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function DatePicker({ name, id: inputId, defaultValue, placeholder = "Pilih tanggal", required, disabled, className }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(() => fromIso(defaultValue));
  const [open, setOpen] = React.useState(false);

  return <div className={cn("space-y-2", className)}>
    <input type="hidden" name={name} id={inputId} value={toIso(date)} required={required} />
    <div className="flex gap-2"><Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" disabled={disabled} className={cn("h-11 flex-1 justify-start px-3.5 text-left font-normal", !date && "text-muted-foreground")}>
          <CalendarDays className="h-4 w-4 text-primary" />
          <span className="flex-1">{date ? format(date, "d MMMM yyyy", { locale: id }) : placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={value => { setDate(value); if (value) setOpen(false); }}
          defaultMonth={date}
          locale={id}
          captionLayout="dropdown"
          navLayout="after"
          startMonth={new Date(1970, 0)}
          endMonth={new Date(new Date().getFullYear() + 30, 11)}
          autoFocus
        />
        <div className="mt-2 flex items-center justify-between border-t pt-3">
          {!required ? <Button type="button" variant="ghost" size="sm" onClick={() => { setDate(undefined); setOpen(false); }}>Hapus</Button> : <span />}
          <Button type="button" variant="secondary" size="sm" onClick={() => { setDate(new Date()); setOpen(false); }}>Hari ini</Button>
        </div>
      </PopoverContent>
    </Popover>{date && !required && <Button type="button" variant="outline" size="icon" aria-label="Hapus tanggal" title="Hapus tanggal" onClick={() => setDate(undefined)}><X className="h-4 w-4" /></Button>}</div>
  </div>;
}
