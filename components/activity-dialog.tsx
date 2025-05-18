"use client"

import { useState } from "react"
import { nanoid } from "nanoid"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmojiPicker } from "@/components/emoji-picker"
import type { Activity, ActivityCategory } from "@/lib/types"

interface ActivityDialogProps {
    open: boolean
    onClose: () => void
    onSave: (activity: Activity) => void
    activity?: Activity | null
}

export function ActivityDialog({ open, onClose, onSave, activity }: ActivityDialogProps) {
    const [formData, setFormData] = useState<Partial<Activity>>(
        activity || {
            emoji: "🎯",
            title: "",
            time: "",
            location: "",
            category: undefined,
            notes: "",
        }
    )
    const [timeError, setTimeError] = useState<string>("");

    const validateTime = (timeStr: string): boolean => {
        if (!timeStr) return true; // Empty time is valid

        const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*(AM|PM)\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*(AM|PM)$/i;
        if (!timePattern.test(timeStr)) {
            setTimeError("Please use format: HH:MM AM/PM - HH:MM AM/PM");
            return false;
        }

        const [startTime, endTime] = timeStr.split("-").map(t => t.trim());
        const start = new Date(`1970/01/01 ${startTime}`);
        const end = new Date(`1970/01/01 ${endTime}`);

        if (end <= start) {
            setTimeError("End time must be after start time");
            return false;
        }

        setTimeError("");
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title) {
            return;
        }

        if (formData.time && !validateTime(formData.time)) {
            return;
        }

        onSave({
            id: activity?.id || nanoid(),
            title: formData.title!,
            emoji: formData.emoji || "🎯",
            time: formData.time,
            location: formData.location,
            category: formData.category as ActivityCategory,
            notes: formData.notes,
        })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{activity ? "Edit" : "Add"} Activity</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="emoji">Emoji</Label>
                        <EmojiPicker
                            value={formData.emoji || ''}
                            onChange={(value) => setFormData({ ...formData, emoji: value })}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                            id="time"
                            value={formData.time || ""}
                            onChange={(e) => {
                                setFormData({ ...formData, time: e.target.value });
                                if (timeError) validateTime(e.target.value);
                            }}
                            placeholder="10:00 AM - 12:00 PM"
                        />
                        {timeError && (
                            <p className="text-sm text-destructive">{timeError}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={formData.location || ""}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Beach Resort"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value as ActivityCategory })}
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
                            value={formData.notes || ""}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Add any additional notes here..."
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}