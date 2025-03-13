import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllStates, fetchStateData, StateData } from "@/services/covidApi";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const States = () => {
  const [selectedState, setSelectedState] = useState<string>("");

  const { data: allStates, isLoading: isLoadingAllStates } = useQuery({
    queryKey: ["states"],
    queryFn: fetchAllStates,
  });

  const { data: stateData, isLoading: isLoadingStateData } = useQuery({
    queryKey: ["state", selectedState],
    queryFn: () => fetchStateData(selectedState),
    enabled: !!selectedState,
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
      header: "Estado",
      accessorKey: "state" as keyof StateData,
    },
    {
      header: "UF",
      accessorKey: "uf" as keyof StateData,
    },
    {
      header: "Casos",
      accessorKey: "cases" as keyof StateData,
      cell: (item: StateData) => (
        <span className="font-medium">{item.cases.toLocaleString()}</span>
      ),
    },
    {
      header: "Óbitos",
      accessorKey: "deaths" as keyof StateData,
      cell: (item: StateData) => (
        <span className="text-red-500 font-medium">
          {item.deaths.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Suspeitos",
      accessorKey: "suspects" as keyof StateData,
      cell: (item: StateData) => (
        <span>{item.suspects ? item.suspects.toLocaleString() : "N/A"}</span>
      ),
    },
    {
      header: "Data Atualização",
      accessorKey: "datetime" as keyof StateData,
      cell: (item: StateData) => <span>{formatDate(item.datetime)}</span>,
    },
  ];

  return (
    <DashboardLayout
      title="Dados por Estado"
      subtitle="Visualize os dados detalhados por estado"
    >
      <div className="mb-8">
        <div className="glass-card  rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Selecione um estado</h3>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Selecione um estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todos os estados</SelectItem>
              {allStates?.map((state) => (
                <SelectItem key={state.uid} value={state.uf}>
                  {state.state} ({state.uf})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedState && selectedState !== "_all" && stateData ? (
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Casos Confirmados"
              value={stateData.cases}
              isLoading={isLoadingStateData}
              className="border-l-4 border-blue-500"
            />
            <StatCard
              title="Óbitos"
              value={stateData.deaths}
              isLoading={isLoadingStateData}
              className="border-l-4 border-red-500"
            />
            <StatCard
              title="Casos Suspeitos"
              value={stateData.suspects || 0}
              isLoading={isLoadingStateData}
              className="border-l-4 border-yellow-500"
            />
            <StatCard
              title="Casos Descartados"
              value={stateData.refuses || 0}
              isLoading={isLoadingStateData}
              className="border-l-4 border-green-500"
            />
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            Última atualização:{" "}
            {stateData.datetime ? formatDate(stateData.datetime) : "N/A"}
          </div>
        </div>
      ) : null}

      <DataTable
        data={
          selectedState === "_all"
            ? allStates || []
            : stateData
            ? [stateData]
            : []
        }
        columns={columns}
        isLoading={
          isLoadingAllStates || (selectedState !== "_all" && isLoadingStateData)
        }
        searchKey="state"
        title={
          selectedState === "_all"
            ? "Todos os Estados"
            : `Dados de ${
                allStates?.find((s) => s.uf === selectedState)?.state ||
                selectedState
              }`
        }
      />
    </DashboardLayout>
  );
};

export default States;
