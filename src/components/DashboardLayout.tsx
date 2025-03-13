import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { Activity, Map, FileText, Menu, X, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "../assets/images/logo.png";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout = ({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Visão Geral", icon: Home },
    { path: "/estados", label: "Estados", icon: Map },
    { path: "/paises", label: "Países", icon: Activity },
    { path: "/formulario", label: "Formulário", icon: FileText },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileMenu}
          className="rounded-full w-14 h-10"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <aside
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-xl z-40 transition-all duration-300 md:relative md:translate-x-0 md:min-h-screen md:border-r md:w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col p-6 h-full">
          <div className="flex items-center mb-8 space-x-2">
            <img width={50} src={logo} alt="" />
            <h1 className="text-[18px] font-semibold">Dados COVID-19</h1>
          </div>

          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (isMobileMenuOpen) {
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  )
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="border-t pt-6 mt-6">
            <ThemeToggle />
            <div className="text-xs text-muted-foreground mt-4">
              Dados fornecidos por:
              <div className="font-medium mt-1">COVID-19 Brazil API</div>
            </div>
          </div>
        </div>
      </aside>

      <main
        className={cn(
          "flex-1 p-4 pt-16 md:p-8 md:pt-8 transition-all duration-300",
          isMobileMenuOpen && "brightness-50 md:brightness-100"
        )}
      >
        <header className="mb-8 staggered-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </header>

        <div className="staggered-fade-in">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
