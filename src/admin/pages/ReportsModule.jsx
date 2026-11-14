import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import {
  BarChart3, FileDown, RefreshCw, Calendar,
  Building2, Globe, Briefcase, Layers, ArrowUpRight
} from 'lucide-react';

export default function ReportsModule() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getResource('reports/summary');
      if (data && data.by_industry) {
        setReportData(data);
      } else {
        setReportData({
          by_industry: [],
          by_country: [],
          by_type: [],
          by_career_status: []
        });
      }
    } catch (e) {
      console.error(e);
      setReportData({
        by_industry: [],
        by_country: [],
        by_type: [],
        by_career_status: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleExportCSV = (type) => {
    if (type === 'enquiries') {
      window.open('http://127.0.0.1:8000/api/enquiries/export_csv/', '_blank');
    } else if (type === 'careers') {
      window.open('http://127.0.0.1:8000/api/careers/applications/export_csv/', '_blank');
    } else {
      alert(`Exporting ${type} dataset.`);
    }
  };

  if (loading || !reportData) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-xs font-sans text-indigo-600 font-semibold">
        Aggregating analytics reports...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-sans font-semibold uppercase tracking-wider text-indigo-600 block mb-1">
            Business Intelligence &amp; Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 tracking-tight">
            Institutional Reports &amp; Exports
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Analyze enquiry distribution by sector, territory, service line, and career pipeline with CSV generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadReports}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleExportCSV('enquiries')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-sans font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Enquiries CSV</span>
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry-wise Enquiries */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-sans font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Industry-Wise Influx</span>
            </h3>
            <span className="text-[10px] font-sans text-slate-500 font-bold">Total Enquiries</span>
          </div>

          <div className="space-y-3 text-xs font-sans">
            {reportData.by_industry.map((item, idx) => {
              const max = 8;
              const pct = Math.round((item.total / max) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-700 truncate max-w-[200px] font-medium">{item.industry || 'General Sector'}</span>
                    <span className="text-indigo-600 font-bold">{item.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div style={{ width: `${pct}%` }} className="h-full bg-indigo-600 rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Territory / Country-wise */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-sans font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Country &amp; Jurisdiction Distribution</span>
            </h3>
            <span className="text-[10px] font-sans text-slate-500 font-bold">Territories</span>
          </div>

          <div className="space-y-3 text-xs font-sans">
            {reportData.by_country.map((item, idx) => {
              const max = 8;
              const pct = Math.round((item.total / max) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-medium">{item.country || 'International'}</span>
                    <span className="text-emerald-700 font-bold">{item.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div style={{ width: `${pct}%` }} className="h-full bg-emerald-600 rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Classification / Service Wise */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-sans font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Enquiry Classification Breakdown</span>
            </h3>
            <span className="text-[10px] font-sans text-slate-500 font-bold">Portal Streams</span>
          </div>

          <div className="space-y-3 text-xs font-sans">
            {reportData.by_type.map((item, idx) => {
              const max = 15;
              const pct = Math.round((item.total / max) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between uppercase">
                    <span className="text-slate-700 font-medium">{item.enquiry_type}</span>
                    <span className="text-purple-700 font-bold">{item.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div style={{ width: `${pct}%` }} className="h-full bg-purple-600 rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Career Application Pipeline */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-sans font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-rose-600" />
              <span>Career Pipeline Funnel</span>
            </h3>
            <button
              onClick={() => handleExportCSV('careers')}
              className="text-[10px] font-sans text-rose-600 hover:underline flex items-center gap-1 font-bold"
            >
              <span>Export CSV</span>
              <FileDown className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 text-xs font-sans">
            {reportData.by_career_status.map((item, idx) => {
              const max = 10;
              const pct = Math.round((item.total / max) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-medium">{item.status}</span>
                    <span className="text-rose-600 font-bold">{item.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div style={{ width: `${pct}%` }} className="h-full bg-rose-600 rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

