import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminProtectedRoute from '../components/AdminProtectedRoute';

import DashboardOverview from './DashboardOverview';
import UsersModule from './UsersModule';
import RbacModule from './RbacModule';
import PagesModule from './PagesModule';
import ServicesModule from './ServicesModule';
import SolutionsModule from './SolutionsModule';
import IndustriesModule from './IndustriesModule';
import EnquiryCrmModule from './EnquiryCrmModule';
import CareersModule from './CareersModule';
import InsightsModule from './InsightsModule';
import MediaLibraryModule from './MediaLibraryModule';
import SeoModule from './SeoModule';
import SettingsModule from './SettingsModule';
import ReportsModule from './ReportsModule';
import AuditLogsModule from './AuditLogsModule';

export default function AdminDashboardMaster() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview setActiveTab={setActiveTab} />;
      case 'users':
        return (
          <AdminProtectedRoute module="users">
            <UsersModule />
          </AdminProtectedRoute>
        );
      case 'rbac':
        return (
          <AdminProtectedRoute module="rbac">
            <RbacModule />
          </AdminProtectedRoute>
        );
      case 'pages':
      case 'services':
      case 'solutions':
      case 'industries':
      case 'insights':
      case 'media':
        return (
          <AdminProtectedRoute module="pages">
            <PagesModule />
          </AdminProtectedRoute>
        );
      case 'crm':
        return (
          <AdminProtectedRoute module="crm">
            <EnquiryCrmModule />
          </AdminProtectedRoute>
        );
      case 'careers':
        return (
          <AdminProtectedRoute module="careers">
            <CareersModule />
          </AdminProtectedRoute>
        );
      case 'seo':
        return (
          <AdminProtectedRoute module="seo">
            <SeoModule />
          </AdminProtectedRoute>
        );
      case 'settings':
        return (
          <AdminProtectedRoute module="settings">
            <SettingsModule />
          </AdminProtectedRoute>
        );
      case 'reports':
        return (
          <AdminProtectedRoute module="reports">
            <ReportsModule />
          </AdminProtectedRoute>
        );
      case 'audit-logs':
        return (
          <AdminProtectedRoute module="audit-logs">
            <AuditLogsModule />
          </AdminProtectedRoute>
        );
      default:
        return <DashboardOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderActiveModule()}
      </AdminLayout>
    </AdminProtectedRoute>
  );
}

