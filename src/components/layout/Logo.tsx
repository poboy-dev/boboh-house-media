
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/BObohhouse media.webp" 
        alt="BobohHouse Media Logo" 
        className="h-12 w-12 rounded-full mr-3 object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.svg";
        }}
      />
      <span className="text-white text-xl font-bold">Boboh House Media</span>
    </Link>
  );
};
