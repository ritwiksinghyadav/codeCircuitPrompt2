"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const travelEmojis = [
  { value: "🏖️", label: "Beach", category: "Places" },
  { value: "🏞️", label: "National Park", category: "Places" },
  { value: "🏙️", label: "Cityscape", category: "Places" },
  { value: "🏰", label: "Castle", category: "Places" },
  { value: "🗿", label: "Monument", category: "Places" },
  { value: "🗼", label: "Tower", category: "Places" },
  { value: "🏯", label: "Japanese Castle", category: "Places" },
  { value: "🏟️", label: "Stadium", category: "Places" },
  { value: "⛩️", label: "Shrine", category: "Places" },
  { value: "🕌", label: "Mosque", category: "Places" },
  { value: "⛪", label: "Church", category: "Places" },
  { value: "🏛️", label: "Classical Building", category: "Places" },
  { value: "🏥", label: "Hospital", category: "Places" },
  { value: "🏨", label: "Hotel", category: "Places" },
  { value: "🏪", label: "Convenience Store", category: "Places" },
  { value: "🏫", label: "School", category: "Places" },

  { value: "✈️", label: "Airplane", category: "Transport" },
  { value: "🚗", label: "Car", category: "Transport" },
  { value: "🚕", label: "Taxi", category: "Transport" },
  { value: "🚌", label: "Bus", category: "Transport" },
  { value: "🚆", label: "Train", category: "Transport" },
  { value: "🚢", label: "Ship", category: "Transport" },
  { value: "🛳️", label: "Cruise Ship", category: "Transport" },
  { value: "🚁", label: "Helicopter", category: "Transport" },
  { value: "🛵", label: "Scooter", category: "Transport" },
  { value: "🚲", label: "Bicycle", category: "Transport" },

  { value: "🍽️", label: "Dining", category: "Food" },
  { value: "🍕", label: "Pizza", category: "Food" },
  { value: "🍔", label: "Burger", category: "Food" },
  { value: "🍣", label: "Sushi", category: "Food" },
  { value: "🍜", label: "Noodles", category: "Food" },
  { value: "🍦", label: "Ice Cream", category: "Food" },
  { value: "🍷", label: "Wine", category: "Food" },
  { value: "🍺", label: "Beer", category: "Food" },
  { value: "☕", label: "Coffee", category: "Food" },

  { value: "🏄‍♀️", label: "Surfing", category: "Activities" },
  { value: "🏊‍♀️", label: "Swimming", category: "Activities" },
  { value: "🧗‍♀️", label: "Climbing", category: "Activities" },
  { value: "🚶‍♀️", label: "Walking", category: "Activities" },
  { value: "🧘‍♀️", label: "Yoga", category: "Activities" },
  { value: "🛍️", label: "Shopping", category: "Activities" },
  { value: "📸", label: "Photography", category: "Activities" },
  { value: "🎭", label: "Performing Arts", category: "Activities" },
  { value: "🎨", label: "Art", category: "Activities" },
  { value: "🎬", label: "Cinema", category: "Activities" },
  { value: "🎡", label: "Amusement Park", category: "Activities" },
  { value: "🎪", label: "Circus", category: "Activities" },
  { value: "🏛️", label: "Museum", category: "Activities" },

  { value: "⏰", label: "Alarm Clock", category: "Other" },
  { value: "🌦️", label: "Weather", category: "Other" },
  { value: "💰", label: "Money", category: "Other" },
  { value: "🎒", label: "Backpack", category: "Other" },
  { value: "🧳", label: "Luggage", category: "Other" },
  { value: "🗺️", label: "Map", category: "Other" },
  { value: "📱", label: "Phone", category: "Other" },
  { value: "💳", label: "Credit Card", category: "Other" },
  { value: "🔑", label: "Key", category: "Other" },
]

interface EmojiPickerProps {
  value: string
  onChange: (value: string) => void
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)

  const selectedEmoji = travelEmojis.find((emoji) => emoji.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{value}</span>
            <span className="text-sm text-muted-foreground">{selectedEmoji?.label || "Select emoji"}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search emoji..." />
          <CommandList>
            <CommandEmpty>No emoji found.</CommandEmpty>
            {["Places", "Transport", "Food", "Activities", "Other"].map((category) => (
              <CommandGroup key={category} heading={category}>
                {travelEmojis
                  .filter((emoji) => emoji.category === category)
                  .map((emoji) => (
                    <CommandItem
                      key={emoji.value}
                      value={emoji.value}
                      onSelect={() => {
                        onChange(emoji.value)
                        setOpen(false)
                      }}
                    >
                      <span className="mr-2 text-xl">{emoji.value}</span>
                      <span>{emoji.label}</span>
                      <Check className={cn("ml-auto h-4 w-4", value === emoji.value ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
