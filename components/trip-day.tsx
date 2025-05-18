"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ActivityCard } from "@/components/activity-card"
import type { Day, Activity } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TripDayProps {
  day: Day
  onAddActivity: () => void
  onEditActivity: (activity: Activity) => void
  onDeleteActivity: (activityId: string) => void
  activeId: string | null
  activities: Activity[]
}

export function TripDay({ day, onAddActivity, onEditActivity, onDeleteActivity, activeId, activities }: TripDayProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day.id}`,
  })

  const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })

  return (
    <Card
      ref={setNodeRef}
      className={cn("flex-shrink-0 w-72 h-fit transition-colors", isOver && "bg-muted border-primary border-2")}
      id={`day-${day.id}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{day.title}</h3>
          <Button variant="ghost" size="icon" onClick={onAddActivity}>
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only">Add activity</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
      </CardHeader>
      <CardContent>
        <SortableContext items={activities.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 min-h-[100px]">
            {activities.length === 0 ? (
              <div className="border border-dashed rounded-lg p-4 text-center text-muted-foreground text-sm">
                No activities yet
              </div>
            ) : (
              activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onEdit={onEditActivity}
                  onDelete={() => onDeleteActivity(activity.id)}
                  isDragging={activeId === activity.id}
                />
              ))
            )}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  )
}
