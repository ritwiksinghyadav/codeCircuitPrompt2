"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Trip } from "@/lib/types"

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
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(updatedTrip)
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
