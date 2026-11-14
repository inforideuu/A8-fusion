import React, { createContext, useContext, useState, useEffect } from 'react';

const EnquiryContext = createContext();

const INITIAL_ENQUIRIES = [
  {
    id: 'A8F-GOV-2026-104',
    reference_code: 'A8F-GOV-2026-104',
    type: 'Government',
    enquiry_type: 'government',
    organization: 'Ministry of Digital Development & Civil Records',
    contactPerson: 'Director Hamad Al-Fahim',
    full_name: 'Director Hamad Al-Fahim',
    designation: 'Director of Sovereign Infrastructure',
    email: 'h.alfahim@mddcr.gov.ae',
    phone: '+971 4 800 9200',
    country: 'United Arab Emirates',
    projectCategory: 'Digital Citizen Identity & E-Permit Core',
    description: 'Procuring architecture advisory and implementation framework for unified digital citizen credentials across 14 municipal departments with domestic data residency.',
    estimatedBudget: '₹50 Crores – ₹100 Crores',
    estimated_budget: '₹50 Crores – ₹100 Crores',
    tenderReference: 'TND-2026-MDD-044',
    status: 'In Technical Review',
    submittedAt: '2026-02-10T09:30:00Z',
    notes: 'High-priority sovereign engagement. Technical discovery scheduled with Dr. Chen.'
  },
  {
    id: 'A8F-ENT-2026-318',
    reference_code: 'A8F-ENT-2026-318',
    type: 'Enterprise Project',
    enquiry_type: 'project',
    organization: 'Apex Pacific Marine Logistics',
    contactPerson: 'David K. Tan',
    full_name: 'David K. Tan',
    designation: 'Group Chief Operating Officer',
    email: 'david.tan@apexpacific.sg',
    phone: '+65 6789 4500',
    country: 'Singapore',
    industry: 'Logistics & Supply Chain',
    projectCategory: 'Custom Multi-Port Telemetry & ERP Integration',
    description: 'Replacing legacy fractured dispatch databases across Singapore, Port Klang, and Tanjung Pelepas with a real-time event-driven freight orchestration platform.',
    timeline: '6 - 9 Months',
    timeframe: '6 - 9 Months',
    budgetRange: '₹10 Crores – ₹25 Crores',
    estimatedBudget: '₹10 Crores – ₹25 Crores',
    estimated_budget: '₹10 Crores – ₹25 Crores',
    status: 'Qualified',
    submittedAt: '2026-02-08T14:15:00Z',
    notes: 'Executive presentation requested for Q1 Board meeting.'
  },
  {
    id: 'A8F-PART-2026-089',
    reference_code: 'A8F-PART-2026-089',
    type: 'Strategic Partnership',
    enquiry_type: 'partnership',
    organization: 'Nordic Sovereign Systems AB',
    contactPerson: 'Astrid Lindqvist',
    full_name: 'Astrid Lindqvist',
    designation: 'Head of Global Alliances',
    email: 'astrid.l@nordicsovereign.se',
    phone: '+46 8 505 1200',
    country: 'Sweden / European Union',
    partnershipCategory: 'Systems Integration & Co-Delivery',
    proposedCollaboration: 'Joint consortium bidding for EU Public Health data harmonization tender; leveraging A8Fusion clinical data connectors with our local Nordic accredited SOC.',
    estimatedBudget: 'Partner Model',
    estimated_budget: 'Partner Model',
    status: 'Partner Discovery Scheduled',
    submittedAt: '2026-01-29T11:00:00Z',
    notes: 'Mutual NDA executed. Reviewing tender specifications.'
  }
];

const INITIAL_APPLICATIONS = [
  {
    id: 'APP-2026-019',
    jobId: 'req-01',
    jobTitle: 'Lead Enterprise Systems Architect',
    candidateName: 'Vikramaditya Sharma',
    email: 'v.sharma@techlead.org',
    phone: '+65 9123 4567',
    experience: '12 Years',
    location: 'Singapore',
    linkedin: 'https://linkedin.com/in/vikram-sharma-arch',
    skills: 'Distributed Systems, Java 21, Kafka, Kubernetes, TOGAF, Multi-region high availability',
    status: 'Shortlisted for Technical Interview',
    submittedAt: '2026-02-05T16:20:00Z',
    notes: 'Ex-VP of Engineering at global bank; authored internal microservices framework.'
  }
];

export function EnquiryProvider({ children }) {
  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('a8f_enquiries');
      if (!saved) return INITIAL_ENQUIRIES;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_ENQUIRIES;
    } catch (e) {
      console.warn('EnquiryProvider: failed to parse a8f_enquiries, resetting to initial defaults', e);
      try { localStorage.removeItem('a8f_enquiries'); } catch {}
      return INITIAL_ENQUIRIES;
    }
  });

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('a8f_applications');
      if (!saved) return INITIAL_APPLICATIONS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_APPLICATIONS;
    } catch (e) {
      console.warn('EnquiryProvider: failed to parse a8f_applications, resetting to initial defaults', e);
      try { localStorage.removeItem('a8f_applications'); } catch {}
      return INITIAL_APPLICATIONS;
    }
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      if (!Array.isArray(enquiries)) return;
      // Sanitize multi-megabyte base64 payloads to protect localStorage quota
      const safeEnquiries = enquiries.map((e) => ({
        ...e,
        document_attachments: Array.isArray(e.document_attachments)
          ? e.document_attachments.map((doc) => ({
              name: doc?.name || 'document',
              size: doc?.size || '',
              type: doc?.type || 'application/pdf',
              uploaded_at: doc?.uploaded_at || new Date().toISOString()
            }))
          : []
      }));
      localStorage.setItem('a8f_enquiries', JSON.stringify(safeEnquiries));
    } catch (e) {
      console.warn('Could not persist enquiries to localStorage:', e);
    }
  }, [enquiries]);

  useEffect(() => {
    try {
      if (!Array.isArray(applications)) return;
      // Sanitize multi-megabyte base64 resumes to protect localStorage quota
      const safeApplications = applications.map((a) => ({
        ...a,
        resume_url: (typeof a.resume_url === 'string' && a.resume_url.startsWith('data:') && a.resume_url.length > 5000)
          ? ''
          : a.resume_url
      }));
      localStorage.setItem('a8f_applications', JSON.stringify(safeApplications));
    } catch (e) {
      console.warn('Could not persist applications to localStorage:', e);
    }
  }, [applications]);

  const showNotification = (message, type = 'success') => {
    if (!message) {
      setNotification(null);
      return;
    }
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 6000);
  };

  const submitEnquiry = (data = {}) => {
    if (!data) return '';
    const prefix = (data.type === 'Government' || data.type === 'government')
      ? 'A8F-GOV' 
      : (data.type === 'Strategic Partnership' || data.type === 'partnership')
        ? 'A8F-PART' 
        : (data.type === 'Enterprise Project' || data.type === 'project')
          ? 'A8F-ENT'
          : 'A8F-GEN';
    
    const randomNum = Math.floor(100 + Math.random() * 900);
    const year = new Date().getFullYear();
    const id = `${prefix}-${year}-${randomNum}`;

    const rawType = (data.enquiry_type || data.type || '').toLowerCase();
    const mappedType = (rawType.includes('gov'))
      ? 'government'
      : (rawType.includes('partner'))
        ? 'partnership'
        : (rawType.includes('project') && !rawType.includes('contact'))
          ? 'project'
          : 'general';

    const attachments = Array.isArray(data.document_attachments)
      ? data.document_attachments
      : (data.attachedFile ? [data.attachedFile] : (data.attachedFileName ? [{ name: data.attachedFileName, size: data.attachedFileSize || '', data: data.attachedFileData || '', type: data.attachedFileType || 'application/pdf', uploaded_at: new Date().toISOString() }] : []));

    const resolvedBudget = (mappedType === 'project' && (data.budgetRange === '₹50 Lakhs – ₹1 Crore' || data.budget === '₹50 Lakhs – ₹1 Crore'))
      ? ''
      : (data.estimated_budget || data.budgetRange || data.estimatedBudget || data.budget || '');
    const resolvedName = data.full_name || data.name || data.contactPerson || 'Prospective Client';
    const resolvedOrg = data.organization || data.company || '';
    const resolvedTimeframe = data.timeframe || data.timeline || '';
    const resolvedMessage = data.message || data.description || data.proposedCollaboration || `Enquiry category: ${data.projectCategory || data.partnershipCategory || 'General'}`;

    const newEnquiry = {
      ...data,
      id,
      reference_code: id,
      full_name: resolvedName,
      contactPerson: resolvedName,
      organization: resolvedOrg,
      enquiry_type: mappedType,
      type: data.type || mappedType,
      estimated_budget: resolvedBudget,
      estimatedBudget: resolvedBudget,
      budget: resolvedBudget,
      timeframe: resolvedTimeframe,
      timeline: resolvedTimeframe,
      message: resolvedMessage,
      description: resolvedMessage,
      document_attachments: attachments,
      status: 'New',
      created_at: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      notes: 'New submission via A8Fusion Corporate Portal.'
    };

    setEnquiries(prev => [newEnquiry, ...(Array.isArray(prev) ? prev : [])]);
    showNotification(`Enquiry submitted successfully! Reference: ${id}`, 'success');

    // Asynchronously dispatch to Django backend MySQL API
    const payload = {
      reference_code: id,
      enquiry_type: mappedType,
      full_name: resolvedName,
      email: data.email || 'client@a8fusion.com',
      phone: data.phone || '',
      organization: resolvedOrg,
      country: data.country || 'Global',
      industry: data.industry || (data.projectCategory || ''),
      estimated_budget: resolvedBudget,
      timeframe: resolvedTimeframe,
      message: resolvedMessage,
      document_attachments: attachments,
      status: 'New',
      priority: data.type === 'Government' ? 'Urgent' : 'Medium',
      internal_notes: `Submitted via website form. Designation: ${data.designation || 'N/A'}. Tender ref: ${data.tenderReference || 'N/A'}`
    };

    fetch('http://127.0.0.1:8000/api/enquiries/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(res => {
      if (res.ok) {
        console.log(`[EnquiryCRM] Successfully synced ${id} to Django backend.`);
      } else {
        console.warn(`[EnquiryCRM] Backend responded with HTTP ${res.status}`);
      }
    }).catch(err => {
      console.warn('[EnquiryCRM] Offline or backend unreachable, saved to local store.', err);
    });

    return id;
  };

  const updateEnquiryStatus = (id, newStatus, newNotes) => {
    setEnquiries(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus || item.status,
          notes: newNotes !== undefined ? newNotes : item.notes
        };
      }
      return item;
    }));
    showNotification(`Updated record ${id}`, 'info');
  };

  const submitApplication = (data) => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const id = `APP-${new Date().getFullYear()}-${randomNum}`;
    const resumeUrl = data.resume_url || data.resumeData || data.resumeUrl || '';
    const resumeName = data.attachedResumeName || data.resume_name || data.resumeName || '';
    const resumeSize = data.attachedResumeSize || data.resume_size || data.resumeSize || '';

    const newApp = {
      ...data,
      id,
      resume_url: resumeUrl,
      resume_name: resumeName,
      resume_size: resumeSize,
      status: 'Under Initial Screening',
      submittedAt: new Date().toISOString(),
      notes: 'Submitted through A8Fusion Global Careers portal.'
    };
    setApplications(prev => [newApp, ...prev]);
    showNotification(`Application received! Reference ID: ${id}`, 'success');

    // Asynchronously dispatch to Django backend MySQL API
    const payload = {
      candidate_name: data.candidateName || data.candidate_name || data.name || 'Candidate',
      email: data.email || 'applicant@a8fusion.com',
      phone: data.phone || '',
      experience_years: data.experience || data.experience_years || 'Not specified',
      current_company: data.currentCompany || data.current_company || '',
      linkedin_url: data.linkedin || data.linkedin_url || '',
      resume_url: resumeUrl,
      resume_name: resumeName,
      resume_size: resumeSize,
      cover_letter: `Position: ${data.jobTitle || data.position || 'General Engineering Role'}\nSkills: ${data.skills || 'Not specified'}\n\n${data.coverLetter || ''}`,
      status: 'New',
      internal_notes: `Application ref: ${id}. Position applied: ${data.jobTitle || data.position || 'Open Role'}`
    };

    if (data.vacancyId) {
      payload.vacancy = data.vacancyId;
    } else if (typeof data.jobId === 'number') {
      payload.vacancy = data.jobId;
    }

    fetch('http://127.0.0.1:8000/api/careers/applications/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(res => {
      if (res.ok) {
        console.log(`[Careers] Successfully synced ${id} to Django backend.`);
      } else {
        console.warn(`[Careers] Backend responded with HTTP ${res.status}`);
      }
    }).catch(err => {
      console.warn('[Careers] Offline or backend unreachable, saved to local store.', err);
    });

    return id;
  };

  const updateApplicationStatus = (id, newStatus, newNotes) => {
    setApplications(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus || item.status,
          notes: newNotes !== undefined ? newNotes : item.notes
        };
      }
      return item;
    }));
    showNotification(`Updated candidate ${id}`, 'info');
  };

  return (
    <EnquiryContext.Provider value={{
      enquiries,
      applications,
      notification,
      submitEnquiry,
      updateEnquiryStatus,
      submitApplication,
      updateApplicationStatus,
      showNotification
    }}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
}

