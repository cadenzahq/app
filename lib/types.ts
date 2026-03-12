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

export interface Event {
  id: string
  name: string
  start_time: string
  location: string | null
}

export interface Task {
  id: string
  title: string
  is_complete: boolean
}

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