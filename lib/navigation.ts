export function getNavigation(role: string, orchestraId: string) {
  if (role === "member") {
    return [
      { label: "Dashboard", href: `/app/${orchestraId}/member/dashboard` },
      { label: "Events", href: `/app/${orchestraId}/member/events` },
      { label: "Announcements", href: `/app/${orchestraId}/member/announcements` },
      { label: "Attendance", href: `/app/${orchestraId}/member/attendance` },
    ];
  }

  return [
    { label: "Dashboard", href: `/app/${orchestraId}/admin/dashboard` },
    { label: "Events", href: `/app/${orchestraId}/admin/events` },
    { label: "Members", href: `/app/${orchestraId}/admin/members` },
    { label: "Announcements", href: `/app/${orchestraId}/admin/announcements` },
    { label: "Tasks", href: `/app/${orchestraId}/admin/tasks` },
  ];
}