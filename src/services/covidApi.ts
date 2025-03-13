import axios from "axios";
import { toast } from "sonner";

export interface StateData {
  uid: number;
  uf: string;
  state: string;
  cases: number;
  deaths: number;
  suspects: number;
  refuses: number;
  datetime: string;
}

export interface HistoricalData {
  date: string;
  cases: number;
  confirmed: number;
  deaths: number;
  recovered: number;
}

export interface CountryData {
  country: string;
  cases: number | null;
  confirmed: number | null;
  deaths: number | null;
  recovered: number | null;
  updated_at: string;
}

export interface FormData {
  state: string;
  cases: number;
  confirmed: number;
  deaths: number;
  recovered: number;
  date: string;
}

const API = axios.create({
  baseURL: "https://covid19-brazil-api.now.sh/api/report/v1",
  timeout: 10000,
});

const handleApiError = (error, message: string) => {
  console.error("API Error:", error);
  toast.error(message);
  return null;
};

const ensureNumber = (value): number => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 0;
  }
  return Number(value);
};

export const fetchAllStates = async (): Promise<StateData[]> => {
  try {
    const response = await API.get("");

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response data format");
    }

    return (response.data.data || []).map((state) => ({
      ...state,
      cases: ensureNumber(state.cases),
      deaths: ensureNumber(state.deaths),
      suspects: ensureNumber(state.suspects),
      refuses: ensureNumber(state.refuses),
    }));
  } catch (error) {
    handleApiError(error, "Falha ao buscar dados dos estados");
    return [];
  }
};

export const fetchStateData = async (uf: string): Promise<StateData | null> => {
  if (!uf || uf === "_all") return null;

  try {
    const response = await API.get(`/brazil/uf/${uf.toLowerCase()}`);

    if (!response.data) {
      throw new Error(`Failed to fetch data for ${uf}`);
    }

    const data = response.data;

    return {
      ...data,
      cases: ensureNumber(data.cases),
      deaths: ensureNumber(data.deaths),
      suspects: ensureNumber(data.suspects),
      refuses: ensureNumber(data.refuses),
    };
  } catch (error) {
    handleApiError(error, `Falha ao buscar dados para ${uf}`);
    return null;
  }
};

export const fetchBrazilByDate = async (
  date: string
): Promise<HistoricalData | null> => {
  if (!date) return null;

  const formattedDate = date.replace(/-/g, "");

  try {
    const response = await API.get(`/brazil/${formattedDate}`);

    if (!response.data || !response.data.data) {
      throw new Error(`Failed to fetch data for date ${date}`);
    }

    const data = response.data.data;

    return {
      ...data,
      cases: ensureNumber(data.cases),
      confirmed: ensureNumber(data.confirmed),
      deaths: ensureNumber(data.deaths),
      recovered: ensureNumber(data.recovered),
    };
  } catch (error) {
    handleApiError(error, `Falha ao buscar dados para a data ${date}`);
    return null;
  }
};

export const fetchCountries = async (): Promise<CountryData[]> => {
  try {
    const response = await API.get("/countries");

    if (!response.data || !response.data.data) {
      throw new Error("Failed to fetch countries data");
    }

    return response.data.data.map((country) => ({
      ...country,
      cases: ensureNumber(country.cases),
      confirmed: ensureNumber(country.confirmed),
      deaths: ensureNumber(country.deaths),
      recovered: ensureNumber(country.recovered),
    }));
  } catch (error) {
    handleApiError(error, "Falha ao buscar dados dos países");
    return [];
  }
};

export const submitFormData = (
  formData: FormData
): Promise<{ success: boolean; data: FormData }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Form data submitted:", formData);
      resolve({ success: true, data: formData });
    }, 800);
  });
};
