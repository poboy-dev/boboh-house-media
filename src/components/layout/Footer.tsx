import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <p className="text-foreground/80">
              Découvrez notre plateforme innovante pour partager et explorer du contenu passionnant.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-foreground/80 hover:text-foreground">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/posts" className="text-foreground/80 hover:text-foreground">
                  Posts
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-foreground/80 hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-foreground/80">
              Email: contact@monsite.com<br />
              Téléphone: (123) 456-7890
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-foreground/60">
          <p>&copy; {new Date().getFullYear()} MonSite. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};