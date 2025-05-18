"use client"

import type React from "react"

import { useState } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Activity, ActivityCategory, Day } from "@/lib/types"
import { EmojiPicker } from "@/components/emoji-picker"

interface AddActivityDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (activity: Omit<Activity, "id">) => void
  days: Day[]
  selectedDayId: string | null
  onDayChange: (dayId: string) => void
}

export function AddActivityDialog({ open, onClose, onAdd, days, selectedDayId, onDayChange }: AddActivityDialogProps) {
  const [activity, setActivity] = useState<Omit<Activity, "id">>({
    title: "",
    emoji: "🏖️",
    time: "",
    location: "",
    category: undefined,
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(activity)
    setActivity({
      title: "",
      emoji: "🏖️",
      time: "",
      location: "",
      category: undefined,
      notes: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Activity</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="day">Day</Label>
            <Select value={selectedDayId || ""} onValueChange={onDayChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day.id} value={day.id}>
                    {day.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={activity.title}
              onChange={(e) => setActivity({ ...activity, title: e.target.value })}
              placeholder="Beach Day"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="emoji">Emoji</Label>
            <EmojiPicker value={activity.emoji} onChange={(value) => setActivity({ ...activity, emoji: value })} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              value={activity.time}
              onChange={(e) => setActivity({ ...activity, time: e.target.value })}
              placeholder="10:00 AM - 12:00 PM"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={activity.location}
              onChange={(e) => setActivity({ ...activity, location: e.target.value })}
              placeholder="Beach Resort"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={activity.category || ""}
              onValueChange={(value) => setActivity({ ...activity, category: value as ActivityCategory })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="chill">Chill</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={activity.notes || ""}
              onChange={(e) => setActivity({ ...activity, notes: e.target.value })}
              placeholder="Any additional details..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!activity.title || !selectedDayId}>
              Add Activity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
