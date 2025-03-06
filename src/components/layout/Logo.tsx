
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="relative h-12 w-12">
        <img 
          src="/lovable-uploads/9dd19a98-c5f9-4586-8b7c-8fc156fc0a9f.png" 
          alt="BH Media Logo" 
          className="h-full w-full rounded-full object-contain"
          onError={(e) => {
            console.error('Logo failed to load:', e);
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      </div>
      <span className="text-white text-xl font-bold ml-3">BH Media</span>
    </Link>
  );
};
