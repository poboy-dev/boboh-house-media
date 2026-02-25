
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

type AuthView = "sign_in" | "sign_up";

const Auth = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<AuthView>("sign_in");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      navigate("/dashboard", { replace: true });
    }
    setIsLoading(false);
  }, [session, navigate]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
          toast.success("Connexion réussie");
        }, 500);
      } else if (event === "SIGNED_OUT") {
        navigate("/auth", { replace: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Vérifiez vos emails pour confirmer votre inscription");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session) return null;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden"
      style={{
        backgroundImage: "url('/african-hero-bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/85" />

      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-10 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glass card */}
        <div
          className="rounded-2xl p-8 border border-white/10"
          style={{
            background: "rgba(10, 10, 20, 0.70)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Logo / brand */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              BobohHouse Media
            </motion.div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 font-heading">
              {view === "sign_in" ? "Content de vous revoir" : "Créer un compte"}
            </h1>
            <p className="text-sm text-white/55">
              {view === "sign_in"
                ? "Connectez-vous pour accéder à votre espace"
                : "Remplissez le formulaire pour vous inscrire"}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 mb-7">
            {(["sign_in", "sign_up"] as AuthView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${view === v
                    ? "bg-primary text-black shadow-md"
                    : "text-white/60 hover:text-white/80"
                  }`}
              >
                {v === "sign_in" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={view}
              initial={{ opacity: 0, x: view === "sign_in" ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: view === "sign_in" ? 16 : -16 }}
              transition={{ duration: 0.25 }}
              onSubmit={view === "sign_in" ? handleSignIn : handleSignUp}
              className="space-y-4"
            >
              {/* Username – sign_up only */}
              {view === "sign_up" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                    Nom d&apos;utilisateur
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Votre nom d'utilisateur"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/40 transition-all"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/40 transition-all"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/40 transition-all"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3 rounded-xl font-semibold text-sm text-black flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, hsl(44,96%,52%), hsl(44,96%,42%))",
                }}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {view === "sign_in" ? "Se connecter" : "Créer mon compte"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-white/35">
            Les inscriptions sont gérées par les administrateurs.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
