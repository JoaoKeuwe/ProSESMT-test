
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "@/hooks/use-theme";

interface DataPoint {
  [key: string]: number | string;
}

interface DataChartProps {
  data: DataPoint[];
  type?: "line" | "bar";
  title: string;
  dataKeys: {
    key: string;
    color: string;
    name: string;
  }[];
  xAxisKey: string;
  isLoading?: boolean;
}

const DataChart = ({
  data,
  type = "line",
  title,
  dataKeys,
  xAxisKey,
  isLoading = false,
}: DataChartProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse h-40 w-full bg-gray-200 rounded dark:bg-gray-800" />
        </div>
      );
    }

    const axisStyle = {
      fontSize: 12,
      fill: isDarkMode ? "#fff" : "var(--foreground)",
    };

    if (type === "line") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={axisStyle} 
              tickMargin={10}
              stroke={isDarkMode ? "#fff" : "var(--foreground)"}
            />
            <YAxis 
              tick={axisStyle} 
              stroke={isDarkMode ? "#fff" : "var(--foreground)"}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "var(--card)",
                color: "var(--card-foreground)",
                borderRadius: "8px",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                border: "1px solid var(--border)"
              }} 
            />
            <Legend />
            {dataKeys.map((dataKey) => (
              <Line
                key={dataKey.key}
                type="monotone"
                dataKey={dataKey.key}
                name={dataKey.name}
                stroke={dataKey.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey={xAxisKey} 
            tick={axisStyle} 
            tickMargin={10}
            stroke={isDarkMode ? "#fff" : "var(--foreground)"}
          />
          <YAxis 
            tick={axisStyle} 
            stroke={isDarkMode ? "#fff" : "var(--foreground)"}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderRadius: "8px",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
              border: "1px solid var(--border)"
            }} 
          />
          <Legend />
          {dataKeys.map((dataKey) => (
            <Bar
              key={dataKey.key}
              dataKey={dataKey.key}
              name={dataKey.name}
              fill={dataKey.color}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="p-5 animate-fade-in glass-card shadow-sm">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      {renderChart()}
    </Card>
  );
};

export default DataChart;
