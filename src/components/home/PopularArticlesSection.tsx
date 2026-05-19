
import React from "react";
import { RecentArticleCard } from "./RecentArticleCard";
import { Article } from "@/types/article";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface PopularArticlesSectionProps {
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

export const PopularArticlesSection: React.FC<PopularArticlesSectionProps> = ({
  articles,
  isLoading,
}) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-primary mb-3">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Tendance</span>
          </div>
          <h2 className="font-heading">Posts Populaires</h2>
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
