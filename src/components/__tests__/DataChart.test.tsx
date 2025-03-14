import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DataChart from "../DataChart";

const mockData = [
  { country: "USA", cases: 1000, deaths: 50 },
  { country: "Brazil", cases: 800, deaths: 40 },
  { country: "India", cases: 700, deaths: 30 },
];

vi.mock("@/hooks/use-theme", () => ({
  useTheme: () => ({ theme: "light" }),
}));

vi.mock("recharts", () => {
  return {
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-responsive-container">{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-line-chart">{children}</div>
    ),
    BarChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-bar-chart">{children}</div>
    ),
    Line: ({ dataKey }: { dataKey: string }) => (
      <div data-testid={`mock-line-${dataKey}`}></div>
    ),
    Bar: ({ dataKey }: { dataKey: string }) => (
      <div data-testid={`mock-bar-${dataKey}`}></div>
    ),
    XAxis: () => <div data-testid="mock-x-axis"></div>,
    YAxis: () => <div data-testid="mock-y-axis"></div>,
    CartesianGrid: () => <div data-testid="mock-cartesian-grid"></div>,
    Tooltip: () => <div data-testid="mock-tooltip"></div>,
    Legend: () => <div data-testid="mock-legend"></div>,
  };
});

describe("DataChart", () => {
  it("renders chart title correctly", () => {
    render(
      <DataChart
        data={mockData}
        title="Test Chart"
        dataKeys={[{ key: "cases", name: "Cases", color: "#0088FE" }]}
        xAxisKey="country"
      />
    );

    expect(screen.getByText("Test Chart")).toBeInTheDocument();
  });

  it("renders loading state when isLoading is true", () => {
    render(
      <DataChart
        data={[]}
        title="Loading Chart"
        dataKeys={[{ key: "cases", name: "Cases", color: "#0088FE" }]}
        xAxisKey="country"
        isLoading={true}
      />
    );

    expect(screen.getByText("Loading Chart")).toBeInTheDocument();
    const loadingElement = document.querySelector(".animate-pulse");
    expect(loadingElement).toBeInTheDocument();
  });

  it("renders line chart by default", () => {
    render(
      <DataChart
        data={mockData}
        title="Line Chart"
        dataKeys={[{ key: "cases", name: "Cases", color: "#0088FE" }]}
        xAxisKey="country"
      />
    );

    expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("mock-line-cases")).toBeInTheDocument();
  });

  it("renders bar chart when type is set to bar", () => {
    render(
      <DataChart
        data={mockData}
        title="Bar Chart"
        type="bar"
        dataKeys={[{ key: "cases", name: "Cases", color: "#0088FE" }]}
        xAxisKey="country"
      />
    );

    expect(screen.getByTestId("mock-bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("mock-bar-cases")).toBeInTheDocument();
  });

  it("renders multiple data keys correctly", () => {
    render(
      <DataChart
        data={mockData}
        title="Multiple Data Keys Chart"
        dataKeys={[
          { key: "cases", name: "Cases", color: "#0088FE" },
          { key: "deaths", name: "Deaths", color: "#FF8042" },
        ]}
        xAxisKey="country"
      />
    );

    expect(screen.getByText("Multiple Data Keys Chart")).toBeInTheDocument();
    expect(screen.getByTestId("mock-line-cases")).toBeInTheDocument();
    expect(screen.getByTestId("mock-line-deaths")).toBeInTheDocument();
  });

  it("handles empty data gracefully", () => {
    render(
      <DataChart
        data={[]}
        title="Empty Data Chart"
        dataKeys={[{ key: "cases", name: "Cases", color: "#0088FE" }]}
        xAxisKey="country"
        isLoading={false}
      />
    );

    expect(screen.getByText("Empty Data Chart")).toBeInTheDocument();
    expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
  });

  it("renders tooltip and legend components", () => {
    render(
      <DataChart
        data={mockData}
        title="Chart with Components"
        dataKeys={[{ key: "cases", name: "Cases", color: "#0088FE" }]}
        xAxisKey="country"
      />
    );

    expect(screen.getByTestId("mock-tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("mock-legend")).toBeInTheDocument();
  });
});
