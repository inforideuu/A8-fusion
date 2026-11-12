import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { insightsData } from '../data/insightsData';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Check, 
  Copy, 
  ArrowRight,
  ShieldCheck,
  Bookmark
} from 'lucide-react';

export default function InsightDetailPage() {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const article = insightsData.find(a => a.slug === slug);

  if (!article) {
    return <Navigate to="/insights" replace />;
  }

  const relatedArticles = insightsData.filter(a => a.id !== article.id).slice(0, 2);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge={article.category}
        title={article.title}
        subtitle={article.excerpt}
        bgImage="/insight.png"
        breadcrumbs={[
          { label: 'Insights', link: '/insights' },
          { label: article.category, link: '/insights' },
          { label: 'Briefing' }
        ]}
        primaryCtaText="Discuss With Authoring Team"
        primaryCtaLink="/request-project"
        secondaryCtaText="All Insights"
        secondaryCtaLink="/insights"
      />

      {/* Article Content Core */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Metadata & Author Bar */}
          <div className="flex flex-wrap items-center justify-between pb-8 mb-8 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-sm"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{article.author.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.publishedAt}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                aria-label="Copy article link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Article Prose Body */}
          <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed font-sans text-sm sm:text-base space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 border-l-4 border-indigo-600 my-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                Executive Takeaway
              </span>
              <p className="text-sm font-serif italic text-slate-700">
                "{article.excerpt}"
              </p>
            </div>

            {/* Split paragraphs and render */}
            {article.content.trim().split('\n\n').map((block, idx) => {
              if (block.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-2xl font-serif font-bold text-slate-900 pt-6 pb-2">
                    {block.replace('### ', '')}
                  </h3>
                );
              }
              if (block.startsWith('- ') || block.startsWith('1. ')) {
                return (
                  <div key={idx} className="pl-4 py-2 border-l border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700">
                    {block.split('\n').map((line, lidx) => (
                      <p key={lidx}>{line}</p>
                    ))}
                  </div>
                );
              }
              return (
                <p key={idx} className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {block}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="pt-10 mt-10 border-t border-slate-200">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 block mb-2">
              Topic Taxonomy
            </span>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, i) => (
                <span key={i} className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Briefings */}
      <section className="py-16 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-slate-900">
              Related Executive Briefings
            </h3>
            <Link to="/insights" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              View All Insights &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => (
              <div key={rel.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">{rel.category}</span>
                <h4 className="text-base font-serif font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                  <Link to={`/insights/${rel.slug}`}>{rel.title}</Link>
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">{rel.excerpt}</p>
                <Link to={`/insights/${rel.slug}`} className="text-xs font-bold text-indigo-600 flex items-center gap-1 pt-2">
                  <span>Read Briefing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
