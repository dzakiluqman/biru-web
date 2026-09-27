'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PortfolioItem } from '@/types/database';
import { Eye, ExternalLink, X, ArrowUpRight, Sparkles, Layers, Filter } from 'lucide-react';

interface PortfolioPageClientProps {
  locale: string;
  initialPortfolio: PortfolioItem[];
}

export default function PortfolioPageClient({ locale, initialPortfolio }: PortfolioPageClientProps) {
  const t = useTranslations('portfolio');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(initialPortfolio.map((p) => p.category)));
    return ['ALL', ...cats];
  }, [initialPortfolio]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'ALL') return initialPortfolio;
    return initialPortfolio.filter((p) => p.category === selectedCategory);
  }, [initialPortfolio, selectedCategory]);

  return (
    <div className="pt-32 pb-24 bg-white relative overflow-hidden">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('badge')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? t('filters.all') : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
            {t('empty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const description = locale === 'en' ? project.description_en : project.description_id;

              return (
                <div
                  key={project.id}
                  className="group relative rounded-2xl bg-white border border-slate-200 hover:border-blue-400 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="h-52 w-full relative overflow-hidden bg-slate-100">
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 left-4 z-10">
                      <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/95 text-blue-700 shadow-sm border border-slate-200 backdrop-blur-md">
                        {project.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h3 className="text-xl font-bold text-white drop-shadow-sm">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal line-clamp-3">
                        {description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      {project.live_url ? (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{t('liveProject')}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Bespoke System</span>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Pratinjau</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Preview */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="relative h-48 w-full bg-slate-900 flex items-end p-6">
              <Image
                src={selectedProject.image_url}
                alt={selectedProject.title}
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="relative z-10">
                <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {selectedProject.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Ringkasan Solusi
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {locale === 'en' ? selectedProject.description_en : selectedProject.description_id}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Teknologi yang Digunakan</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Tutup Pratinjau
              </button>

              <Link
                href={`/${locale}/contact?service=${encodeURIComponent(selectedProject.title)}`}
                prefetch={true}
                onClick={() => setSelectedProject(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20"
              >
                <span>Konsultasikan Proyek Serupa</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
