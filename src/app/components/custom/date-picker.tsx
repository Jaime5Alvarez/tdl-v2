"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function DatePicker({
    date,
    setDate
}: {
    date: Date,
    setDate: React.Dispatch<React.SetStateAction<Date>>
}) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex flex-col items-center p-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[280px] justify-center text-center font-normal hover:bg-primary hover:text-primary-foreground",
                            !date && "text-muted-foreground",
                        )}
                    >
                        {date ? format(date, "dd/MM/yyyy") : "16/02/2025"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                            if (!newDate) return
                            setDate(newDate)
                            setOpen(false)
                        }}
                        initialFocus
                        className="rounded-md border"
                        classNames={{
                            months: "space-y-4",
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center gap-1",
                            caption_label: "text-sm font-medium",
                            nav: "flex items-center gap-1",
                            nav_button: "h-7 w-7 bg-transparent p-0 hover:opacity-50",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-sm",
                            row: "flex w-full mt-2",
                            cell: "text-center text-sm relative p-0 hover:bg-primary hover:text-primary-foreground focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary",
                            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary hover:text-primary-foreground",
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                            day_today: "bg-accent text-accent-foreground",
                            day_outside: "text-muted-foreground opacity-50",
                            day_disabled: "text-muted-foreground opacity-50",
                            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                            day_hidden: "invisible",
                        }}
                        components={{
                            IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                            IconRight: () => <ChevronRight className="h-4 w-4" />,
                        }}
                        footer={
                            <div className="p-3 border-t">
                                <Button
                                    variant="outline"
                                    className="w-full justify-center hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => {
                                        setDate(new Date())
                                        setOpen(false)
                                    }}
                                >
                                    Today
                                </Button>
                            </div>
                        }
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

