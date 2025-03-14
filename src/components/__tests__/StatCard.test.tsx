import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatCard from "../StatCard";

describe("StatCard", () => {
  it("renders the title correctly", () => {
    render(<StatCard title="Total Cases" value={1000} />);
    expect(screen.getByText("Total Cases")).toBeInTheDocument();
  });

  it("renders the value correctly", () => {
    render(<StatCard title="Total Cases" value={1000} />);
    // Use a regex to match the formatted number regardless of locale (1,000 or 1.000)
    const valueElement = screen.getByText(/1[,.]000/);
    expect(valueElement).toBeInTheDocument();
  });

  it("renders the value with custom format function", () => {
    const formatFn = (value: number) => `${value}%`;
    render(<StatCard title="Percentage" value={75} formatFn={formatFn} />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("renders loading state correctly", () => {
    render(<StatCard title="Loading" value={0} isLoading={true} />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(document.querySelector(".loading-shimmer")).toBeInTheDocument();
  });
});
