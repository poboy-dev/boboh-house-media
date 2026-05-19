
import React from "react";
import { RecentArticleCard } from "./RecentArticleCard";
import { Article } from "@/types/article";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

interface RecentArticlesSectionProps {
  articles: Article[] | undefined;
  isLoading: boolean;
}

const containerVariants= {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants= {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export const RecentArticlesSection: React.FC<RecentArticlesSectionProps> = ({
  articles,
  isLoading
}) => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-secondary mb-3">
            <Newspaper className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Actualités</span>
          </div>
          <h2 className="font-heading">Articles Récents</h2>
          <div className="section-divider" />
        </motion.div>

        {isLoading ? (
          <div className="w-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {articles?.map((article) => (
              <motion.div key={article.id} variants={cardVariants}>
                <RecentArticleCard article={article} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
