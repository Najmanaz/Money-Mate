import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  amount: string;
  icon: LucideIcon;
  color: string;
}

export default function SummaryCard({
  title,
  amount,
  icon: Icon,
  color,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>

      <h2 className="mt-5 text-2xl font-bold text-[#26354A]">
        {amount}
      </h2>
    </div>
  );
}
