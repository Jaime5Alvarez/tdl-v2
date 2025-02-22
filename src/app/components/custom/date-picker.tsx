"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, addDays, subDays } from "date-fns"

import { cn } from "src/lib/utils"
import { Button } from "src/components/ui/button"
import { Calendar } from "src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "src/components/ui/popover"

export default function DatePicker({
    date,
    setDate
}: {
    date: Date,
    setDate: React.Dispatch<React.SetStateAction<Date>>
}) {
    const [open, setOpen] = React.useState(false)

    const handlePreviousDay = () => {
        setDate((prev: Date) => subDays(prev, 1))
    }

    const handleNextDay = () => {
        setDate((prev: Date) => addDays(prev, 1))
    }

    return (
        <div className="flex items-center justify-center p-4 gap-1">
            <Button variant="ghost" size="icon" className="text-white" onClick={handlePreviousDay}>
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[280px] justify-center text-center font-normal",
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

            <Button variant="ghost" size="icon" className="text-white" onClick={handleNextDay}>
                <ChevronRight className="h-6 w-6" />
            </Button>
        </div>
    )
}

