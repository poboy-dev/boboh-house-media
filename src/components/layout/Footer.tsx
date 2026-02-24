import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-auto relative overflow-hidden">
      {/* Decorative gradient line at top */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Column */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4 text-white">Boboh House Media</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Né d'une passion pour la culture camerounaise et d'une vision audacieuse :
              promouvoir la culture et la consommation locale.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/profile.php?id=100085548302186"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-all duration-300 hover:scale-110"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/bobohhousemedia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-all duration-300 hover:scale-110"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.youtube.com/@BobohhouseMedia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-white">Liens Rapides</h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Accueil" },
                { to: "/about", label: "À Propos" },
                { to: "/services", label: "Services" },
                { to: "/portfolio", label: "Portfolio" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-primary transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-white">Nos Services</h3>
            <ul className="space-y-3">
              {[
                "Couverture Événementiel",
                "Communication",
                "Maître de Cérémonie",
                "Production Audiovisuelle",
              ].map((service) => (
                <li key={service}>
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <Phone size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p>+237 672 160 068</p>
                  <p>+237 621 126 792</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <Mail size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>bobohhousemedia@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Cameroun</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Boboh House Media. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Fait par <span className="text-primary"><a href="https://sparknest-chi.vercel.app/" target="_blank" rel="noopener noreferrer">SparkNest</a></span>
          </p>
        </div>
      </div>
    </footer>
  );
};