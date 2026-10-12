import { Plus } from "lucide-react";
import Button from "./Button";

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="col-span-full flex min-h-[405px] w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
        <Icon className="h-10 w-10 text-white/60" />
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="max-w-sm text-sm text-white/60">{description}</p>
      </div>

      <Button text={actionLabel} icon={Plus} size="md" onClick={onAction} />
    </div>
  );
}