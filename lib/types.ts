export type ActivityCategory = "food" | "adventure" | "chill" | "culture" | "transport"

export interface Activity {
  id: string
  title: string
  emoji: string
  time?: string
  location?: string
  category?: ActivityCategory
  notes?: string
  mapLink?: string
}

export interface Day {
  id: string
  title: string
  date: string
  activities: Activity[]
}

export interface TripTheme {
  mode: "light" | "dark"
  color: string
  vibe: string
}

export interface Trip {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  days: Day[]
  theme: TripTheme
}
