import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  productName: string;
}

export const Breadcrumb = ({ productName }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm font-body">
        <li>
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-bronze transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only md:not-sr-only">Home</span>
          </Link>
        </li>
        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        <li>
          <Link 
            to="/#collection" 
            className="text-muted-foreground hover:text-bronze transition-colors"
          >
            Collection
          </Link>
        </li>
        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        <li>
          <span className="text-foreground font-medium">{productName}</span>
        </li>
      </ol>
    </nav>
  );
};
