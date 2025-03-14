import { vi, beforeEach, afterEach } from "vitest";

const mockUseQuery = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQuery: (options) => mockUseQuery(options),
}));

vi.mock("@/services/covidApi", () => ({
  fetchCountries: vi.fn(),
}));

vi.mock("@/components/DashboardLayout", () => ({
  default: ({ children, title, subtitle }) => (
    <div data-testid="mock-dashboard-layout">
      <h1 data-testid="dashboard-title">{title}</h1>
      <p data-testid="dashboard-subtitle">{subtitle}</p>
      {children}
    </div>
  ),
}));

vi.mock("@/components/DataTable", () => ({
  default: ({ data, columns, isLoading, searchKey, title }) => (
    <div data-testid="mock-data-table">
      <h2 data-testid="table-title">{title}</h2>
      <div data-testid="table-data">{JSON.stringify(data)}</div>
      <div data-testid="table-loading">{isLoading.toString()}</div>
    </div>
  ),
}));

vi.mock("@/components/DataChart", () => ({
  default: ({ data, title, type, dataKeys, xAxisKey, isLoading }) => (
    <div data-testid="mock-data-chart">
      <h2 data-testid="chart-title">{title}</h2>
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-type">{type}</div>
      <div data-testid="chart-loading">{isLoading.toString()}</div>
    </div>
  ),
}));

vi.mock("date-fns", () => ({
  format: vi.fn().mockReturnValue("20 de maio de 2023, 14:30"),
  parseISO: vi.fn().mockReturnValue(new Date("2023-05-20T14:30:00.000Z")),
}));

vi.mock("date-fns/locale", () => ({
  ptBR: {},
}));

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Countries from "@/pages/Countries";
import { CountryData } from "@/services/covidApi";

describe("Countries", () => {
  const mockCountriesData: CountryData[] = [
    {
      country: "Brazil",
      cases: 1000,
      confirmed: 1100,
      deaths: 50,
      recovered: 800,
      updated_at: "2023-05-20T14:30:00.000Z",
    },
    {
      country: "USA",
      cases: 2000,
      confirmed: 2100,
      deaths: 100,
      recovered: 1500,
      updated_at: "2023-05-20T15:30:00.000Z",
    },
    {
      country: "India",
      cases: 1500,
      confirmed: 1600,
      deaths: 75,
      recovered: 1200,
      updated_at: "2023-05-20T16:30:00.000Z",
    },
  ];

  beforeEach(() => {
    mockUseQuery.mockReturnValue({
      data: mockCountriesData,
      isLoading: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dashboard layout with correct title and subtitle", () => {
    render(<Countries />);

    expect(screen.getByTestId("dashboard-title")).toHaveTextContent(
      "Dados Globais"
    );
    expect(screen.getByTestId("dashboard-subtitle")).toHaveTextContent(
      "Visualize os dados da COVID-19 em diversos países"
    );
  });

  it("renders the data chart with correct props", () => {
    render(<Countries />);

    expect(screen.getByTestId("chart-title")).toHaveTextContent(
      "Top 10 Países - Óbitos"
    );
    expect(screen.getByTestId("chart-type")).toHaveTextContent("bar");

    const chartData = JSON.parse(
      screen.getByTestId("chart-data").textContent || "[]"
    );
    expect(chartData).toHaveLength(3);
    expect(chartData[0].country).toBe("USA");
    expect(chartData[0].deaths).toBe(100);
  });

  it("renders the data table with correct title", () => {
    render(<Countries />);

    expect(screen.getByTestId("table-title")).toHaveTextContent(
      "Todos os Países"
    );

    const tableData = JSON.parse(
      screen.getByTestId("table-data").textContent || "[]"
    );
    expect(tableData).toEqual(mockCountriesData);
  });

  it("sorts and filters countries for the chart data", () => {
    render(<Countries />);

    const chartData = JSON.parse(
      screen.getByTestId("chart-data").textContent || "[]"
    );

    expect(chartData).toHaveLength(3);

    expect(chartData[0].deaths).toBeGreaterThanOrEqual(chartData[1].deaths);
    expect(chartData[1].deaths).toBeGreaterThanOrEqual(chartData[2].deaths);
  });

  it("handles loading state correctly", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<Countries />);

    expect(screen.getByTestId("chart-loading").textContent).toBe("true");
    expect(screen.getByTestId("table-loading").textContent).toBe("true");

    const chartData = JSON.parse(
      screen.getByTestId("chart-data").textContent || "[]"
    );
    expect(chartData).toHaveLength(0);
  });
});
