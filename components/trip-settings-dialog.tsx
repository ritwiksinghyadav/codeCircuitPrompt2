"use client"

import type React from "react"

import { useState } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Trip, TripTheme } from "@/lib/types"

interface TripSettingsDialogProps {
  open: boolean
  onClose: () => void
  trip: Trip
  onUpdate: (trip: Partial<Trip>) => void
}

export function TripSettingsDialog({ open, onClose, trip, onUpdate }: TripSettingsDialogProps) {
  const [updatedTrip, setUpdatedTrip] = useState<Partial<Trip>>({
    title: trip.title,
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    theme: { ...trip.theme },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(updatedTrip)
  }

  const updateTheme = (key: keyof TripTheme, value: string) => {
    setUpdatedTrip({
      ...updatedTrip,
      theme: {
        ...updatedTrip.theme!,
        [key]: value,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trip Settings</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Trip Title</Label>
            <Input
              id="title"
              value={updatedTrip.title}
              onChange={(e) => setUpdatedTrip({ ...updatedTrip, title: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={updatedTrip.destination}
              onChange={(e) => setUpdatedTrip({ ...updatedTrip, destination: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={new Date(updatedTrip.startDate!).toISOString().split("T")[0]}
                onChange={(e) =>
                  setUpdatedTrip({
                    ...updatedTrip,
                    startDate: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={new Date(updatedTrip.endDate!).toISOString().split("T")[0]}
                onChange={(e) =>
                  setUpdatedTrip({
                    ...updatedTrip,
                    endDate: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-2 pt-2">
            <Label>Theme Mode</Label>
            <RadioGroup
              value={updatedTrip.theme?.mode}
              onValueChange={(value) => updateTheme("mode", value)}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="mode-light" />
                <Label htmlFor="mode-light">Light</Label>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <RadioGroupItem value="dark" id="mode-dark" />
                <Label htmlFor="mode-dark">Dark</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>Color Theme</Label>
            <RadioGroup
              value={updatedTrip.theme?.color}
              onValueChange={(value) => updateTheme("color", value)}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center justify-center">
                <RadioGroupItem value="pink" id="color-pink" className="sr-only peer" />
                <Label
                  htmlFor="color-pink"
                  className="w-8 h-8 rounded-full bg-pink-500 cursor-pointer ring-offset-2 peer-data-[state=checked]:ring-2 ring-pink-500"
                />
              </div>
              <div className="flex items-center justify-center">
                <RadioGroupItem value="purple" id="color-purple" className="sr-only peer" />
                <Label
                  htmlFor="color-purple"
                  className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer ring-offset-2 peer-data-[state=checked]:ring-2 ring-purple-500"
                />
              </div>
              <div className="flex items-center justify-center">
                <RadioGroupItem value="blue" id="color-blue" className="sr-only peer" />
                <Label
                  htmlFor="color-blue"
                  className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer ring-offset-2 peer-data-[state=checked]:ring-2 ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-center">
                <RadioGroupItem value="green" id="color-green" className="sr-only peer" />
                <Label
                  htmlFor="color-green"
                  className="w-8 h-8 rounded-full bg-green-500 cursor-pointer ring-offset-2 peer-data-[state=checked]:ring-2 ring-green-500"
                />
              </div>
              <div className="flex items-center justify-center">
                <RadioGroupItem value="orange" id="color-orange" className="sr-only peer" />
                <Label
                  htmlFor="color-orange"
                  className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer ring-offset-2 peer-data-[state=checked]:ring-2 ring-orange-500"
                />
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>Trip Vibe</Label>
            <RadioGroup
              value={updatedTrip.theme?.vibe}
              onValueChange={(value) => updateTheme("vibe", value)}
              className="flex flex-wrap"
            >
              <div className="flex items-center space-x-2 mr-4">
                <RadioGroupItem value="adventure" id="vibe-adventure" />
                <Label htmlFor="vibe-adventure">Adventure</Label>
              </div>
              <div className="flex items-center space-x-2 mr-4">
                <RadioGroupItem value="relaxing" id="vibe-relaxing" />
                <Label htmlFor="vibe-relaxing">Relaxing</Label>
              </div>
              <div className="flex items-center space-x-2 mr-4">
                <RadioGroupItem value="cultural" id="vibe-cultural" />
                <Label htmlFor="vibe-cultural">Cultural</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="party" id="vibe-party" />
                <Label htmlFor="vibe-party">Party</Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
