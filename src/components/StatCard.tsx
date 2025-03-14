import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  className?: string;
  isLoading?: boolean;
  formatFn?: (value: number) => string;
}

const StatCard = ({
  title,
  value,
  className,
  isLoading = false,
  formatFn = (num) => num.toLocaleString(),
}: StatCardProps) => {
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
          </div>
        </>
      )}
    </div>
  );
};

export default StatCard;
