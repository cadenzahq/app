export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-6 w-48 bg-navy/20 rounded animate-pulse" />
      <div className="h-32 bg-navy/10 rounded-xl animate-pulse" />
      <div className="h-32 bg-navy/10 rounded-xl animate-pulse" />
    </div>
  );
}