"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Clock, MapPin, MoreVertical, Pencil, Trash2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Activity, ActivityCategory } from "@/lib/types"
import { EmojiPicker } from "@/components/emoji-picker"

interface ActivityCardProps {
  activity: Activity
  onEdit: (activity: Activity) => void
  onDelete: () => void
  isDragging: boolean
}

export function ActivityCard({ activity, onEdit, onDelete, isDragging }: ActivityCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedActivity, setEditedActivity] = useState<Activity>(activity)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: activity.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getCategoryColor = (category: ActivityCategory) => {
    switch (category) {
      case "food":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "adventure":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "chill":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "culture":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "transport":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const handleSave = () => {
    onEdit(editedActivity)
    setIsEditing(false)
  }

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "cursor-grab active:cursor-grabbing",
          isDragging && "opacity-50",
          activity.category && "border-l-4",
          activity.category === "food" && "border-l-orange-500",
          activity.category === "adventure" && "border-l-green-500",
          activity.category === "chill" && "border-l-blue-500",
          activity.category === "culture" && "border-l-purple-500",
          activity.category === "transport" && "border-l-gray-500",
        )}
      >
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-lg">{activity.emoji}</span>
                <h4 className="font-medium">{activity.title}</h4>
              </div>

              {activity.time && (
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{activity.time}</span>
                </div>
              )}

              {activity.location && (
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{activity.location}</span>
                </div>
              )}

              {activity.category && (
                <div className="flex items-center mt-2">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", getCategoryColor(activity.category))}>
                    {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                  </span>
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  {...attributes}
                  {...listeners}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedActivity.title}
                onChange={(e) => setEditedActivity({ ...editedActivity, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="emoji">Emoji</Label>
              <EmojiPicker
                value={editedActivity.emoji}
                onChange={(value) => setEditedActivity({ ...editedActivity, emoji: value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                value={editedActivity.time || ""}
                onChange={(e) => setEditedActivity({ ...editedActivity, time: e.target.value })}
                placeholder="10:00 AM - 12:00 PM"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editedActivity.location || ""}
                onChange={(e) => setEditedActivity({ ...editedActivity, location: e.target.value })}
                placeholder="Beach Resort"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={editedActivity.category || ""}
                onValueChange={(value) => setEditedActivity({ ...editedActivity, category: value as ActivityCategory })}
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
                value={editedActivity.notes || ""}
                onChange={(e) => setEditedActivity({ ...editedActivity, notes: e.target.value })}
                placeholder="Any additional details..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
