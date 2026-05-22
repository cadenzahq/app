import { ReactNode } from "react";

type BrowserFrameProps = {
  children: ReactNode;
};

export default function BrowserFrame({
  children,
}: BrowserFrameProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-slate-300" />
        <div className="h-3 w-3 rounded-full bg-slate-300" />
        <div className="h-3 w-3 rounded-full bg-slate-300" />
      </div>

      {children}
    </div>
  );
}