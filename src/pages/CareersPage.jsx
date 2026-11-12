import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { careersData, cultureValues } from '../data/careersData';
import { useEnquiry } from '../context/EnquiryContext';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Upload, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronRight,
  X
} from 'lucide-react';

export default function CareersPage() {
  const { submitApplication } = useEnquiry();
  const [selectedJob, setSelectedJob] = useState(null);
  const [submittedAppId, setSubmittedAppId] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    skills: '',
    linkedin: '',
    coverLetter: '',
    consent: false
  });

  const departments = ['All', 'Architecture & Engineering', 'Artificial Intelligence Practice', 'Enterprise Solutions', 'Cybersecurity Practice'];

  const filteredJobs = careersData.filter(job => 
    departmentFilter === 'All' || job.department === departmentFilter
  );

  const handleOpenApply = (job) => {
    setSelectedJob(job);
    setFormData(prev => ({
      ...prev,
      position: job.title
    }));
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm the consent checkbox.');
      return;
    }
    const id = submitApplication({
      ...formData,
      jobId: selectedJob?.id || 'open-req',
      jobTitle: formData.position
    });
    setSubmittedAppId(id);
    setSelectedJob(null);
  };

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Global Talent Acquisition"
        title="Engineering Careers at A8Fusion"
        subtitle="We recruit exceptional systems architects, distributed backend engineers, and sovereign AI researchers dedicated to uncompromising technical rigor."
        bgImage="/career.png"
        breadcrumbs={[
          { label: 'Company', link: '/company/about' },
          { label: 'Careers' }
        ]}
        primaryCtaText="View Current Openings"
        primaryCtaLink="#openings"
        secondaryCtaText="Review Governance Philosophy"
        secondaryCtaLink="/company/our-approach"
      />

      {/* Culture & Engineering Values */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Engineering Ethos
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              Our Culture &amp; Operating Standards
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              We cultivate a culture of deep intellectual honesty, architectural autonomy, and absolute dedication to system stability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cultureValues.map((val, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-3 card-hover-culture">
                <span className="text-xs font-mono font-bold text-indigo-600">PRINCIPLE 0{i+1}</span>
                <h3 className="text-base font-serif font-bold text-slate-900">{val.title}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Requisitions / Openings */}
      <section id="openings" className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                Open Requisitions
              </span>
              <h2 className="text-3xl font-serif font-normal text-slate-900">
                Current Technical Opportunities
              </h2>
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setDepartmentFilter(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    departmentFilter === dept
                      ? 'bg-[#0B172A] text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {submittedAppId && (
            <div className="mb-8 p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-bold text-emerald-900 text-lg">Application Submitted Successfully</h4>
              <p className="text-xs text-emerald-700 font-sans">
                Your application has been received by talent acquisitions. Reference ID: <strong className="font-mono">{submittedAppId}</strong>.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedAppId(null)}
                className="text-xs font-bold text-emerald-800 underline pt-1"
              >
                Dismiss notification
              </button>
            </div>
          )}

          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-7 lg:p-8 border border-slate-200 shadow-sm card-hover-job grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{job.experience}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-slate-900">
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {job.overview}
                  </p>

                  <div className="pt-1">
                    <span className="text-[11px] font-mono font-bold text-slate-500 uppercase block mb-1">Key Competencies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requirements.map((req, i) => (
                        <span key={i} className="text-[10px] font-sans bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenApply(job)}
                    className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Apply for Role</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <span className="text-[10px] font-mono text-slate-400 text-center lg:text-right">
                    REQ ID: {job.id.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase">
                  Application Portal // REQ {selectedJob.id.toUpperCase()}
                </span>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  {selectedJob.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-4 pt-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Sharma"
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. v.sharma@engineer.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +65 9123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total Experience *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10 Years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Primary Core Skills &amp; Stacks *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Java, Distributed Systems, Kubernetes, Kafka, TOGAF"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Cover Letter &amp; Architectural Accomplishments</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your most complex enterprise systems deployment..."
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2 p-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center">
                  <Upload className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <span className="text-slate-600 font-medium block">Resume / Curriculum Vitae Upload (Simulated)</span>
                  <span className="text-[10px] text-slate-400 font-mono">PDF or DOCX max 10MB</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-600">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-0.5 rounded border-slate-300 text-indigo-600"
                    />
                    <span>
                      I hereby consent to A8Fusion evaluating my professional credentials for employment consideration in accordance with corporate data retention protocols.
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider shadow"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

