
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="relative h-12 w-12">
        <img 
          src="/logo.webp" 
          alt="BobohHouse Media Logo" 
          className="h-full w-full rounded-full object-contain bg-white"
          onError={(e) => {
            console.error('Logo failed to load:', e);
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      </div>
      <span className="text-white text-xl font-bold ml-3">Boboh House Media</span>
    </Link>
  );
};
