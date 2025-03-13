
import { useQuery } from "@tanstack/react-query";
import { fetchCountries, CountryData } from "@/services/covidApi";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import DataChart from "@/components/DataChart";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const Countries = () => {
  const { data: countries = [], isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", {
        locale: ptBR,
      });
    } catch (error) {
      return dateString;
    }
  };

  const columns = [
    {
      header: "País",
      accessorKey: "country" as keyof CountryData,
    },
    {
      header: "Casos",
      accessorKey: "cases" as keyof CountryData,
      cell: (item: CountryData) => (
        <span className="font-medium">
          {item.cases?.toLocaleString() || "N/A"}
        </span>
      ),
    },
    {
      header: "Confirmados",
      accessorKey: "confirmed" as keyof CountryData,
      cell: (item: CountryData) => (
        <span className="font-medium">
          {item.confirmed?.toLocaleString() || "N/A"}
        </span>
      ),
    },
    {
      header: "Óbitos",
      accessorKey: "deaths" as keyof CountryData,
      cell: (item: CountryData) => (
        <span className="text-red-500 font-medium">
          {item.deaths?.toLocaleString() || "N/A"}
        </span>
      ),
    },
    {
      header: "Recuperados",
      accessorKey: "recovered" as keyof CountryData,
      cell: (item: CountryData) => (
        <span className="text-green-500 font-medium">
          {item.recovered?.toLocaleString() || "N/A"}
        </span>
      ),
    },
    {
      header: "Atualização",
      accessorKey: "updated_at" as keyof CountryData,
      cell: (item: CountryData) => (
        <span>{item.updated_at ? formatDate(item.updated_at) : "N/A"}</span>
      ),
    },
  ];

  const chartData = countries
    ? countries
        .filter(
          (country) => country?.deaths !== undefined && country?.deaths !== null
        )
        .sort((a, b) => (b.deaths || 0) - (a.deaths || 0))
        .slice(0, 10)
        .map((country) => ({
          country: country.country || "Unknown",
          cases: Number(country.cases) || 0,
          deaths: Number(country.deaths) || 0,
          recovered: Number(country.recovered) || 0,
        }))
    : [];

  return (
    <DashboardLayout
      title="Dados Globais"
      subtitle="Visualize os dados da COVID-19 em diversos países"
    >
      <div className="grid grid-cols-1 gap-6 mb-8">
        <DataChart
          title="Top 10 Países - Óbitos"
          data={chartData}
          type="bar"
          dataKeys={[{ key: "deaths", name: "Óbitos", color: "#ef4444" }]}
          xAxisKey="country"
          isLoading={isLoading}
        />
      </div>

      <DataTable
        data={countries}
        columns={columns}
        isLoading={isLoading}
        searchKey="country"
        title="Todos os Países"
      />
    </DashboardLayout>
  );
};

export default Countries;
