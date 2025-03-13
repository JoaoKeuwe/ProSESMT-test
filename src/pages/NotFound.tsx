import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="glass-card rounded-2xl p-10 shadow-sm max-w-md w-full text-center animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-foreground mb-6">Página não encontrada</p>

        <Button asChild className="w-full">
          <Link to="/">Voltar para a home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
