import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitFormData, FormData } from "@/services/covidApi";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Form validation schema
const formSchema = z.object({
  state: z.string().min(2, "Estado é obrigatório"),
  cases: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
  confirmed: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
  deaths: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
  recovered: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
  date: z.date({
    required_error: "Data é obrigatória",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CovidForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: "",
      cases: 0,
      confirmed: 0,
      deaths: 0,
      recovered: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const formattedData: FormData = {
        state: values.state,
        cases: values.cases,
        confirmed: values.confirmed,
        deaths: values.deaths,
        recovered: values.recovered,
        date: format(values.date, "yyyy-MM-dd"),
      };

      const result = await submitFormData(formattedData);

      setSubmittedData(result.data);

      setShowResult(true);

      toast.success("Dados enviados com sucesso!");

      form.reset();
    } catch (error) {
      toast.error("Erro ao enviar dados. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Formulário de Dados"
      subtitle="Cadastre novos dados sobre COVID-19"
    >
      <Card className="glass-card shadow-sm animate-fade-in">
        <CardHeader>
          <CardTitle>Cadastro de Dados COVID-19</CardTitle>
          <CardDescription>
            Preencha o formulário com os dados sobre COVID-19 para um estado
            específico.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: São Paulo" {...field} />
                      </FormControl>
                      <FormDescription>Nome do estado.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd 'de' MMMM 'de' yyyy", {
                                  locale: ptBR,
                                })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={ptBR}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Data da coleta dos dados.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {["cases", "confirmed", "deaths", "recovered"].map(
                  (fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={
                        fieldName as
                          | "cases"
                          | "confirmed"
                          | "deaths"
                          | "recovered"
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {fieldName === "cases"
                              ? "Casos"
                              : fieldName === "confirmed"
                              ? "Confirmados"
                              : fieldName === "deaths"
                              ? "Óbitos"
                              : "Recuperados"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Dados"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dados Enviados</DialogTitle>
            <DialogDescription>
              Os dados foram enviados com sucesso. Abaixo está o JSON que seria
              enviado para a API:
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted rounded-md p-4 overflow-auto max-h-[400px]">
            <pre className="text-sm">
              {submittedData ? JSON.stringify(submittedData, null, 2) : ""}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CovidForm;
