import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";

const contactInfo = [
  {
    icon: MapPin,
    title: "Adresse",
    content: ["Cameroun"],
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Phone,
    title: "Téléphone",
    content: ["+237 672 160 068", "+237 621 126 792", "+237 658 381 015"],
    gradient: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
  },
  {
    icon: Mail,
    title: "Email",
    content: ["bobohhousemedia@gmail.com"],
    gradient: "from-primary/20 to-secondary/5",
    iconColor: "text-primary",
  },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/profile.php?id=100085548302186",
    icon: Facebook,
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/bobohhousemedia",
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: "https://www.youtube.com/@BobohhouseMedia",
    icon: Youtube,
    label: "YouTube",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Banner */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 font-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Contactez-nous
          </motion.h1>
          <motion.p
            className="text-lg text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Parlons de votre projet et voyons comment nous pouvons collaborer ensemble.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold mb-6 font-heading">Envoyez-nous un message</h2>
                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nom
                    </label>
                    <Input
                      type="text"
                      placeholder="Votre nom"
                      required
                      className="rounded-xl border-border/50 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      required
                      className="rounded-xl border-border/50 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Sujet
                    </label>
                    <Input
                      type="text"
                      placeholder="Sujet de votre message"
                      required
                      className="rounded-xl border-border/50 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <Textarea
                      placeholder="Votre message"
                      className="min-h-[150px] rounded-xl border-border/50 focus:border-primary"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-secondary text-white py-3.5 px-6 rounded-xl hover:bg-secondary/90 transition-all duration-300 flex items-center justify-center gap-2 font-medium group shadow-lg hover:shadow-secondary/25"
                  >
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    Envoyer le message
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="glass-card p-6 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center flex-shrink-0`}>
                      <info.icon className={`w-5 h-5 ${info.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 font-heading">{info.title}</h3>
                      {info.content.map((line, i) => (
                        <p key={i} className="text-muted-foreground text-sm">{line}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Social Links */}
              <motion.div
                className="flex justify-center gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Map */}
          <motion.div
            className="mt-16 rounded-2xl overflow-hidden shadow-lg h-[400px]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9914406081493!2d2.3315192159717584!3d48.86380007928757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e18a5f84801%3A0x6eb5daa624bce714!2sPlace%20Vend%C3%B4me%2C%2075001%20Paris!5e0!3m2!1sfr!2sfr!4v1645541248693!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;