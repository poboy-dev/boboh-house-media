
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ArticlesSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const ArticlesSearchBar = ({ searchTerm, onSearchChange }: ArticlesSearchBarProps) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    <Input
      placeholder="Rechercher un article..."
      value={searchTerm}
      onChange={e => onSearchChange(e.target.value)}
      className="pl-10"
    />
  </div>
);
