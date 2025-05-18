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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-700/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text bg-300% animate-gradient">
                {trip.title}
              </h1>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <span className="animate-bounce">📍</span> {trip.destination}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span>📅</span> 
                  {new Date(trip.startDate).toLocaleDateString("en-US", { 
                    month: "short", 
                    day: "numeric", 
                    year: "numeric" 
                  })} 
                  <span>→</span> 
                  {new Date(trip.endDate).toLocaleDateString("en-US", { 
                    month: "short", 
                    day: "numeric", 
                    year: "numeric" 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                className="pl-4 pr-10 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-sm font-medium shadow-sm hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">All Categories</option>
                <option value="food">🍽️ Food</option>
                <option value="adventure">🏃‍♂️ Adventure</option>
                <option value="chill">🌴 Chill</option>
                <option value="culture">🏛️ Culture</option>
                <option value="transport">🚗 Transport</option>
              </select>
              <Button
                variant="outline"
                className="px-6 py-2.5 rounded-xl border-2 hover:text-black border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-gray-700/50 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-200"
                onClick={() => setSettingsOpen(true)}
              >
                ⚙️ Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <DndContext
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              {trip.days.map((day) => (
                <div key={day.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                  <TripDay
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
                    onDeleteActivity={(activityId) =>
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
                    }
                    activeId={activeId}
                    activities={day.activities.filter(
                      (activity) =>
                        !selectedCategory || activity.category === selectedCategory
                    )}
                  />
                </div>
              ))}
              <DragOverlay>
                {activeId && (
                  <div className="transform scale-105 rotate-2 opacity-90">
                    <ActivityCard
                      activity={trip.days.find(day => day.activities.some(activity => activity.id === activeId))?.activities.find(activity => activity.id === activeId)!}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      isDragging={true}
                    />
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </main>

      <Button
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
        onClick={addDay}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add Day</span>
      </Button>

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
