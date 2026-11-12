import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { insightsData, insightCategories } from '../data/insightsData';
import { 
  Search, 
  ArrowRight, 
  Calendar, 
  Clock, 
  User, 
  Sparkles, 
  Tag, 
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';

export default function InsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Insights');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = insightsData.filter((article) => {
    const matchesCategory = selectedCategory === 'All Insights' || article.category === selectedCategory;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = insightsData.find(a => a.featured) || insightsData[0];

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Executive Knowledge Platform"
        title="Insights, Whitepapers &amp; Architectural Briefings"
        subtitle="In-depth analysis of sovereign artificial intelligence, legacy public system modernization, zero-trust cybersecurity, and enterprise cloud economics."
        bgImage="/insight.png"
        breadcrumbs={[
          { label: 'Insights' }
        ]}
        primaryCtaText="Discuss An Enterprise Project"
        primaryCtaLink="/request-project"
      />

      {/* Featured Headline Article Banner */}
      {featuredArticle && (
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 rounded-2xl text-white border border-slate-800 shadow-xl overflow-hidden group grid grid-cols-1 lg:grid-cols-12 items-center card-hover-insight-featured">
              <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                    FEATURED BRIEFING
                  </span>
                  <span className="text-xs text-indigo-300 font-mono">{featuredArticle.category}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-mono">{featuredArticle.readTime}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-serif font-normal text-white leading-tight group-hover:text-indigo-200 transition-colors">
                  <Link to={`/insights/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h2>

                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  {featuredArticle.excerpt}
                </p>

                <div className="pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">{featuredArticle.author.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{featuredArticle.author.role}</div>
                    </div>
                  </div>

                  <Link
                    to={`/insights/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <span>Read Briefing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden min-h-[260px]">
                <img
                  src={featuredArticle.coverImage}
                  alt={`${featuredArticle.title} - A8Fusion Executive Research Whitepaper`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent hidden lg:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:hidden"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Search Navigation Bar */}
      <section className="py-8 bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              {insightCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0B172A] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles &amp; topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Listing Grid */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <p className="text-base font-serif text-slate-700">No matching articles found.</p>
              <button
                type="button"
                onClick={() => { setSelectedCategory('All Insights'); setSearchQuery(''); }}
                className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Reset Filters &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl border border-slate-200 card-hover-article-card flex flex-col justify-between group overflow-hidden"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={article.coverImage}
                        alt={`${article.title} - A8Fusion Research Briefing`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-white font-mono">
                        <span className="bg-indigo-600/90 text-white font-bold uppercase px-2 py-0.5 rounded text-[10px]">
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1 drop-shadow">
                          <Clock className="w-3 h-3 text-indigo-300" />
                          <span>{article.readTime}</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                        <Link to={`/insights/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                        {article.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {article.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 mt-2 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block">{article.author.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{article.publishedAt}</span>
                      </div>
                    </div>

                    <Link
                      to={`/insights/${article.slug}`}
                      className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

