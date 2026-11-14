from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    login_view, logout_view, me_view, dashboard_overview, reports_summary, notifications_view,
    UserViewSet, RolePermissionViewSet, PageViewSet, ServiceViewSet, SolutionViewSet, IndustryViewSet,
    EnquiryViewSet, JobVacancyViewSet, JobApplicationViewSet, ArticleViewSet,
    MediaItemViewSet, SEOSettingViewSet, RedirectRuleViewSet, WebsiteSettingViewSet,
    AuditLogViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'rbac/permissions', RolePermissionViewSet, basename='rbac-permissions')
router.register(r'pages', PageViewSet, basename='pages')
router.register(r'services', ServiceViewSet, basename='services')
router.register(r'solutions', SolutionViewSet, basename='solutions')
router.register(r'industries', IndustryViewSet, basename='industries')
router.register(r'enquiries', EnquiryViewSet, basename='enquiries')
router.register(r'careers/vacancies', JobVacancyViewSet, basename='vacancies')
router.register(r'careers/applications', JobApplicationViewSet, basename='applications')
router.register(r'insights', ArticleViewSet, basename='insights')
router.register(r'media', MediaItemViewSet, basename='media')
router.register(r'seo/settings', SEOSettingViewSet, basename='seo-settings')
router.register(r'seo/redirects', RedirectRuleViewSet, basename='seo-redirects')
router.register(r'settings/website', WebsiteSettingViewSet, basename='website-settings')
router.register(r'audit-logs', AuditLogViewSet, basename='audit-logs')

urlpatterns = [
    # Auth
    path('auth/login/', login_view, name='api-login'),
    path('auth/logout/', logout_view, name='api-logout'),
    path('auth/me/', me_view, name='api-me'),

    # Analytics & Reports
    path('dashboard/overview/', dashboard_overview, name='dashboard-overview'),
    path('reports/summary/', reports_summary, name='reports-summary'),
    path('notifications/', notifications_view, name='notifications-list'),

    # Router endpoints
    path('', include(router.urls)),
]

