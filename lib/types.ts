export interface DashboardSummary {
  attendance_rate: number
  active_members: number
}

export interface DashboardData {
  summary: DashboardSummary;
  rsvp_counts: RSVPCounts;
  next_event: EventSummary | null;
  announcements: Announcement[];
  tasks: Task[];
}

type RawEvent = {
  id: string;
  name: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
};

type RawAnnouncement = {
  id: string;
  title: string;
  content: string;
  created_by_name: string;
  created_at: string;
  is_pinned: boolean;
};

type RawTask = {
  event_id: string;
  title: string;
  is_complete: boolean;
};

export type DashboardRPC = {
  next_event: RawEvent | null;
  rsvp_counts: RSVPCounts | null;
  announcements: RawAnnouncement[] | null;
  tasks: RawTask[] | null;
  summary: {
    attendance_rate: number;
    active_members: number;
  } | null;
};

export interface EventSummary {
  id: string;
  name: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
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

export type RSVPStatus = "yes" | "maybe" | "no" | "pending";

export interface EventRSVP {
  member_id: string;
  full_name: string;
  instrument: string | null;
  status: RSVPStatus;
  responded_at: string | null;
}

export interface Announcement {
  id: string
  title: string
  content: string
  created_by_name: string
  created_at: string
  is_pinned: boolean
}

export type Task = {
  event_id: string;
  title: string;
  is_complete: boolean;
};

export type MemberListItem = {
  member_id: string;
  display_name: string;
  email: string | null;
  instrument: string | null;
  instrument_label: string | null;
  role: string | null;
  attendance_requirement: number | null;
  section: string | null;
  section_label: string | null;
  show_section_header: boolean;
  show_instrument_header: boolean;
};

export type Instrument = {
  id: string;
  name: string;
  section_id: string | null;
  sort_order: number;
};