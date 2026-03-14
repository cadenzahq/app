export interface DashboardSummary {
  attendance_rate: number
  active_members: number
}

export interface DashboardData {
  summary: DashboardSummary | null
  rsvp_counts: RSVPCounts
  next_event: Event | null
  announcements: Announcement[]
  tasks: Task[]
}

export interface EventSummary {
  id: string
  name: string
  start_time: string
  end_time: string
  location: string | null
}

export type EditableEvent = {
  id: string
  name: string
  event_type: string
  start_time: string
  end_time: string
  location: string | null
  season_id: string | null
  series_id: string | null
  description: string | null
}

export type EditableEventWithId = EditableEvent & {
  id: string
}

export type RSVPCounts = {
  yes: number
  maybe: number
  no: number
  pending: number
};

export interface Announcement {
  id: string
  content: string
  created_at?: string
}

export interface Task {
  id: string
  title: string
  is_complete: boolean
}