import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

interface DepartmentCardProps {
  title: string;
  description: string;
  metrics?: { label: string; value: string | number }[];
  status?: "active" | "inactive";
}

export function DepartmentCard({ title, description, metrics, status = "active" }: DepartmentCardProps) {
  return (
    <Card className="department-card group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <Badge 
          variant={status === "active" ? "default" : "secondary"}
          className="ml-2"
        >
          {status === "active" ? "Ativo" : "Inativo"}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        {metrics && (
          <div className="grid gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.label}</span>
                <span className="text-sm text-muted-foreground">{metric.value}</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center text-accent hover:text-accent/80 transition-colors cursor-pointer">
          <span className="text-sm font-medium">Ver detalhes</span>
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}