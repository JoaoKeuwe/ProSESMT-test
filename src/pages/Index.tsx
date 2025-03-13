import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllStates } from "@/services/covidApi";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import DataChart from "@/components/DataChart";
import { Activity, AlertTriangle, Heart } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { data: statesData, isLoading } = useQuery({
    queryKey: ["states"],
    queryFn: fetchAllStates,
  });

  const [totals, setTotals] = useState({
    cases: 0,
    deaths: 0,
    suspects: 0,
    refuses: 0,
  });

  useEffect(() => {
    if (statesData && statesData.length > 0) {
      const calculatedTotals = statesData.reduce(
        (acc, state) => {
          return {
            cases: acc.cases + state.cases,
            deaths: acc.deaths + state.deaths,
            suspects: acc.suspects + (state.suspects || 0),
            refuses: acc.refuses + (state.refuses || 0),
          };
        },
        { cases: 0, deaths: 0, suspects: 0, refuses: 0 }
      );

      setTotals(calculatedTotals);
    }
  }, [statesData]);

  const chartData = statesData
    ? statesData
        .sort((a, b) => b.cases - a.cases)
        .slice(0, 10)
        .map((state) => ({
          state: state.state,
          cases: state.cases,
          deaths: state.deaths,
        }))
    : [];

  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy");

  return (
    <DashboardLayout
      title="Dashboard COVID-19"
      subtitle={`Dados atualizados em ${currentDate}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Casos Confirmados"
          value={totals.cases}
          isLoading={isLoading}
          className="border-l-4 border-blue-500"
        />
        <StatCard
          title="Óbitos"
          value={totals.deaths}
          isLoading={isLoading}
          className="border-l-4 border-red-500"
        />
        <StatCard
          title="Casos Suspeitos"
          value={totals.suspects}
          isLoading={isLoading}
          className="border-l-4 border-yellow-500"
        />
        <StatCard
          title="Casos Descartados"
          value={totals.refuses}
          isLoading={isLoading}
          className="border-l-4 border-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DataChart
          title="Top 10 Estados - Casos Confirmados"
          data={chartData}
          type="bar"
          dataKeys={[{ key: "cases", name: "Casos", color: "#3b82f6" }]}
          xAxisKey="state"
          isLoading={isLoading}
        />
        <DataChart
          title="Top 10 Estados - Óbitos"
          data={chartData}
          type="bar"
          dataKeys={[{ key: "deaths", name: "Óbitos", color: "#ef4444" }]}
          xAxisKey="state"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center md:justify-between gap-6 animate-fade-in">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">COVID-19 no Brasil</h3>
            <p className="text-muted-foreground mb-4">
              Os dados apresentados neste dashboard são provenientes da API
              pública COVID-19 Brazil. Esta plataforma visa fornecer informações
              atualizadas sobre a situação da pandemia no Brasil.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-blue-500"></div>
                <span className="text-sm">Casos Confirmados</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-red-500"></div>
                <span className="text-sm">Óbitos</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Casos Suspeitos</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                <span className="text-sm">Casos Descartados</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-3 text-center">
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
              <Activity className="h-6 w-6 text-blue-500 mb-1" />
              <span className="text-xs font-medium text-blue-700">
                Monitoramento
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-500 mb-1" />
              <span className="text-xs font-medium text-red-700">
                Prevenção
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
              <Heart className="h-6 w-6 text-green-500 mb-1" />
              <span className="text-xs font-medium text-green-700">Saúde</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
