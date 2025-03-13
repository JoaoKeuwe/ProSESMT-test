import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  previousValue?: number;
  className?: string;
  isLoading?: boolean;
  formatFn?: (value: number) => string;
}

const StatCard = ({
  title,
  value,
  previousValue,
  className,
  isLoading = false,
  formatFn = (num) => num.toLocaleString(),
}: StatCardProps) => {
  const percentChange = previousValue
    ? ((value - previousValue) / previousValue) * 100
    : null;

  let trend;
  if (percentChange === null) {
    trend = null;
  } else if (percentChange > 0) {
    trend = { icon: ArrowUp, color: "text-red-500", value: percentChange };
  } else if (percentChange < 0) {
    trend = {
      icon: ArrowDown,
      color: "text-green-500",
      value: Math.abs(percentChange),
    };
  } else {
    trend = { icon: Minus, color: "text-gray-500", value: 0 };
  }

  return (
    <div
      className={cn(
        "glass-card card-hover rounded-2xl p-6 shadow-sm transition-all duration-300 animate-fade-in",
        className
      )}
    >
      <h3 className="text-gray-500 font-medium mb-2 text-sm">{title}</h3>

      {isLoading ? (
        <div className="w-24 h-8 bg-gray-200 rounded loading-shimmer"></div>
      ) : (
        <>
          <div className="flex items-end space-x-1">
            <p className="text-3xl font-semibold">{formatFn(value)}</p>

            {trend && (
              <div className={`flex items-center ${trend.color} text-sm mb-1`}>
                <trend.icon size={14} className="mr-1" />
                <span>{trend.value.toFixed(1)}%</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StatCard;
