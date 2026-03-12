create extension if not exists "pg_cron" with schema "pg_catalog";

drop policy "Enable read access for all users" on "public"."events";

alter table "public"."rsvps" drop constraint "rsvps_pkey";

drop index if exists "public"."rsvps_pkey";


  create table "public"."event_series" (
    "id" uuid not null default gen_random_uuid(),
    "orchestra_id" uuid not null,
    "season_id" uuid,
    "name" text not null,
    "description" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."event_series" enable row level security;


  create table "public"."instruments" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "section_id" uuid,
    "sort_order" integer not null
      );


alter table "public"."instruments" enable row level security;


  create table "public"."member_instruments" (
    "id" uuid not null default gen_random_uuid(),
    "member_id" uuid not null,
    "instrument" text not null,
    "chair" text,
    "instrument_id" uuid not null
      );


alter table "public"."member_instruments" enable row level security;


  create table "public"."seasons" (
    "id" uuid not null default gen_random_uuid(),
    "orchestra_id" uuid not null,
    "name" text not null,
    "start_date" date,
    "end_date" date,
    "created_at" timestamp with time zone default now(),
    "is_current" boolean default false
      );


alter table "public"."seasons" enable row level security;


  create table "public"."sections" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "sort_order" integer not null
      );


alter table "public"."sections" enable row level security;


  create table "public"."tasks" (
    "id" uuid not null default gen_random_uuid(),
    "orchestra_id" uuid,
    "title" text not null,
    "is_complete" boolean default false,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."tasks" enable row level security;

alter table "public"."events" add column "series_id" uuid;

alter table "public"."members" drop column "email";

alter table "public"."members" drop column "emergency_contact_name";

alter table "public"."members" drop column "emergency_contact_phone";

alter table "public"."members" drop column "emergency_contact_relationship";

alter table "public"."members" drop column "first_name";

alter table "public"."members" drop column "instrument";

alter table "public"."members" drop column "last_name";

alter table "public"."members" drop column "phone";

alter table "public"."members" drop column "section";

alter table "public"."members" alter column "user_id" set not null;

alter table "public"."rsvps" add column "id" uuid not null default gen_random_uuid();

alter table "public"."rsvps" alter column "event_id" set not null;

alter table "public"."rsvps" alter column "token" drop default;

alter table "public"."rsvps" alter column "token" set data type text using "token"::text;

alter table "public"."waitlist" enable row level security;

CREATE INDEX announcements_orchestra_created_idx ON public.announcements USING btree (orchestra_id, created_at DESC);

CREATE INDEX attendance_event_idx ON public.attendance USING btree (event_id);

CREATE INDEX attendance_event_member_idx ON public.attendance USING btree (event_id, member_id);

CREATE INDEX attendance_member_idx ON public.attendance USING btree (member_id);

CREATE UNIQUE INDEX event_series_pkey ON public.event_series USING btree (id);

CREATE INDEX events_orchestra_time_idx ON public.events USING btree (orchestra_id, start_time);

CREATE INDEX events_series_idx ON public.events USING btree (series_id);

CREATE UNIQUE INDEX instruments_pkey ON public.instruments USING btree (id);

CREATE UNIQUE INDEX member_instruments_pkey ON public.member_instruments USING btree (id, member_id, instrument_id);

CREATE INDEX members_orchestra_active_idx ON public.members USING btree (orchestra_id, is_active);

CREATE INDEX members_orchestra_idx ON public.members USING btree (orchestra_id);

CREATE INDEX members_user_idx ON public.members USING btree (user_id);

CREATE UNIQUE INDEX orchestras_id_idx ON public.orchestras USING btree (id);

CREATE INDEX rsvps_event_idx ON public.rsvps USING btree (event_id);

CREATE INDEX rsvps_event_member_idx ON public.rsvps USING btree (event_id, member_id);

CREATE INDEX rsvps_orchestra_event_idx ON public.rsvps USING btree (orchestra_id, event_id);

CREATE INDEX rsvps_status_idx ON public.rsvps USING btree (event_id, status);

CREATE UNIQUE INDEX rsvps_token_idx ON public.rsvps USING btree (token);

CREATE UNIQUE INDEX rsvps_token_key ON public.rsvps USING btree (token);

CREATE UNIQUE INDEX rsvps_unique_event_member ON public.rsvps USING btree (event_id, member_id);

CREATE UNIQUE INDEX seasons_pkey ON public.seasons USING btree (id);

CREATE UNIQUE INDEX sections_pkey ON public.sections USING btree (id);

CREATE INDEX series_season_idx ON public.event_series USING btree (season_id);

CREATE INDEX tasks_orchestra_complete_idx ON public.tasks USING btree (orchestra_id, is_complete);

CREATE INDEX tasks_orchestra_created_idx ON public.tasks USING btree (orchestra_id, created_at);

CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);

CREATE UNIQUE INDEX rsvps_pkey ON public.rsvps USING btree (id);

alter table "public"."event_series" add constraint "event_series_pkey" PRIMARY KEY using index "event_series_pkey";

alter table "public"."instruments" add constraint "instruments_pkey" PRIMARY KEY using index "instruments_pkey";

alter table "public"."member_instruments" add constraint "member_instruments_pkey" PRIMARY KEY using index "member_instruments_pkey";

alter table "public"."seasons" add constraint "seasons_pkey" PRIMARY KEY using index "seasons_pkey";

alter table "public"."sections" add constraint "sections_pkey" PRIMARY KEY using index "sections_pkey";

alter table "public"."tasks" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."rsvps" add constraint "rsvps_pkey" PRIMARY KEY using index "rsvps_pkey";

alter table "public"."event_series" add constraint "event_series_orchestra_id_fkey" FOREIGN KEY (orchestra_id) REFERENCES public.orchestras(id) ON DELETE CASCADE not valid;

alter table "public"."event_series" validate constraint "event_series_orchestra_id_fkey";

alter table "public"."event_series" add constraint "event_series_season_id_fkey" FOREIGN KEY (season_id) REFERENCES public.seasons(id) not valid;

alter table "public"."event_series" validate constraint "event_series_season_id_fkey";

alter table "public"."events" add constraint "events_series_id_fkey" FOREIGN KEY (series_id) REFERENCES public.event_series(id) not valid;

alter table "public"."events" validate constraint "events_series_id_fkey";

alter table "public"."instruments" add constraint "instruments_section_id_fkey" FOREIGN KEY (section_id) REFERENCES public.sections(id) not valid;

alter table "public"."instruments" validate constraint "instruments_section_id_fkey";

alter table "public"."member_instruments" add constraint "member_instruments_instrument_id_fkey" FOREIGN KEY (instrument_id) REFERENCES public.instruments(id) not valid;

alter table "public"."member_instruments" validate constraint "member_instruments_instrument_id_fkey";

alter table "public"."member_instruments" add constraint "member_instruments_member_id_fkey" FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE not valid;

alter table "public"."member_instruments" validate constraint "member_instruments_member_id_fkey";

alter table "public"."rsvps" add constraint "rsvps_token_key" UNIQUE using index "rsvps_token_key";

alter table "public"."rsvps" add constraint "rsvps_unique_event_member" UNIQUE using index "rsvps_unique_event_member";

alter table "public"."seasons" add constraint "seasons_orchestra_id_fkey" FOREIGN KEY (orchestra_id) REFERENCES public.orchestras(id) ON DELETE CASCADE not valid;

alter table "public"."seasons" validate constraint "seasons_orchestra_id_fkey";

alter table "public"."tasks" add constraint "tasks_orchestra_id_fkey" FOREIGN KEY (orchestra_id) REFERENCES public.orchestras(id) ON DELETE CASCADE not valid;

alter table "public"."tasks" validate constraint "tasks_orchestra_id_fkey";

set check_function_bodies = off;

create materialized view "public"."dashboard_summary" as  WITH current_seasons AS (
         SELECT seasons.id,
            seasons.orchestra_id
           FROM public.seasons
          WHERE (seasons.is_current = true)
        ), season_events AS (
         SELECT e.id,
            e.name,
            e.start_time,
            e.location,
            e.orchestra_id,
            es.season_id
           FROM (public.events e
             JOIN public.event_series es ON ((e.series_id = es.id)))
        ), member_counts AS (
         SELECT members.orchestra_id,
            count(*) AS active_members
           FROM public.members
          WHERE (members.is_active = true)
          GROUP BY members.orchestra_id
        ), event_counts AS (
         SELECT season_events.orchestra_id,
            season_events.season_id,
            count(*) AS event_count
           FROM season_events
          GROUP BY season_events.orchestra_id, season_events.season_id
        ), attendance_stats AS (
         SELECT e.orchestra_id,
            es.season_id,
            count(*) AS attendance_records
           FROM (((public.attendance a
             JOIN public.members m ON ((a.member_id = m.id)))
             JOIN public.events e ON ((a.event_id = e.id)))
             JOIN public.event_series es ON ((e.series_id = es.id)))
          WHERE (m.is_active = true)
          GROUP BY e.orchestra_id, es.season_id
        ), next_event AS (
         SELECT DISTINCT ON (e.orchestra_id) e.orchestra_id,
            es.season_id,
            e.id,
            e.name,
            e.start_time,
            e.location
           FROM (public.events e
             JOIN public.event_series es ON ((e.series_id = es.id)))
          WHERE (e.start_time >= now())
          ORDER BY e.orchestra_id, e.start_time
        ), rsvp_stats AS (
         SELECT e.orchestra_id,
            es.season_id,
            r.event_id,
            count(*) FILTER (WHERE (r.status = 'yes'::text)) AS yes_count,
            count(*) FILTER (WHERE (r.status = 'maybe'::text)) AS maybe_count,
            count(*) FILTER (WHERE (r.status = 'no'::text)) AS no_count,
            count(*) FILTER (WHERE (r.status = 'pending'::text)) AS pending_count
           FROM ((public.rsvps r
             JOIN public.events e ON ((r.event_id = e.id)))
             JOIN public.event_series es ON ((e.series_id = es.id)))
          GROUP BY e.orchestra_id, es.season_id, r.event_id
        )
 SELECT s.orchestra_id,
    s.id AS season_id,
    COALESCE(mc.active_members, (0)::bigint) AS active_members,
    COALESCE(ec.event_count, (0)::bigint) AS event_count,
    COALESCE(ast.attendance_records, (0)::bigint) AS attendance_records,
        CASE
            WHEN ((COALESCE(mc.active_members, (0)::bigint) * COALESCE(ec.event_count, (0)::bigint)) = 0) THEN (0)::numeric
            ELSE round((((COALESCE(ast.attendance_records, (0)::bigint))::numeric / ((mc.active_members * ec.event_count))::numeric) * (100)::numeric))
        END AS attendance_rate,
    ne.id AS next_event_id,
    ne.name AS next_event_name,
    ne.start_time AS next_event_time,
    ne.location AS next_event_location,
    COALESCE(rs.yes_count, (0)::bigint) AS rsvp_yes,
    COALESCE(rs.maybe_count, (0)::bigint) AS rsvp_maybe,
    COALESCE(rs.no_count, (0)::bigint) AS rsvp_no,
    COALESCE(rs.pending_count, (0)::bigint) AS rsvp_pending
   FROM (((((current_seasons s
     LEFT JOIN member_counts mc ON ((mc.orchestra_id = s.orchestra_id)))
     LEFT JOIN event_counts ec ON (((ec.orchestra_id = s.orchestra_id) AND (ec.season_id = s.id))))
     LEFT JOIN attendance_stats ast ON (((ast.orchestra_id = s.orchestra_id) AND (ast.season_id = s.id))))
     LEFT JOIN next_event ne ON (((ne.orchestra_id = s.orchestra_id) AND (ne.season_id = s.id))))
     LEFT JOIN rsvp_stats rs ON ((rs.event_id = ne.id)));


create or replace view "public"."event_member_attendance" as  SELECT m.id AS member_id,
    m.orchestra_id,
    p.first_name,
    p.preferred_name,
    p.last_name,
    concat(COALESCE(NULLIF(p.preferred_name, ''::text), p.first_name), ' ', p.last_name) AS full_name,
    i.name AS instrument,
    i.sort_order AS instrument_sort_order,
    s.name AS section,
    s.sort_order AS section_sort_order,
    a.event_id,
    a.status AS attendance_status
   FROM (((((public.members m
     LEFT JOIN public.profiles p ON ((p.id = m.user_id)))
     LEFT JOIN public.member_instruments mi ON ((mi.member_id = m.id)))
     LEFT JOIN public.instruments i ON ((i.id = mi.instrument_id)))
     LEFT JOIN public.sections s ON ((s.id = i.section_id)))
     LEFT JOIN public.attendance a ON ((a.member_id = m.id)));


CREATE OR REPLACE FUNCTION public.get_dashboard_data(orchestra_id uuid)
 RETURNS json
 LANGUAGE sql
 STABLE
AS $function$
select json_build_object(

  -- Summary metrics (from materialized view)
  'summary', (
    select json_build_object(
      'attendance_rate', s.attendance_rate,
      'active_members', s.active_members
    )
    from dashboard_summary s
    where s.orchestra_id = get_dashboard_data.orchestra_id
  ),

  -- RSVP counts
  'rsvp_counts', (
    select json_build_object(
      'yes', s.rsvp_yes,
      'maybe', s.rsvp_maybe,
      'no', s.rsvp_no,
      'pending', s.rsvp_pending
    )
    from dashboard_summary s
    where s.orchestra_id = get_dashboard_data.orchestra_id
  ),

  -- Next event
  'next_event', (
    select
      case
        when s.next_event_id is null then null
        else json_build_object(
          'id', s.next_event_id,
          'name', s.next_event_name,
          'start_time', s.next_event_time,
          'location', s.next_event_location
        )
      end
    from dashboard_summary s
    where s.orchestra_id = get_dashboard_data.orchestra_id
  ),

  -- Latest announcements
  'announcements',
  coalesce(
    (
      select json_agg(a)
      from (
        select
          id,
          content,
          created_at
        from announcements
        where orchestra_id = get_dashboard_data.orchestra_id
        order by created_at desc
        limit 3
      ) a
    ),
    '[]'::json
  ),

  -- Pending tasks
  'tasks',
  coalesce(
    (
      select json_agg(t)
      from (
        select
          id,
          title,
          is_complete
        from tasks
        where orchestra_id = get_dashboard_data.orchestra_id
        and is_complete = false
        order by created_at
        limit 3
      ) t
    ),
    '[]'::json
  )

);
$function$
;

CREATE UNIQUE INDEX dashboard_summary_idx ON public.dashboard_summary USING btree (orchestra_id, season_id);

CREATE UNIQUE INDEX dashboard_summary_orchestra_idx ON public.dashboard_summary USING btree (orchestra_id);

grant delete on table "public"."event_series" to "anon";

grant insert on table "public"."event_series" to "anon";

grant references on table "public"."event_series" to "anon";

grant select on table "public"."event_series" to "anon";

grant trigger on table "public"."event_series" to "anon";

grant truncate on table "public"."event_series" to "anon";

grant update on table "public"."event_series" to "anon";

grant delete on table "public"."event_series" to "authenticated";

grant insert on table "public"."event_series" to "authenticated";

grant references on table "public"."event_series" to "authenticated";

grant select on table "public"."event_series" to "authenticated";

grant trigger on table "public"."event_series" to "authenticated";

grant truncate on table "public"."event_series" to "authenticated";

grant update on table "public"."event_series" to "authenticated";

grant delete on table "public"."event_series" to "service_role";

grant insert on table "public"."event_series" to "service_role";

grant references on table "public"."event_series" to "service_role";

grant select on table "public"."event_series" to "service_role";

grant trigger on table "public"."event_series" to "service_role";

grant truncate on table "public"."event_series" to "service_role";

grant update on table "public"."event_series" to "service_role";

grant delete on table "public"."instruments" to "anon";

grant insert on table "public"."instruments" to "anon";

grant references on table "public"."instruments" to "anon";

grant select on table "public"."instruments" to "anon";

grant trigger on table "public"."instruments" to "anon";

grant truncate on table "public"."instruments" to "anon";

grant update on table "public"."instruments" to "anon";

grant delete on table "public"."instruments" to "authenticated";

grant insert on table "public"."instruments" to "authenticated";

grant references on table "public"."instruments" to "authenticated";

grant select on table "public"."instruments" to "authenticated";

grant trigger on table "public"."instruments" to "authenticated";

grant truncate on table "public"."instruments" to "authenticated";

grant update on table "public"."instruments" to "authenticated";

grant delete on table "public"."instruments" to "service_role";

grant insert on table "public"."instruments" to "service_role";

grant references on table "public"."instruments" to "service_role";

grant select on table "public"."instruments" to "service_role";

grant trigger on table "public"."instruments" to "service_role";

grant truncate on table "public"."instruments" to "service_role";

grant update on table "public"."instruments" to "service_role";

grant delete on table "public"."member_instruments" to "anon";

grant insert on table "public"."member_instruments" to "anon";

grant references on table "public"."member_instruments" to "anon";

grant select on table "public"."member_instruments" to "anon";

grant trigger on table "public"."member_instruments" to "anon";

grant truncate on table "public"."member_instruments" to "anon";

grant update on table "public"."member_instruments" to "anon";

grant delete on table "public"."member_instruments" to "authenticated";

grant insert on table "public"."member_instruments" to "authenticated";

grant references on table "public"."member_instruments" to "authenticated";

grant select on table "public"."member_instruments" to "authenticated";

grant trigger on table "public"."member_instruments" to "authenticated";

grant truncate on table "public"."member_instruments" to "authenticated";

grant update on table "public"."member_instruments" to "authenticated";

grant delete on table "public"."member_instruments" to "service_role";

grant insert on table "public"."member_instruments" to "service_role";

grant references on table "public"."member_instruments" to "service_role";

grant select on table "public"."member_instruments" to "service_role";

grant trigger on table "public"."member_instruments" to "service_role";

grant truncate on table "public"."member_instruments" to "service_role";

grant update on table "public"."member_instruments" to "service_role";

grant delete on table "public"."seasons" to "anon";

grant insert on table "public"."seasons" to "anon";

grant references on table "public"."seasons" to "anon";

grant select on table "public"."seasons" to "anon";

grant trigger on table "public"."seasons" to "anon";

grant truncate on table "public"."seasons" to "anon";

grant update on table "public"."seasons" to "anon";

grant delete on table "public"."seasons" to "authenticated";

grant insert on table "public"."seasons" to "authenticated";

grant references on table "public"."seasons" to "authenticated";

grant select on table "public"."seasons" to "authenticated";

grant trigger on table "public"."seasons" to "authenticated";

grant truncate on table "public"."seasons" to "authenticated";

grant update on table "public"."seasons" to "authenticated";

grant delete on table "public"."seasons" to "service_role";

grant insert on table "public"."seasons" to "service_role";

grant references on table "public"."seasons" to "service_role";

grant select on table "public"."seasons" to "service_role";

grant trigger on table "public"."seasons" to "service_role";

grant truncate on table "public"."seasons" to "service_role";

grant update on table "public"."seasons" to "service_role";

grant delete on table "public"."sections" to "anon";

grant insert on table "public"."sections" to "anon";

grant references on table "public"."sections" to "anon";

grant select on table "public"."sections" to "anon";

grant trigger on table "public"."sections" to "anon";

grant truncate on table "public"."sections" to "anon";

grant update on table "public"."sections" to "anon";

grant delete on table "public"."sections" to "authenticated";

grant insert on table "public"."sections" to "authenticated";

grant references on table "public"."sections" to "authenticated";

grant select on table "public"."sections" to "authenticated";

grant trigger on table "public"."sections" to "authenticated";

grant truncate on table "public"."sections" to "authenticated";

grant update on table "public"."sections" to "authenticated";

grant delete on table "public"."sections" to "service_role";

grant insert on table "public"."sections" to "service_role";

grant references on table "public"."sections" to "service_role";

grant select on table "public"."sections" to "service_role";

grant trigger on table "public"."sections" to "service_role";

grant truncate on table "public"."sections" to "service_role";

grant update on table "public"."sections" to "service_role";

grant delete on table "public"."tasks" to "anon";

grant insert on table "public"."tasks" to "anon";

grant references on table "public"."tasks" to "anon";

grant select on table "public"."tasks" to "anon";

grant trigger on table "public"."tasks" to "anon";

grant truncate on table "public"."tasks" to "anon";

grant update on table "public"."tasks" to "anon";

grant delete on table "public"."tasks" to "authenticated";

grant insert on table "public"."tasks" to "authenticated";

grant references on table "public"."tasks" to "authenticated";

grant select on table "public"."tasks" to "authenticated";

grant trigger on table "public"."tasks" to "authenticated";

grant truncate on table "public"."tasks" to "authenticated";

grant update on table "public"."tasks" to "authenticated";

grant delete on table "public"."tasks" to "service_role";

grant insert on table "public"."tasks" to "service_role";

grant references on table "public"."tasks" to "service_role";

grant select on table "public"."tasks" to "service_role";

grant trigger on table "public"."tasks" to "service_role";

grant truncate on table "public"."tasks" to "service_role";

grant update on table "public"."tasks" to "service_role";


  create policy "Enable read access for all users in orchestra"
  on "public"."event_series"
  as permissive
  for select
  to public
using ((orchestra_id IN ( SELECT members.orchestra_id
   FROM public.members
  WHERE (members.user_id = auth.uid()))));



  create policy "Enable read access for all users in orchestra"
  on "public"."events"
  as permissive
  for select
  to public
using ((orchestra_id IN ( SELECT members.orchestra_id
   FROM public.members
  WHERE (members.user_id = auth.uid()))));



  create policy "Enable read access for all users in orchestra"
  on "public"."seasons"
  as permissive
  for select
  to public
using ((orchestra_id IN ( SELECT members.orchestra_id
   FROM public.members
  WHERE (members.user_id = auth.uid()))));



