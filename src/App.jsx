import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SEO from './components/common/SEO';
import NotificationToast from './components/common/NotificationToast';
import ScrollRevealManager from './components/common/ScrollRevealManager';
import CookieConsentBanner from './components/common/CookieConsentBanner';
import RedirectHandler from './components/common/RedirectHandler';
import { EnquiryProvider } from './context/EnquiryContext';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';

import HomePage from './pages/HomePage';

// Dedicated Admin Portal
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage'));
const AdminDashboardMaster = lazy(() => import('./admin/pages/AdminDashboardMaster'));

// Lazy Loaded Enterprise Inner Pages
const AboutPage = lazy(() => import('./pages/company/AboutPage'));
const LeadershipPage = lazy(() => import('./pages/company/LeadershipPage'));
const OurApproachPage = lazy(() => import('./pages/company/OurApproachPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const SolutionsPage = lazy(() => import('./pages/SolutionsPage'));
const SolutionDetailPage = lazy(() => import('./pages/SolutionDetailPage'));
const IndustriesPage = lazy(() => import('./pages/IndustriesPage'));
const IndustryDetailPage = lazy(() => import('./pages/IndustryDetailPage'));
const GovernmentPage = lazy(() => import('./pages/GovernmentPage'));
const GlobalBusinessPage = lazy(() => import('./pages/GlobalBusinessPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const InsightDetailPage = lazy(() => import('./pages/InsightDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const EnterpriseProjectPage = lazy(() => import('./pages/enquiry/EnterpriseProjectPage'));
const PartnershipPage = lazy(() => import('./pages/enquiry/PartnershipPage'));

// Executive Loading Skeleton
function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#F8FAFC]">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-md bg-indigo-600 animate-spin flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white"></div>
        </div>
        <span className="font-mono text-xs font-bold text-slate-700 uppercase tracking-widest">
          A8FUSION // LOADING SYSTEMS
        </span>
      </div>
    </div>
  );
}

// Layout wrapper for normal corporate pages
function CorporateLayout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </main>
      <Footer hidePreFooterCard={isHomePage} />
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <EnquiryProvider>
        <Router>
          <SEO />
          <RedirectHandler />
          <ScrollRevealManager />
          <NotificationToast />
          <CookieConsentBanner />

          <Routes>
            {/* Dedicated Secure Admin Interface */}
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminLoginPage />
                </Suspense>
              }
            />
            <Route
              path="/admin"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminDashboardMaster />
                </Suspense>
              }
            />
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminDashboardMaster />
                </Suspense>
              }
            />

            {/* Flagship Corporate Pages */}
          <Route path="/" element={<CorporateLayout><HomePage /></CorporateLayout>} />
          <Route path="/home" element={<CorporateLayout><HomePage /></CorporateLayout>} />
          
          {/* Company */}
          <Route path="/about" element={<CorporateLayout><AboutPage /></CorporateLayout>} />
          <Route path="/company/about" element={<CorporateLayout><AboutPage /></CorporateLayout>} />
          <Route path="/leadership" element={<CorporateLayout><LeadershipPage /></CorporateLayout>} />
          <Route path="/company/leadership" element={<CorporateLayout><LeadershipPage /></CorporateLayout>} />
          <Route path="/company-leadership" element={<CorporateLayout><LeadershipPage /></CorporateLayout>} />
          <Route path="/our-approach" element={<CorporateLayout><OurApproachPage /></CorporateLayout>} />
          <Route path="/company/our-approach" element={<CorporateLayout><OurApproachPage /></CorporateLayout>} />
          <Route path="/company-our-approach" element={<CorporateLayout><OurApproachPage /></CorporateLayout>} />
          <Route path="/careers" element={<CorporateLayout><CareersPage /></CorporateLayout>} />

          {/* Services */}
          <Route path="/services" element={<CorporateLayout><ServicesPage /></CorporateLayout>} />
          <Route path="/services/:slug" element={<CorporateLayout><ServiceDetailPage /></CorporateLayout>} />

          {/* Solutions */}
          <Route path="/solutions" element={<CorporateLayout><SolutionsPage /></CorporateLayout>} />
          <Route path="/solutions/:slug" element={<CorporateLayout><SolutionDetailPage /></CorporateLayout>} />

          {/* Industries */}
          <Route path="/industries" element={<CorporateLayout><IndustriesPage /></CorporateLayout>} />
          <Route path="/industries/:slug" element={<CorporateLayout><IndustryDetailPage /></CorporateLayout>} />

          {/* Government & Public Sector */}
          <Route path="/government" element={<CorporateLayout><GovernmentPage /></CorporateLayout>} />
          <Route path="/government/enquiry" element={<CorporateLayout><GovernmentPage /></CorporateLayout>} />
          <Route path="/government-public-sector" element={<CorporateLayout><GovernmentPage /></CorporateLayout>} />

          {/* Global Business */}
          <Route path="/global-business" element={<CorporateLayout><GlobalBusinessPage /></CorporateLayout>} />

          {/* Insights */}
          <Route path="/insights" element={<CorporateLayout><InsightsPage /></CorporateLayout>} />
          <Route path="/insight" element={<CorporateLayout><InsightsPage /></CorporateLayout>} />
          <Route path="/insights/:slug" element={<CorporateLayout><InsightDetailPage /></CorporateLayout>} />
          <Route path="/insight/:slug" element={<CorporateLayout><InsightDetailPage /></CorporateLayout>} />

          {/* Contact Us */}
          <Route path="/contact" element={<CorporateLayout><ContactPage /></CorporateLayout>} />

          {/* Dedicated Enquiry Portals */}
          <Route path="/request-project" element={<CorporateLayout><EnterpriseProjectPage /></CorporateLayout>} />
          <Route path="/request-enterprise-project" element={<CorporateLayout><EnterpriseProjectPage /></CorporateLayout>} />
          <Route path="/enterprise-project" element={<CorporateLayout><EnterpriseProjectPage /></CorporateLayout>} />
          <Route path="/partnerships" element={<CorporateLayout><PartnershipPage /></CorporateLayout>} />

          {/* Fallback to Home */}
          <Route path="*" element={<CorporateLayout><HomePage /></CorporateLayout>} />
        </Routes>
      </Router>
    </EnquiryProvider>
  </AdminAuthProvider>
  );
}
