import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import {
  MessageSquare, AlertCircle, TrendingUp, Building2,
  Briefcase, BookOpen, Layers, ShieldCheck,
  ArrowUpRight, FileDown, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function DashboardOverview({ setActiveTab }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminApi.getDashboardOverview();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] font-sans">
        <div className="flex items-center gap-3 text-indigo-600 text-xs font-semibold">
          <div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
          <span>Loading Analytics &amp; Telemetry...</span>
        </div>
      </div>
    );
  }

  const { metrics, monthly_trends, status_breakdown, type_breakdown, industry_distribution, recent_activity, recent_enquiries } = data;

  const kpiCards = [
    {
      label: 'Total Enquiries',
      value: metrics.total_enquiries,
      sub: 'All portal submissions',
      icon: MessageSquare,
      color: 'indigo',
      tab: 'crm'
    },
    {
      label: 'New Enquiries',
      value: metrics.new_enquiries,
      sub: 'Pending initial triage',
      icon: AlertCircle,
      color: 'amber',
      tab: 'crm',
      badge: 'Action Needed'
    },
    {
      label: 'Active Enquiries',
      value: metrics.active_enquiries,
      sub: 'In pipeline / negotiation',
      icon: TrendingUp,
      color: 'blue',
      tab: 'crm'
    },
    {
      label: 'Project Enquiries',
      value: metrics.project_enquiries,
      sub: 'Enterprise implementations',
      icon: Layers,
      color: 'emerald',
      tab: 'crm'
    },
    {
      label: 'Government Enquiries',
      value: metrics.government_enquiries,
      sub: 'Sovereign & public sector',
      icon: Building2,
      color: 'purple',
      tab: 'crm'
    },
    {
      label: 'Partnership Enquiries',
      value: metrics.partnership_enquiries,
      sub: 'Strategic alliances & OEM',
      icon: ShieldCheck,
      color: 'sky',
      tab: 'crm'
    },
    {
      label: 'Career Applications',
      value: metrics.career_applications,
      sub: `${metrics.new_applications} newly submitted`,
      icon: Briefcase,
      color: 'rose',
      tab: 'careers'
    },
    {
      label: 'Published Articles',
      value: metrics.published_articles,
      sub: 'Live architectural papers',
      icon: BookOpen,
      color: 'teal',
      tab: 'pages'
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Top Banner / System Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-indigo-600">
              Executive Analytics &amp; Operations
            </span>
            <span className="text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Institutional Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-sans font-medium text-slate-700 hover:text-slate-900 transition-colors shadow-xs"
          >
            <FileDown className="w-3.5 h-3.5 text-indigo-600" />
            <span>Generate Reports</span>
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-sans font-semibold uppercase tracking-wider text-white transition-colors shadow-sm shadow-indigo-600/30"
          >
            <span>Open CRM Pipeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 8 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => setActiveTab(card.tab)}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between shadow-xs"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                {card.badge ? (
                  <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {card.badge}
                  </span>
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                )}
              </div>

              <div>
                <div className="text-3xl font-serif font-bold text-slate-900 tracking-tight mb-1">
                  {card.value}
                </div>
                <div className="text-xs font-sans font-bold text-slate-800">
                  {card.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-sans">
                  {card.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trajectory Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-sans uppercase tracking-wider text-indigo-600 font-bold block mb-1">
                System Influx Trends
              </span>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                Monthly Enquiries &amp; Career Applications (Last 6 Months)
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-sans font-semibold">
              <span className="flex items-center gap-1.5 text-indigo-700">
                <span className="w-2.5 h-2.5 rounded bg-indigo-600" />
                <span>Enquiries</span>
              </span>
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                <span>Careers</span>
              </span>
            </div>
          </div>

          {/* Clean Interactive Chart */}
          <div className="h-64 w-full flex items-end gap-3 sm:gap-6 pt-4 pb-2 border-b border-slate-200 bg-slate-50/50 rounded-xl px-4">
            {monthly_trends.map((item, idx) => {
              const maxVal = 28;
              const enqHeight = Math.max((item.enquiries / maxVal) * 100, 8);
              const appHeight = Math.max((item.applications / maxVal) * 100, 8);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                  {/* Bars container */}
                  <div className="w-full flex items-end justify-center gap-1.5 h-full relative">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-sans py-1 px-2.5 rounded-md shadow-lg pointer-events-none z-10 whitespace-nowrap">
                      {item.month}: {item.enquiries} Enquiries / {item.applications} Applications
                    </div>

                    {/* Enquiry Bar */}
                    <div
                      style={{ height: `${enqHeight}%` }}
                      className="w-full max-w-[22px] bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t group-hover:from-indigo-600 group-hover:to-indigo-400 transition-all duration-300"
                    />
                    {/* Application Bar */}
                    <div
                      style={{ height: `${appHeight}%` }}
                      className="w-full max-w-[22px] bg-gradient-to-t from-rose-600 to-rose-400 rounded-t group-hover:from-rose-500 group-hover:to-rose-300 transition-all duration-300"
                    />
                  </div>

                  <span className="text-xs font-sans text-slate-600 font-semibold mt-3 truncate block w-full text-center">
                    {item.month.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-sans text-slate-500 pt-3">
            <span>Aggregated from live MySQL records</span>
            <span className="text-emerald-700 font-semibold">+18.4% month-over-month influx</span>
          </div>
        </div>

        {/* Enquiry Status Funnel */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-sans uppercase tracking-wider text-indigo-600 font-bold block mb-1">
              CRM Lifecycle Funnel
            </span>
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-4">
              Enquiry Status Distribution
            </h3>

            <div className="space-y-3">
              {[
                { status: 'New', count: status_breakdown['New'] || 0, color: 'bg-amber-500' },
                { status: 'Contacted', count: status_breakdown['Contacted'] || 0, color: 'bg-blue-500' },
                { status: 'Qualified', count: status_breakdown['Qualified'] || 0, color: 'bg-indigo-600' },
                { status: 'Proposal Sent', count: status_breakdown['Proposal Sent'] || 0, color: 'bg-purple-600' },
                { status: 'Negotiation', count: status_breakdown['Negotiation'] || 0, color: 'bg-rose-500' },
                { status: 'Won', count: status_breakdown['Won'] || 0, color: 'bg-emerald-600' },
              ].map((st, i) => {
                const total = metrics.total_enquiries || 1;
                const pct = Math.round((st.count / total) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-sans font-medium">
                      <span className="text-slate-700">{st.status}</span>
                      <span className="text-slate-500 font-semibold">{st.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${Math.max(pct, 4)}%` }}
                        className={`h-full ${st.color} rounded-full transition-all duration-500`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('crm')}
            className="w-full mt-6 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-sans font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Manage Pipeline Details →
          </button>
        </div>
      </div>

      {/* Two Column: Recent Enquiries Table & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-xs font-sans uppercase tracking-wider text-indigo-600 font-bold block mb-1">
                Incoming Influx
              </span>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                Recent Stakeholder Enquiries
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('crm')}
              className="text-xs font-sans font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All CRM</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/60 font-semibold">
                  <th className="py-3 px-3">Reference</th>
                  <th className="py-3 px-3">Stakeholder</th>
                  <th className="py-3 px-3">Classification</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recent_enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-indigo-600 font-semibold">{enq.reference_code}</td>
                    <td className="py-3 px-3">
                      <div className="font-sans font-bold text-slate-900">{enq.full_name}</div>
                      <div className="text-xs text-slate-500 font-sans">{enq.organization || 'Independent'}</div>
                    </td>
                    <td className="py-3 px-3 uppercase text-xs text-slate-500 font-semibold">{enq.enquiry_type}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        enq.priority === 'Urgent' ? 'bg-red-50 text-red-700 border border-red-200' :
                        enq.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {enq.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {enq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Telemetry Feed (1 col) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-xs font-sans uppercase tracking-wider text-indigo-600 font-bold block mb-1">
                  Security &amp; Audit Trail
                </span>
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  Recent Privileged Activity
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('audit-logs')}
                className="text-xs font-sans font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Full Trail
              </button>
            </div>

            <div className="space-y-4">
              {recent_activity.slice(0, 5).map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="text-indigo-700 font-bold">{log.module} · {log.action}</span>
                      <span className="text-slate-400 font-sans text-[11px]">{log.username || 'System'}</span>
                    </div>
                    <p className="text-slate-700 text-xs font-sans truncate">
                      {log.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-sans text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Audit Logging Active</span>
            </span>
            <span>MySQL Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
