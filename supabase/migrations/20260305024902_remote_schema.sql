drop extension if exists "pg_net";

create type "public"."attendance_status" as enum ('present', 'absent', 'excused', 'late');

create type "public"."event_type" as enum ('rehearsal', 'concert', 'sectional', 'audition', 'other');

create type "public"."member_role" as enum ('admin', 'member', 'manager', 'conductor', 'librarian');

create type "public"."rsvp_status" as enum ('yes', 'no', 'maybe', 'pending');


  create table "public"."announcements" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "orchestra_id" uuid not null,
    "title" text,
    "content" text,
    "created_by" uuid,
    "is_pinned" boolean default false
      );


alter table "public"."announcements" enable row level security;


  create table "public"."attendance" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "orchestra_id" uuid not null,
    "event_id" uuid,
    "member_id" uuid not null,
    "status" text,
    "attendance_locked" boolean default false
      );


alter table "public"."attendance" enable row level security;


  create table "public"."events" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "orchestra_id" uuid not null,
    "name" text,
    "event_type" text,
    "start_time" timestamp with time zone,
    "end_time" timestamp with time zone,
    "location" text,
    "description" text,
    "is_attendance_locked" boolean default false
      );


alter table "public"."events" enable row level security;


  create table "public"."members" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "orchestra_id" uuid not null,
    "first_name" text,
    "last_name" text,
    "email" text,
    "phone" text,
    "instrument" text,
    "section" text,
    "is_active" boolean default true,
    "emergency_contact_name" text,
    "emergency_contact_phone" text,
    "emergency_contact_relationship" text,
    "user_id" uuid,
    "role" text,
    "attendance_requirement" bigint
      );


alter table "public"."members" enable row level security;


  create table "public"."orchestras" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text,
    "created_by" uuid
      );


alter table "public"."orchestras" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "email" text,
    "avatar_url" text,
    "first_name" text,
    "last_name" text,
    "preferred_name" text,
    "phone" text,
    "emergency_contact_name" text,
    "emergency_contact_phone" text,
    "emergency_contact_relationship" text
      );


alter table "public"."profiles" enable row level security;


  create table "public"."rsvps" (
    "token" uuid not null default gen_random_uuid(),
    "responded_at" timestamp with time zone not null default now(),
    "event_id" uuid,
    "member_id" uuid not null,
    "orchestra_id" uuid not null,
    "status" text not null default 'pending'::text
      );


alter table "public"."rsvps" enable row level security;


  create table "public"."waitlist" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "created_at" timestamp with time zone default now()
      );


CREATE UNIQUE INDEX announcements_pkey ON public.announcements USING btree (id);

CREATE INDEX attendance_event_id_idx ON public.attendance USING btree (event_id);

CREATE INDEX attendance_member_id_idx ON public.attendance USING btree (member_id);

CREATE UNIQUE INDEX attendance_pkey ON public.attendance USING btree (id, member_id);

CREATE UNIQUE INDEX attendance_unique_event_member ON public.attendance USING btree (event_id, member_id);

CREATE UNIQUE INDEX attendance_unique_member_event ON public.attendance USING btree (event_id, member_id);

CREATE INDEX events_orchestra_id_idx ON public.events USING btree (orchestra_id);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE INDEX members_orchestra_id_idx ON public.members USING btree (orchestra_id);

CREATE UNIQUE INDEX members_pkey ON public.members USING btree (id);

CREATE UNIQUE INDEX members_unique_user_orchestra ON public.members USING btree (user_id, orchestra_id);

CREATE UNIQUE INDEX orchestras_pkey ON public.orchestras USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE INDEX rsvps_event_id_idx ON public.rsvps USING btree (event_id);

CREATE INDEX rsvps_member_id_idx ON public.rsvps USING btree (member_id);

CREATE UNIQUE INDEX rsvps_pkey ON public.rsvps USING btree (token, member_id);

CREATE UNIQUE INDEX rsvps_unique_member_event ON public.rsvps USING btree (event_id, member_id);

CREATE UNIQUE INDEX unique_event_member ON public.rsvps USING btree (event_id, member_id);

CREATE UNIQUE INDEX waitlist_email_key ON public.waitlist USING btree (email);

CREATE UNIQUE INDEX waitlist_pkey ON public.waitlist USING btree (id);

alter table "public"."announcements" add constraint "announcements_pkey" PRIMARY KEY using index "announcements_pkey";

alter table "public"."attendance" add constraint "attendance_pkey" PRIMARY KEY using index "attendance_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."members" add constraint "members_pkey" PRIMARY KEY using index "members_pkey";

alter table "public"."orchestras" add constraint "orchestras_pkey" PRIMARY KEY using index "orchestras_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."rsvps" add constraint "rsvps_pkey" PRIMARY KEY using index "rsvps_pkey";

alter table "public"."waitlist" add constraint "waitlist_pkey" PRIMARY KEY using index "waitlist_pkey";

alter table "public"."announcements" add constraint "announcements_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.members(id) not valid;

alter table "public"."announcements" validate constraint "announcements_created_by_fkey";

alter table "public"."announcements" add constraint "announcements_orchestra_id_fkey" FOREIGN KEY (orchestra_id) REFERENCES public.orchestras(id) not valid;

alter table "public"."announcements" validate constraint "announcements_orchestra_id_fkey";

alter table "public"."attendance" add constraint "attendance_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) not valid;

alter table "public"."attendance" validate constraint "attendance_event_id_fkey";

alter table "public"."attendance" add constraint "attendance_member_id_fkey" FOREIGN KEY (member_id) REFERENCES public.members(id) not valid;

alter table "public"."attendance" validate constraint "attendance_member_id_fkey";

alter table "public"."attendance" add constraint "attendance_orchestra_id_fkey" FOREIGN KEY (orchestra_id) REFERENCES public.orchestras(id) not valid;

alter table "public"."attendance" validate constraint "attendance_orchestra_id_fkey";

alter table "public"."attendance" add constraint "attendance_status_check" CHECK ((status = ANY (ARRAY['present'::text, 'absent'::text, 'late'::text, 'excused'::text]))) not valid;

alter table "public"."attendance" validate constraint "attendance_status_check";

alter table "public"."attendance" add constraint "attendance_unique_event_member" UNIQUE using index "attendance_unique_event_member";

alter table "public"."attendance" add constraint "attendance_unique_member_event" UNIQUE using index "attendance_unique_member_event";

alter table "public"."events" add constraint "events_orchestra_id_fkey" FOREIGN KEY (orchestra_id) REFERENCES public.orchestras(id) ON DELETE CASCADE not valid;

alter table "public"."events" validate constraint "events_orchestra_id_fkey";

alter table "public"."members" add constraint "members_orchestra_id_fkey" FOREIGN KEY (orchestra_id) REFERENCES public.orchestras(id) ON DELETE CASCADE not valid;

alter table "public"."members" validate constraint "members_orchestra_id_fkey";

alter table "public"."members" add constraint "members_role_check" CHECK ((role = ANY (ARRAY['admin'::text, 'member'::text, 'manager'::text, 'section leader'::text, 'conductor'::text, 'librarian'::text]))) not valid;

alter table "public"."members" validate constraint "members_role_check";

alter table "public"."members" add constraint "members_unique_user_orchestra" UNIQUE using index "members_unique_user_orchestra";

alter table "public"."members" add constraint "members_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."members" validate constraint "members_user_id_fkey1";

alter table "public"."orchestras" add constraint "orchestras_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."orchestras" validate constraint "orchestras_created_by_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."rsvps" add constraint "rsvps_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."rsvps" validate constraint "rsvps_event_id_fkey";

alter table "public"."rsvps" add constraint "rsvps_member_id_fkey" FOREIGN KEY (member_id) REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."rsvps" validate constraint "rsvps_member_id_fkey";

alter table "public"."rsvps" add constraint "rsvps_orchestra_id_fkey" FOREIGN KEY (orchestra_id) REFERENCES public.orchestras(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."rsvps" validate constraint "rsvps_orchestra_id_fkey";

alter table "public"."rsvps" add constraint "rsvps_status_check" CHECK ((status = ANY (ARRAY['yes'::text, 'no'::text, 'maybe'::text, 'pending'::text]))) not valid;

alter table "public"."rsvps" validate constraint "rsvps_status_check";

alter table "public"."rsvps" add constraint "rsvps_unique_member_event" UNIQUE using index "rsvps_unique_member_event";

alter table "public"."rsvps" add constraint "unique_event_member" UNIQUE using index "unique_event_member";

alter table "public"."waitlist" add constraint "waitlist_email_key" UNIQUE using index "waitlist_email_key";

grant delete on table "public"."announcements" to "anon";

grant insert on table "public"."announcements" to "anon";

grant references on table "public"."announcements" to "anon";

grant select on table "public"."announcements" to "anon";

grant trigger on table "public"."announcements" to "anon";

grant truncate on table "public"."announcements" to "anon";

grant update on table "public"."announcements" to "anon";

grant delete on table "public"."announcements" to "authenticated";

grant insert on table "public"."announcements" to "authenticated";

grant references on table "public"."announcements" to "authenticated";

grant select on table "public"."announcements" to "authenticated";

grant trigger on table "public"."announcements" to "authenticated";

grant truncate on table "public"."announcements" to "authenticated";

grant update on table "public"."announcements" to "authenticated";

grant delete on table "public"."announcements" to "service_role";

grant insert on table "public"."announcements" to "service_role";

grant references on table "public"."announcements" to "service_role";

grant select on table "public"."announcements" to "service_role";

grant trigger on table "public"."announcements" to "service_role";

grant truncate on table "public"."announcements" to "service_role";

grant update on table "public"."announcements" to "service_role";

grant delete on table "public"."attendance" to "anon";

grant insert on table "public"."attendance" to "anon";

grant references on table "public"."attendance" to "anon";

grant select on table "public"."attendance" to "anon";

grant trigger on table "public"."attendance" to "anon";

grant truncate on table "public"."attendance" to "anon";

grant update on table "public"."attendance" to "anon";

grant delete on table "public"."attendance" to "authenticated";

grant insert on table "public"."attendance" to "authenticated";

grant references on table "public"."attendance" to "authenticated";

grant select on table "public"."attendance" to "authenticated";

grant trigger on table "public"."attendance" to "authenticated";

grant truncate on table "public"."attendance" to "authenticated";

grant update on table "public"."attendance" to "authenticated";

grant delete on table "public"."attendance" to "service_role";

grant insert on table "public"."attendance" to "service_role";

grant references on table "public"."attendance" to "service_role";

grant select on table "public"."attendance" to "service_role";

grant trigger on table "public"."attendance" to "service_role";

grant truncate on table "public"."attendance" to "service_role";

grant update on table "public"."attendance" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."members" to "anon";

grant insert on table "public"."members" to "anon";

grant references on table "public"."members" to "anon";

grant select on table "public"."members" to "anon";

grant trigger on table "public"."members" to "anon";

grant truncate on table "public"."members" to "anon";

grant update on table "public"."members" to "anon";

grant delete on table "public"."members" to "authenticated";

grant insert on table "public"."members" to "authenticated";

grant references on table "public"."members" to "authenticated";

grant select on table "public"."members" to "authenticated";

grant trigger on table "public"."members" to "authenticated";

grant truncate on table "public"."members" to "authenticated";

grant update on table "public"."members" to "authenticated";

grant delete on table "public"."members" to "service_role";

grant insert on table "public"."members" to "service_role";

grant references on table "public"."members" to "service_role";

grant select on table "public"."members" to "service_role";

grant trigger on table "public"."members" to "service_role";

grant truncate on table "public"."members" to "service_role";

grant update on table "public"."members" to "service_role";

grant delete on table "public"."orchestras" to "anon";

grant insert on table "public"."orchestras" to "anon";

grant references on table "public"."orchestras" to "anon";

grant select on table "public"."orchestras" to "anon";

grant trigger on table "public"."orchestras" to "anon";

grant truncate on table "public"."orchestras" to "anon";

grant update on table "public"."orchestras" to "anon";

grant delete on table "public"."orchestras" to "authenticated";

grant insert on table "public"."orchestras" to "authenticated";

grant references on table "public"."orchestras" to "authenticated";

grant select on table "public"."orchestras" to "authenticated";

grant trigger on table "public"."orchestras" to "authenticated";

grant truncate on table "public"."orchestras" to "authenticated";

grant update on table "public"."orchestras" to "authenticated";

grant delete on table "public"."orchestras" to "service_role";

grant insert on table "public"."orchestras" to "service_role";

grant references on table "public"."orchestras" to "service_role";

grant select on table "public"."orchestras" to "service_role";

grant trigger on table "public"."orchestras" to "service_role";

grant truncate on table "public"."orchestras" to "service_role";

grant update on table "public"."orchestras" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."rsvps" to "anon";

grant insert on table "public"."rsvps" to "anon";

grant references on table "public"."rsvps" to "anon";

grant select on table "public"."rsvps" to "anon";

grant trigger on table "public"."rsvps" to "anon";

grant truncate on table "public"."rsvps" to "anon";

grant update on table "public"."rsvps" to "anon";

grant delete on table "public"."rsvps" to "authenticated";

grant insert on table "public"."rsvps" to "authenticated";

grant references on table "public"."rsvps" to "authenticated";

grant select on table "public"."rsvps" to "authenticated";

grant trigger on table "public"."rsvps" to "authenticated";

grant truncate on table "public"."rsvps" to "authenticated";

grant update on table "public"."rsvps" to "authenticated";

grant delete on table "public"."rsvps" to "service_role";

grant insert on table "public"."rsvps" to "service_role";

grant references on table "public"."rsvps" to "service_role";

grant select on table "public"."rsvps" to "service_role";

grant trigger on table "public"."rsvps" to "service_role";

grant truncate on table "public"."rsvps" to "service_role";

grant update on table "public"."rsvps" to "service_role";

grant delete on table "public"."waitlist" to "anon";

grant insert on table "public"."waitlist" to "anon";

grant references on table "public"."waitlist" to "anon";

grant select on table "public"."waitlist" to "anon";

grant trigger on table "public"."waitlist" to "anon";

grant truncate on table "public"."waitlist" to "anon";

grant update on table "public"."waitlist" to "anon";

grant delete on table "public"."waitlist" to "authenticated";

grant insert on table "public"."waitlist" to "authenticated";

grant references on table "public"."waitlist" to "authenticated";

grant select on table "public"."waitlist" to "authenticated";

grant trigger on table "public"."waitlist" to "authenticated";

grant truncate on table "public"."waitlist" to "authenticated";

grant update on table "public"."waitlist" to "authenticated";

grant delete on table "public"."waitlist" to "service_role";

grant insert on table "public"."waitlist" to "service_role";

grant references on table "public"."waitlist" to "service_role";

grant select on table "public"."waitlist" to "service_role";

grant trigger on table "public"."waitlist" to "service_role";

grant truncate on table "public"."waitlist" to "service_role";

grant update on table "public"."waitlist" to "service_role";


  create policy "Announcements readable"
  on "public"."announcements"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Enable insert for all users only"
  on "public"."attendance"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."attendance"
  as permissive
  for select
  to public
using (true);



  create policy "Enable update for all users"
  on "public"."attendance"
  as permissive
  for update
  to public
using (true)
with check (true);



  create policy "Enable insert for all users"
  on "public"."events"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."events"
  as permissive
  for select
  to public
using (true);



  create policy "Enable update for all users"
  on "public"."events"
  as permissive
  for update
  to public
using (true)
with check (true);



  create policy "Members readable"
  on "public"."members"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can insert their own membership"
  on "public"."members"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own memberships"
  on "public"."members"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Enable insert for all users"
  on "public"."orchestras"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."orchestras"
  as permissive
  for select
  to public
using (true);



  create policy "Members can view profiles in their orchestra"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.members
  WHERE (members.user_id = profiles.id))));



  create policy "Users can insert their own profile"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check ((auth.uid() = id));



  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Users can view their own profile"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "Enable insert for all users only"
  on "public"."rsvps"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."rsvps"
  as permissive
  for select
  to public
using (true);



  create policy "Enable update for all users"
  on "public"."rsvps"
  as permissive
  for update
  to public
using (true)
with check (true);



