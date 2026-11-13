import csv
from datetime import timedelta
from django.db.models import Count, Q
from django.http import HttpResponse
from django.utils import timezone
from django.contrib.auth import authenticate
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import (
    User, RolePermission, AuditLog, Page, Service, Solution, Industry,
    Enquiry, JobVacancy, JobApplication, Article,
    MediaItem, SEOSetting, RedirectRule, WebsiteSetting
)
from .serializers import (
    UserSerializer, RolePermissionSerializer, AuditLogSerializer, PageSerializer,
    ServiceSerializer, SolutionSerializer, IndustrySerializer,
    EnquirySerializer, JobVacancySerializer, JobApplicationSerializer,
    ArticleSerializer, MediaItemSerializer, SEOSettingSerializer,
    RedirectRuleSerializer, WebsiteSettingSerializer
)

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '127.0.0.1')

def create_audit(request, action_name, module_name, details, status_val='SUCCESS', user=None):
    current_user = user or (request.user if request.user.is_authenticated else None)
    username = current_user.username if current_user else 'Anonymous'
    AuditLog.objects.create(
        user=current_user,
        username=username,
        action=action_name,
        module=module_name,
        ip_address=get_client_ip(request),
        details=str(details),
        status=status_val
    )


# =============================================================================
# AUTHENTICATION VIEWS
# =============================================================================
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username_or_email = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not username_or_email or not password:
        return Response({'detail': 'Username/Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Allow login with email or username
    user = None
    if '@' in username_or_email:
        try:
            matched_user = User.objects.get(email__iexact=username_or_email)
            user = authenticate(request, username=matched_user.username, password=password)
        except User.DoesNotExist:
            user = None
    else:
        user = authenticate(request, username=username_or_email, password=password)

    if not user:
        create_audit(request, 'FAILED_LOGIN', 'Auth', f"Failed login attempt for '{username_or_email}'", 'FAILED')
        return Response({'detail': 'Invalid credentials. Please verify your username and password.'}, status=status.HTTP_401_UNAUTHORIZED)

    if user.is_disabled or not user.is_active:
        create_audit(request, 'FAILED_LOGIN', 'Auth', f"Disabled user '{user.username}' attempted login", 'WARNING', user=user)
        return Response({'detail': 'Your account has been deactivated. Please contact the Super Admin.'}, status=status.HTTP_403_FORBIDDEN)

    token, _ = Token.objects.get_or_create(user=user)
    user.last_login_ip = get_client_ip(request)
    user.last_login = timezone.now()
    user.save(update_fields=['last_login_ip', 'last_login'])

    create_audit(request, 'LOGIN', 'Auth', f"User {user.username} successfully logged in", 'SUCCESS', user=user)

    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'role_display': user.get_role_display(),
            'designation': user.designation,
            'avatar': user.avatar,
            'is_superuser': user.is_superuser,
        }
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        Token.objects.filter(user=request.user).delete()
    except Exception:
        pass
    create_audit(request, 'LOGOUT', 'Auth', f"User {request.user.username} logged out", 'SUCCESS')
    return Response({'detail': 'Logged out successfully.'})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
        'role_display': user.get_role_display(),
        'designation': user.designation,
        'avatar': user.avatar,
        'is_superuser': user.is_superuser,
        'is_disabled': user.is_disabled,
        'last_login': user.last_login,
    })


# =============================================================================
# DASHBOARD OVERVIEW METRICS
# =============================================================================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def dashboard_overview(request):
    total_enquiries = Enquiry.objects.count()
    new_enquiries = Enquiry.objects.filter(status='New').count()
    active_enquiries = Enquiry.objects.filter(status__in=['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation']).count()
    project_enquiries = Enquiry.objects.filter(enquiry_type='project').count()
    government_enquiries = Enquiry.objects.filter(enquiry_type='government').count()
    partnership_enquiries = Enquiry.objects.filter(enquiry_type='partnership').count()
    general_enquiries = Enquiry.objects.filter(enquiry_type='general').count()

    total_applications = JobApplication.objects.count()
    new_applications = JobApplication.objects.filter(status='New').count()
    published_articles = Article.objects.filter(status='Published').count()
    total_users = User.objects.count()
    total_services = Service.objects.filter(is_published=True).count()
    total_solutions = Solution.objects.filter(is_published=True).count()
    total_industries = Industry.objects.filter(is_published=True).count()

    # Monthly trends (last 6 months)
    today = timezone.now().date()
    monthly_data = []
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for i in range(5, -1, -1):
        m_date = today - timedelta(days=i * 30)
        m_name = f"{month_names[m_date.month - 1]} {m_date.year}"
        count = Enquiry.objects.filter(created_at__year=m_date.year, created_at__month=m_date.month).count()
        app_count = JobApplication.objects.filter(applied_at__year=m_date.year, applied_at__month=m_date.month).count()
        monthly_data.append({
            'month': m_name,
            'enquiries': count,
            'applications': app_count
        })

    # Status breakdown
    status_counts = Enquiry.objects.values('status').annotate(total=Count('id'))
    status_dict = {item['status']: item['total'] for item in status_counts}

    # Enquiry by Type
    type_counts = {
        'Enterprise Projects': project_enquiries,
        'Government Sectors': government_enquiries,
        'Strategic Partnerships': partnership_enquiries,
        'General Contact': general_enquiries,
    }

    # Industry distribution
    ind_counts = Enquiry.objects.exclude(industry='').values('industry').annotate(total=Count('id')).order_by('-total')[:6]
    industry_dist = [{'industry': item['industry'], 'count': item['total']} for item in ind_counts]

    # Recent activity
    recent_logs = AuditLog.objects.all()[:10]
    recent_logs_data = AuditLogSerializer(recent_logs, many=True).data

    # Recent enquiries
    recent_enquiries = Enquiry.objects.all()[:6]
    recent_enq_data = EnquirySerializer(recent_enquiries, many=True).data

    return Response({
        'metrics': {
            'total_enquiries': total_enquiries,
            'new_enquiries': new_enquiries,
            'active_enquiries': active_enquiries,
            'project_enquiries': project_enquiries,
            'government_enquiries': government_enquiries,
            'partnership_enquiries': partnership_enquiries,
            'career_applications': total_applications,
            'new_applications': new_applications,
            'published_articles': published_articles,
            'total_users': total_users,
            'total_services': total_services,
            'total_solutions': total_solutions,
            'total_industries': total_industries,
        },
        'monthly_trends': monthly_data,
        'status_breakdown': status_dict,
        'type_breakdown': type_counts,
        'industry_distribution': industry_dist,
        'recent_activity': recent_logs_data,
        'recent_enquiries': recent_enq_data,
    })


# =============================================================================
# MODULE 1 & 2: USER MANAGEMENT & RBAC
# =============================================================================
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        create_audit(self.request, 'CREATE_USER', 'Users', f"Created user {user.username} with role {user.role}")

    def perform_update(self, serializer):
        user = serializer.save()
        create_audit(self.request, 'UPDATE_USER', 'Users', f"Updated user {user.username} ({user.role})")

    def perform_destroy(self, instance):
        username = instance.username
        instance.delete()
        create_audit(self.request, 'DELETE_USER', 'Users', f"Deleted user {username}", 'WARNING')

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        user = self.get_object()
        user.is_disabled = not user.is_disabled
        user.is_active = not user.is_disabled
        user.save()
        status_str = "Disabled" if user.is_disabled else "Enabled"
        create_audit(request, 'TOGGLE_USER_STATUS', 'Users', f"{status_str} account for {user.username}")
        return Response({'is_disabled': user.is_disabled, 'message': f"Account {status_str} successfully."})

    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get('password')
        if not new_password or len(new_password) < 6:
            return Response({'detail': 'Password must be at least 6 characters.'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        create_audit(request, 'RESET_PASSWORD', 'Users', f"Reset password for user {user.username}")
        return Response({'message': f"Password for {user.username} reset successfully."})


DEFAULT_RBAC_MATRIX = {
    'SUPER_ADMIN': {
        'name': 'Super Admin',
        'level': 'Level 1 - Sovereign',
        'modules': ['dashboard', 'users', 'rbac', 'pages', 'crm', 'careers', 'seo', 'settings', 'reports', 'audit-logs']
    },
    'WEBSITE_ADMIN': {
        'name': 'Website Administrator',
        'level': 'Level 2 - Infrastructure',
        'modules': ['dashboard', 'users', 'rbac', 'pages', 'crm', 'careers', 'seo', 'settings', 'reports', 'audit-logs']
    },
    'CONTENT_MANAGER': {
        'name': 'Content Manager',
        'level': 'Level 3 - Editorial',
        'modules': ['dashboard', 'pages', 'seo']
    },
    'SALES_MANAGER': {
        'name': 'Sales Manager',
        'level': 'Level 3 - Commercial',
        'modules': ['dashboard', 'crm', 'reports', 'audit-logs']
    },
    'HR_MANAGER': {
        'name': 'HR Manager',
        'level': 'Level 3 - People & Talent',
        'modules': ['dashboard', 'careers', 'reports']
    },
    'BD_MANAGER': {
        'name': 'Business Development Manager',
        'level': 'Level 3 - Alliances',
        'modules': ['dashboard', 'crm', 'reports']
    },
}


class RolePermissionViewSet(viewsets.ModelViewSet):
    queryset = RolePermission.objects.all()
    serializer_class = RolePermissionSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        if RolePermission.objects.count() == 0:
            for code, data in DEFAULT_RBAC_MATRIX.items():
                RolePermission.objects.create(
                    role=code,
                    role_name=data['name'],
                    level=data['level'],
                    modules=data['modules']
                )
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['post'])
    def save_matrix(self, request):
        matrix = request.data.get('matrix', {})
        updated_roles = []
        for role_code, modules_list in matrix.items():
            rp, _ = RolePermission.objects.get_or_create(role=role_code)
            rp.modules = modules_list
            rp.save()
            updated_roles.append(role_code)

        create_audit(request, 'UPDATE_RBAC', 'RBAC', f"Super Admin updated clearance matrix for roles: {', '.join(updated_roles)}", 'SUCCESS')
        return Response({
            'detail': f'Permissions successfully updated for {len(updated_roles)} roles in MySQL.',
            'matrix': {rp.role: rp.modules for rp in RolePermission.objects.all()}
        })

    @action(detail=False, methods=['post'])
    def reset_defaults(self, request):
        RolePermission.objects.all().delete()
        for code, data in DEFAULT_RBAC_MATRIX.items():
            RolePermission.objects.create(
                role=code,
                role_name=data['name'],
                level=data['level'],
                modules=data['modules']
            )
        create_audit(request, 'RESET_RBAC', 'RBAC', "Reset RBAC clearance matrix to institutional defaults", 'WARNING')
        return Response({
            'detail': 'RBAC matrix reset to institutional defaults.',
            'matrix': {rp.role: rp.modules for rp in RolePermission.objects.all()}
        })


# =============================================================================
# MODULE 3: PAGE MANAGEMENT
# =============================================================================
class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        page = serializer.save()
        create_audit(self.request, 'CREATE_PAGE', 'Pages', f"Created page {page.title} (/{page.slug})")

    def perform_update(self, serializer):
        page = serializer.save()
        create_audit(self.request, 'UPDATE_PAGE', 'Pages', f"Updated page {page.title}")

    def perform_destroy(self, instance):
        title = instance.title
        instance.delete()
        create_audit(self.request, 'DELETE_PAGE', 'Pages', f"Deleted page {title}", 'WARNING')

    @action(detail=False, methods=['post'], url_path='save_live_content')
    def save_live_content(self, request):
        slug = request.data.get('slug', 'home')
        data = request.data.get('live_data', {})
        page = Page.objects.filter(slug=slug).first()
        if not page:
            friendly_title = slug.replace('-', ' ').replace('_', ' ').title() + " Page"
            page = Page.objects.create(slug=slug, title=friendly_title, heading='')
        page.live_data = data
        page.save()
        create_audit(request, 'LIVE_EDIT_PAGE', 'Pages', f"Saved live visual editor modifications for page '{page.title}' (/{slug})", 'SUCCESS')
        return Response({'detail': f"Live content saved for {page.title}", 'slug': slug, 'live_data': page.live_data})

    @action(detail=False, methods=['get'], url_path='get_live_content')
    def get_live_content(self, request):
        slug = request.query_params.get('slug', 'home')
        slug_candidates = [slug]
        if slug in ['company-leadership', 'leadership']:
            slug_candidates = ['company-leadership', 'leadership']
        elif slug in ['about', 'company-about']:
            slug_candidates = ['company-about', 'about']
        elif slug in ['company-our-approach', 'our-approach']:
            slug_candidates = ['company-our-approach', 'our-approach']
        elif slug in ['government', 'government-public-sector']:
            slug_candidates = ['government', 'government-public-sector']
        elif slug in ['request-project', 'request-enterprise-project', 'enterprise-project']:
            slug_candidates = ['request-project', 'request-enterprise-project', 'enterprise-project']
        elif slug in ['insights', 'insight', 'insights-publications', 'articles']:
            slug_candidates = ['insights', 'insight', 'insights-publications', 'articles']

        page = Page.objects.filter(slug__in=slug_candidates).first()
        if page:
            return Response({'slug': page.slug, 'title': page.title, 'live_data': page.live_data or {}})
        return Response({'slug': slug, 'title': slug.replace('-', ' ').title(), 'live_data': {}})


# =============================================================================
# MODULE 4: SERVICES MANAGEMENT
# =============================================================================
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        service = serializer.save()
        create_audit(self.request, 'CREATE_SERVICE', 'Services', f"Created service {service.title}")

    def perform_update(self, serializer):
        service = serializer.save()
        create_audit(self.request, 'UPDATE_SERVICE', 'Services', f"Updated service {service.title}")


# =============================================================================
# MODULE 5: SOLUTIONS MANAGEMENT
# =============================================================================
class SolutionViewSet(viewsets.ModelViewSet):
    queryset = Solution.objects.all()
    serializer_class = SolutionSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        sol = serializer.save()
        create_audit(self.request, 'CREATE_SOLUTION', 'Solutions', f"Created platform {sol.title}")

    def perform_update(self, serializer):
        sol = serializer.save()
        create_audit(self.request, 'UPDATE_SOLUTION', 'Solutions', f"Updated platform {sol.title}")


# =============================================================================
# MODULE 6: INDUSTRY MANAGEMENT
# =============================================================================
class IndustryViewSet(viewsets.ModelViewSet):
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        ind = serializer.save()
        create_audit(self.request, 'CREATE_INDUSTRY', 'Industries', f"Created sector {ind.title}")

    def perform_update(self, serializer):
        ind = serializer.save()
        create_audit(self.request, 'UPDATE_INDUSTRY', 'Industries', f"Updated sector {ind.title}")


# =============================================================================
# MODULE 7: ENQUIRY CRM
# =============================================================================
class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Enquiry.objects.all()
        q = self.request.query_params.get('search')
        enq_type = self.request.query_params.get('type')
        enq_status = self.request.query_params.get('status')
        priority = self.request.query_params.get('priority')

        if q:
            qs = qs.filter(
                Q(full_name__icontains=q) |
                Q(email__icontains=q) |
                Q(organization__icontains=q) |
                Q(reference_code__icontains=q) |
                Q(message__icontains=q)
            )
        if enq_type:
            qs = qs.filter(enquiry_type=enq_type)
        if enq_status:
            qs = qs.filter(status=enq_status)
        if priority:
            qs = qs.filter(priority=priority)
        return qs

    def perform_create(self, serializer):
        enquiry = serializer.save()
        create_audit(self.request, 'CREATE_ENQUIRY', 'CRM', f"Received enquiry {enquiry.reference_code} from {enquiry.full_name}")

    def perform_update(self, serializer):
        enquiry = serializer.save()
        create_audit(self.request, 'UPDATE_ENQUIRY', 'CRM', f"Updated enquiry {enquiry.reference_code} status: {enquiry.status}")

    def perform_destroy(self, instance):
        ref = instance.reference_code
        instance.delete()
        create_audit(self.request, 'DELETE_ENQUIRY', 'CRM', f"Deleted enquiry {ref}", 'WARNING')

    @action(detail=True, methods=['post'])
    def add_communication(self, request, pk=None):
        enquiry = self.get_object()
        comm_type = request.data.get('type', 'Call')
        summary = request.data.get('summary', '')
        author = request.user.username if request.user.is_authenticated else 'Staff'

        history = enquiry.communication_history or []
        history.insert(0, {
            'date': timezone.now().strftime('%Y-%m-%d %H:%M'),
            'type': comm_type,
            'author': author,
            'summary': summary
        })
        enquiry.communication_history = history
        enquiry.save(update_fields=['communication_history'])
        create_audit(request, 'LOG_COMMUNICATION', 'CRM', f"Added {comm_type} log to {enquiry.reference_code}")
        return Response({'communication_history': enquiry.communication_history})

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        create_audit(request, 'EXPORT_DATA', 'CRM', "Exported enquiries list to CSV")
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="a8fusion_enquiries.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'Reference Code', 'Type', 'Full Name', 'Email', 'Phone',
            'Organization', 'Country', 'Industry', 'Budget', 'Timeframe',
            'Status', 'Priority', 'Assigned To', 'Created At'
        ])

        for enq in self.get_queryset():
            writer.writerow([
                enq.reference_code,
                enq.get_enquiry_type_display(),
                enq.full_name,
                enq.email,
                enq.phone,
                enq.organization,
                enq.country,
                enq.industry,
                enq.estimated_budget,
                enq.timeframe,
                enq.status,
                enq.priority,
                enq.assigned_to.username if enq.assigned_to else 'Unassigned',
                enq.created_at.strftime('%Y-%m-%d %H:%M')
            ])
        return response


# =============================================================================
# MODULE 8: CAREERS MANAGEMENT
# =============================================================================
class JobVacancyViewSet(viewsets.ModelViewSet):
    queryset = JobVacancy.objects.all()
    serializer_class = JobVacancySerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        vac = serializer.save()
        create_audit(self.request, 'CREATE_VACANCY', 'Careers', f"Created vacancy {vac.title}")

    def perform_update(self, serializer):
        vac = serializer.save()
        create_audit(self.request, 'UPDATE_VACANCY', 'Careers', f"Updated vacancy {vac.title}")

    def perform_destroy(self, instance):
        title = instance.title
        instance.delete()
        create_audit(self.request, 'DELETE_VACANCY', 'Careers', f"Deleted vacancy {title}", 'WARNING')


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = JobApplication.objects.all()
        status_filter = self.request.query_params.get('status')
        vacancy_id = self.request.query_params.get('vacancy')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if vacancy_id:
            qs = qs.filter(vacancy_id=vacancy_id)
        return qs

    def perform_update(self, serializer):
        app = serializer.save()
        create_audit(self.request, 'UPDATE_APPLICATION', 'Careers', f"Updated application status for {app.candidate_name}: {app.status}")

    def perform_destroy(self, instance):
        name = instance.candidate_name
        instance.delete()
        create_audit(self.request, 'DELETE_APPLICATION', 'Careers', f"Deleted application for {name}", 'WARNING')

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        create_audit(request, 'EXPORT_DATA', 'Careers', "Exported job applications list to CSV")
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="a8fusion_career_applications.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'Candidate Name', 'Email', 'Phone', 'Role/Vacancy',
            'Experience', 'Current Company', 'LinkedIn', 'Status',
            'Assigned Recruiter', 'Applied At'
        ])

        for app in self.get_queryset():
            writer.writerow([
                app.candidate_name,
                app.email,
                app.phone,
                app.vacancy.title if app.vacancy else 'General',
                app.experience_years,
                app.current_company,
                app.linkedin_url,
                app.status,
                app.assigned_recruiter.username if app.assigned_recruiter else 'Unassigned',
                app.applied_at.strftime('%Y-%m-%d %H:%M')
            ])
        return response


# =============================================================================
# MODULE 9: INSIGHTS MANAGEMENT
# =============================================================================
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        art = serializer.save()
        create_audit(self.request, 'CREATE_ARTICLE', 'Insights', f"Created article '{art.title}'")

    def perform_update(self, serializer):
        art = serializer.save()
        create_audit(self.request, 'UPDATE_ARTICLE', 'Insights', f"Updated article '{art.title}'")


# =============================================================================
# MODULE 10: MEDIA LIBRARY
# =============================================================================
class MediaItemViewSet(viewsets.ModelViewSet):
    queryset = MediaItem.objects.all()
    serializer_class = MediaItemSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        item = serializer.save(uploaded_by=user)
        create_audit(self.request, 'UPLOAD_MEDIA', 'Media', f"Uploaded file {item.title} ({item.file_type})")

    def perform_destroy(self, instance):
        title = instance.title
        instance.delete()
        create_audit(self.request, 'DELETE_MEDIA', 'Media', f"Deleted media file {title}", 'WARNING')


# =============================================================================
# MODULE 11: SEO MANAGEMENT & REDIRECTS
# =============================================================================
class SEOSettingViewSet(viewsets.ModelViewSet):
    queryset = SEOSetting.objects.all()
    serializer_class = SEOSettingSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        setting, _ = SEOSetting.objects.get_or_create(id=1)
        serializer = self.get_serializer(setting)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        setting, _ = SEOSetting.objects.get_or_create(id=1)
        serializer = self.get_serializer(setting, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        create_audit(request, 'UPDATE_SEO', 'SEO', "Updated global SEO configurations")
        return Response(serializer.data)


class RedirectRuleViewSet(viewsets.ModelViewSet):
    queryset = RedirectRule.objects.all()
    serializer_class = RedirectRuleSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        rule = serializer.save()
        create_audit(self.request, 'CREATE_REDIRECT', 'SEO', f"Created redirect: {rule.source_path} -> {rule.target_path}")


# =============================================================================
# MODULE 12: WEBSITE SETTINGS
# =============================================================================
class WebsiteSettingViewSet(viewsets.ModelViewSet):
    queryset = WebsiteSetting.objects.all()
    serializer_class = WebsiteSettingSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        setting, _ = WebsiteSetting.objects.get_or_create(id=1)
        serializer = self.get_serializer(setting)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        setting, _ = WebsiteSetting.objects.get_or_create(id=1)
        serializer = self.get_serializer(setting, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        create_audit(request, 'UPDATE_SETTINGS', 'Settings', "Updated corporate website settings")
        return Response(serializer.data)


# =============================================================================
# MODULE 13: REPORTS
# =============================================================================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def reports_summary(request):
    # Industry breakdown
    ind_data = Enquiry.objects.values('industry').annotate(total=Count('id')).order_by('-total')
    # Country breakdown
    country_data = Enquiry.objects.values('country').annotate(total=Count('id')).order_by('-total')
    # Service / Type breakdown
    type_data = Enquiry.objects.values('enquiry_type').annotate(total=Count('id')).order_by('-total')
    # Career status breakdown
    career_status = JobApplication.objects.values('status').annotate(total=Count('id')).order_by('-total')

    return Response({
        'by_industry': list(ind_data),
        'by_country': list(country_data),
        'by_type': list(type_data),
        'by_career_status': list(career_status),
    })


# =============================================================================
# MODULE 14: AUDIT LOGS
# =============================================================================
class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = AuditLog.objects.all()
        module = self.request.query_params.get('module')
        action_name = self.request.query_params.get('action')
        search_q = self.request.query_params.get('search')
        if module:
            qs = qs.filter(module__iexact=module)
        if action_name:
            qs = qs.filter(action__icontains=action_name)
        if search_q:
            qs = qs.filter(Q(username__icontains=search_q) | Q(details__icontains=search_q))
        return qs

    @action(detail=False, methods=['post', 'delete'])
    def clear_logs(self, request):
        count = AuditLog.objects.count()
        AuditLog.objects.all().delete()
        create_audit(request, 'PURGE_AUDIT_LOGS', 'Audit', f"Purged {count} institutional audit log records", 'WARNING')
        return Response({'detail': f'Successfully cleared {count} audit logs.', 'cleared_count': count})
