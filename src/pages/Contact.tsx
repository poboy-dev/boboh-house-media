import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
        <p className="text-lg text-gray-600">
          Parlons de votre projet et voyons comment nous pouvons collaborer ensemble.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <Input type="text" placeholder="Votre nom" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input type="email" placeholder="votre@email.com" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <Input type="text" placeholder="Sujet de votre message" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea 
                  placeholder="Votre message"
                  className="min-h-[150px]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E74C3C] text-white py-3 px-4 rounded hover:bg-[#c0392b] transition-colors"
              >
                Envoyer le message
              </button>
            </form>
          </Card>

          <div className="space-y-8">
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="text-[#E74C3C] text-2xl">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Adresse</h3>
                  <p className="text-gray-600">123 Avenue des Arts<br/>75001 Paris, France</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="text-[#E74C3C] text-2xl">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Téléphone</h3>
                  <p className="text-gray-600">+237 672 160 068</p>
                  <p className="text-gray-600">+237 621 126 792</p>
                  <p className="text-gray-600">+237 658 381 015</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="text-[#E74C3C] text-2xl">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">bobohhousemedia@gmail.com</p>
                </div>
              </div>
            </Card>

            <div className="flex justify-center space-x-6">
              <a 
                href="https://www.facebook.com/profile.php?id=100085548302186" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E74C3C] hover:text-[#c0392b] transition-colors"
              >
                <Facebook size={32} />
              </a>
              <a 
                href="https://www.instagram.com/bobohhousemedia" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E74C3C] hover:text-[#c0392b] transition-colors"
              >
                <Instagram size={32} />
              </a>
              <a 
                href="https://www.youtube.com/@BobohhouseMedia" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E74C3C] hover:text-[#c0392b] transition-colors"
              >
                <Youtube size={32} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 h-[400px] rounded-lg overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9914406081493!2d2.3315192159717584!3d48.86380007928757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e18a5f84801%3A0x6eb5daa624bce714!2sPlace%20Vend%C3%B4me%2C%2075001%20Paris!5e0!3m2!1sfr!2sfr!4v1645541248693!5m2!1sfr!2sfr"
            width="100%" 
            height="100%" 
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;