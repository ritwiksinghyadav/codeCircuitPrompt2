"use client"

import { useState } from "react"
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { Plus, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { TripDay } from "@/components/trip-day"
import { TripSettingsDialog } from "@/components/trip-settings-dialog"
import { ActivityDialog } from "@/components/activity-dialog"
import { ActivityCard } from "@/components/activity-card"
import type { Trip, Day, Activity } from "@/lib/types"

export default function PlannerPage() {
  const [trip, setTrip] = useState<Trip>({
    id: "1",
    title: "Summer Vacation",
    destination: "Paris, France",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    theme: {
      mode: "light",
      color: "blue",
      vibe: "adventure",
    },
    days: generateInitialDays(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  })

  const [activeId, setActiveId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activityDialogOpen, setActivityDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Day | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  function addDay() {
    const lastDay = trip.days[trip.days.length - 1];
    const newDayDate = new Date(lastDay.date);
    newDayDate.setDate(newDayDate.getDate() + 1);

    const newDay: Day = {
      id: `day-${trip.days.length + 1}`,
      title: `Day ${trip.days.length + 1}`,
      date: newDayDate.toISOString(),
      activities: [],
    };

    setTrip(prev => ({
      ...prev,
      endDate: newDayDate.toISOString(),
      days: [...prev.days, newDay],
    }));
  }

  function deleteDay(dayId: string) {
    const dayIndex = trip.days.findIndex(d => d.id === dayId);
    if (dayIndex === -1) return;

    const updatedDays = trip.days.filter(d => d.id !== dayId).map((day, index) => ({
      ...day,
      id: `day-${index + 1}`,
      title: `Day ${index + 1}`,
    }));

    const newEndDate = dayIndex === trip.days.length - 1
      ? new Date(trip.days[trip.days.length - 2].date)
      : new Date(trip.endDate);

    setTrip(prev => ({
      ...prev,
      endDate: newEndDate.toISOString(),
      days: updatedDays,
    }));
  }
  function generateInitialDays(startDate: Date, endDate: Date): Day[] {
    const days: Day[] = [];
    const currentDate = new Date(startDate);
    let dayCount = 1;

    while (currentDate <= endDate) {
      days.push({
        id: `day-${dayCount}`,
        title: `Day ${dayCount}`,
        date: new Date(currentDate).toISOString(),
        activities: [],
      });
      currentDate.setDate(currentDate.getDate() + 1);
      dayCount++;
    }

    return days;
  }

  function hasTimeConflict(activities: Activity[], newActivity: Activity): boolean {
    if (!newActivity.time) return false;

    const [newStart, newEnd] = newActivity.time.split("-").map(t => new Date(`1970/01/01 ${t.trim()}`));

    return activities.some(activity => {
      if (!activity.time || activity.id === newActivity.id) return false;
      const [start, end] = activity.time.split("-").map(t => new Date(`1970/01/01 ${t.trim()}`));
      return (newStart < end && newEnd > start);
    });
  }

  function handleDragStart(event: any) {
    setIsLoading(true);
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event
    if (!over) return

    const activeDay = trip.days.find((day) =>
      day.activities.some((activity) => activity.id === active.id)
    )
    const overDay = trip.days.find((day) => `day-${day.id}` === over.id)

    if (!activeDay || !overDay) return

    if (activeDay.id !== overDay.id) {
      const activity = activeDay.activities.find((a) => a.id === active.id)!

      // Check for time conflicts in the target day
      if (activity.time && hasTimeConflict(overDay.activities, activity)) {
        setIsLoading(false)
        return
      }

      setTrip({
        ...trip,
        days: trip.days.map((day) => {
          if (day.id === activeDay.id) {
            return {
              ...day,
              activities: day.activities.filter((a) => a.id !== active.id),
            }
          }
          if (day.id === overDay.id) {
            return {
              ...day,
              activities: [...day.activities, activity],
            }
          }
          return day
        }),
      })
    } else {
      // Handle sorting within the same day
      const oldIndex = activeDay.activities.findIndex((a) => a.id === active.id)
      const newIndex = activeDay.activities.findIndex((a) => a.id === over.id)

      if (oldIndex !== newIndex) {
        setTrip({
          ...trip,
          days: trip.days.map((day) =>
            day.id === activeDay.id
              ? {
                ...day,
                activities: arrayMove(day.activities, oldIndex, newIndex),
              }
              : day
          ),
        })
      }
    }

    setActiveId(null)
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  const activeActivity = activeId
    ? trip.days
      .flatMap((day) => day.activities)
      .find((activity) => activity.id === activeId)
    : null

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{trip.title}</h1>
          <p className="text-muted-foreground">{trip.destination}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-2">
            <select
              className="px-3 py-1 border rounded-md bg-background"
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">All Categories</option>
              <option value="food">Food</option>
              <option value="adventure">Adventure</option>
              <option value="chill">Chill</option>
              <option value="culture">Culture</option>
              <option value="transport">Transport</option>
            </select>
            <Button onClick={addDay} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Day
            </Button>
            <Button onClick={() => setSettingsOpen(true)}>Trip Settings</Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-4">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          collisionDetection={closestCorners}
        >
          <div className="flex gap-4 flex-wrap pb-4">
            {trip.days.map((day) => {
              const filteredActivities = selectedCategory
                ? day.activities.filter((activity) => activity.category === selectedCategory)
                : day.activities

              return (
                <TripDay
                  key={day.id}
                  day={day}
                  onAddActivity={() => {
                    setSelectedDay(day)
                    setActivityDialogOpen(true)
                  }}
                  onEditActivity={(activity) => {
                    setSelectedDay(day)
                    setSelectedActivity(activity)
                    setActivityDialogOpen(true)
                  }}
                  onDeleteActivity={(activityId) => {
                    setTrip({
                      ...trip,
                      days: trip.days.map((d) =>
                        d.id === day.id
                          ? {
                            ...d,
                            activities: d.activities.filter((a) => a.id !== activityId),
                          }
                          : d
                      ),
                    })
                  }}
                  activeId={activeId}
                  activities={filteredActivities}
                />
              )
            }
            )
            }
          </div>

          <DragOverlay>
            {activeActivity && (
              <div className="w-72">
                <ActivityCard
                  activity={activeActivity}
                  onEdit={() => { }}
                  onDelete={() => { }}
                  isDragging
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>

        <div className="bg-card border rounded-lg p-4">
          <Calendar
            mode="range"
            selected={{
              from: new Date(trip.startDate),
              to: new Date(trip.endDate),
            }}
            className="rounded-md border"
            onSelect={(dateRange) => {
              if (dateRange?.from && dateRange?.to) {
                const newStartDate = dateRange.from;
                const newEndDate = dateRange.to;
                const existingDays = trip.days;

                // Generate new days while preserving activities
                const newDays = generateInitialDays(newStartDate, newEndDate).map(newDay => {
                  // Try to find matching day by index from existing days
                  const existingDay = existingDays.find(d =>
                    new Date(d.date).toDateString() === new Date(newDay.date).toDateString()
                  );
                  return existingDay ? { ...newDay, activities: existingDay.activities } : newDay;
                });

                setTrip(prev => ({
                  ...prev,
                  startDate: newStartDate.toISOString(),
                  endDate: newEndDate.toISOString(),
                  days: newDays
                }));
              }
            }}
          />
        </div>
      </div>

      <TripSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        trip={trip}
        onUpdate={(updatedTrip) => {
          setTrip({ ...trip, ...updatedTrip })
          setSettingsOpen(false)
        }}
      />

      <ActivityDialog
        open={activityDialogOpen}
        onClose={() => {
          setActivityDialogOpen(false)
          setSelectedActivity(null)
        }}
        onSave={(activity) => {
          if (selectedDay) {
            if (selectedActivity) {
              // Edit existing activity
              setTrip({
                ...trip,
                days: trip.days.map((day) =>
                  day.id === selectedDay.id
                    ? {
                      ...day,
                      activities: day.activities.map((a) =>
                        a.id === selectedActivity.id ? activity : a
                      ),
                    }
                    : day
                ),
              })
            } else {
              // Add new activity
              setTrip({
                ...trip,
                days: trip.days.map((day) =>
                  day.id === selectedDay.id
                    ? {
                      ...day,
                      activities: [...day.activities, activity],
                    }
                    : day
                ),
              })
            }
          }
          setActivityDialogOpen(false)
          setSelectedActivity(null)
        }}
        activity={selectedActivity}
      />
    </div>
  )
}
