from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid

# =============================================================================
# MODULE 1 & 2: USER MANAGEMENT & ROLE-BASED ACCESS CONTROL (RBAC)
# =============================================================================
class User(AbstractUser):
    ROLE_CHOICES = (
        ('SUPER_ADMIN', 'Super Admin'),
        ('WEBSITE_ADMIN', 'Website Administrator'),
        ('CONTENT_MANAGER', 'Content Manager'),
        ('SALES_MANAGER', 'Sales Manager'),
        ('HR_MANAGER', 'HR Manager'),
        ('BD_MANAGER', 'Business Development Manager'),
    )

    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default='WEBSITE_ADMIN')
    phone = models.CharField(max_length=32, blank=True, null=True)
    designation = models.CharField(max_length=128, blank=True, null=True)
    avatar = models.CharField(max_length=512, blank=True, null=True)
    is_disabled = models.BooleanField(default=False)
    last_login_ip = models.CharField(max_length=64, blank=True, null=True)
    last_activity = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class RolePermission(models.Model):
    role = models.CharField(max_length=64, unique=True)
    role_name = models.CharField(max_length=128, blank=True)
    level = models.CharField(max_length=64, blank=True)
    description = models.TextField(blank=True)
    modules = models.JSONField(default=list)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.role} ({len(self.modules)} modules)"


# =============================================================================
# MODULE 14: AUDIT LOGS
# =============================================================================
class AuditLog(models.Model):
    STATUS_CHOICES = (
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('WARNING', 'Warning'),
    )

    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='audit_logs')
    username = models.CharField(max_length=150, blank=True, null=True)
    action = models.CharField(max_length=128) # LOGIN, FAILED_LOGIN, CREATE, UPDATE, DELETE, EXPORT
    module = models.CharField(max_length=64) # Users, Enquiry, Pages, Services, Solutions, etc.
    ip_address = models.CharField(max_length=64, default='127.0.0.1')
    details = models.TextField(blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='SUCCESS')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.created_at.strftime('%Y-%m-%d %H:%M')}] {self.action} by {self.username or 'System'}"


# =============================================================================
# MODULE 3: PAGE MANAGEMENT & NAVIGATION
# =============================================================================
class Page(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    heading = models.CharField(max_length=255, blank=True)
    subheading = models.TextField(blank=True)
    content = models.TextField(blank=True)
    hero_image = models.CharField(max_length=512, blank=True)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    canonical_url = models.CharField(max_length=512, blank=True)
    og_image = models.CharField(max_length=512, blank=True)
    is_published = models.BooleanField(default=True)
    in_navigation = models.BooleanField(default=False)
    nav_group = models.CharField(max_length=64, blank=True, default='Primary') # Header, Footer, Company
    nav_order = models.IntegerField(default=0)
    live_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['nav_order', 'title']

    def __str__(self):
        return self.title


# =============================================================================
# MODULE 4: SERVICES MANAGEMENT
# =============================================================================
class Service(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    tag = models.CharField(max_length=128)
    short_desc = models.TextField()
    full_desc = models.TextField(blank=True)
    icon_name = models.CharField(max_length=64, default='Cpu')
    image_url = models.CharField(max_length=512, blank=True)
    features = models.JSONField(default=list, blank=True)
    disciplines = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


# =============================================================================
# MODULE 5: SOLUTIONS MANAGEMENT
# =============================================================================
class Solution(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Maintenance', 'Maintenance'),
        ('Coming Soon', 'Coming Soon'),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    badge = models.CharField(max_length=64, default='ENTERPRISE')
    category = models.CharField(max_length=128, default='Core Systems')
    short_desc = models.TextField()
    overview = models.TextField(blank=True)
    modules = models.JSONField(default=list, blank=True)
    features = models.JSONField(default=list, blank=True)
    faqs = models.JSONField(default=list, blank=True)
    screenshots = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='Active')
    related_solutions = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


# =============================================================================
# MODULE 6: INDUSTRY MANAGEMENT
# =============================================================================
class Industry(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    tagline = models.CharField(max_length=255, blank=True)
    overview = models.TextField()
    challenges = models.JSONField(default=list, blank=True)
    solutions = models.JSONField(default=list, blank=True)
    highlights = models.JSONField(default=list, blank=True)
    image_url = models.CharField(max_length=512, blank=True)
    connected_solution_ids = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Industries'
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


# =============================================================================
# MODULE 7: ENQUIRY CRM
# =============================================================================
class Enquiry(models.Model):
    TYPE_CHOICES = (
        ('general', 'General Contact'),
        ('project', 'Enterprise Project'),
        ('government', 'Government & Public Sector'),
        ('partnership', 'Strategic Partnership'),
    )

    STATUS_CHOICES = (
        ('New', 'New'),
        ('Contacted', 'Contacted'),
        ('Qualified', 'Qualified'),
        ('Proposal Sent', 'Proposal Sent'),
        ('Negotiation', 'Negotiation'),
        ('Won', 'Won'),
        ('Lost', 'Lost'),
    )

    PRIORITY_CHOICES = (
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Urgent', 'Urgent'),
    )

    reference_code = models.CharField(max_length=32, unique=True, blank=True)
    enquiry_type = models.CharField(max_length=32, choices=TYPE_CHOICES, default='general')
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=64, blank=True)
    organization = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=128, default='India')
    industry = models.CharField(max_length=128, blank=True)
    estimated_budget = models.CharField(max_length=128, blank=True)
    timeframe = models.CharField(max_length=128, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='New')
    priority = models.CharField(max_length=16, choices=PRIORITY_CHOICES, default='Medium')
    
    assigned_to = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_enquiries')
    internal_notes = models.TextField(blank=True)
    follow_up_date = models.DateField(null=True, blank=True)
    communication_history = models.JSONField(default=list, blank=True)
    document_attachments = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.reference_code:
            self.reference_code = f"ENQ-{timezone.now().year}-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.reference_code}] {self.full_name} ({self.organization or 'Private'})"


# =============================================================================
# MODULE 8: CAREERS MANAGEMENT
# =============================================================================
class JobVacancy(models.Model):
    STATUS_CHOICES = (
        ('Published', 'Published'),
        ('Draft', 'Draft'),
        ('Closed', 'Closed'),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    department = models.CharField(max_length=128)
    location = models.CharField(max_length=128, default='Bangalore, India')
    job_type = models.CharField(max_length=64, default='Full-Time')
    experience = models.CharField(max_length=64, default='3-5 Years')
    openings = models.IntegerField(default=1)
    overview = models.TextField()
    responsibilities = models.JSONField(default=list, blank=True)
    requirements = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='Published')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class JobApplication(models.Model):
    STATUS_CHOICES = (
        ('New', 'New'),
        ('Screening', 'Screening'),
        ('Interview', 'Interview'),
        ('Offer', 'Offer'),
        ('Rejected', 'Rejected'),
    )

    vacancy = models.ForeignKey(JobVacancy, null=True, blank=True, on_delete=models.CASCADE, related_name='applications')
    candidate_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=64)
    experience_years = models.CharField(max_length=32, blank=True)
    current_company = models.CharField(max_length=255, blank=True)
    linkedin_url = models.CharField(max_length=512, blank=True)
    portfolio_url = models.CharField(max_length=512, blank=True)
    resume_url = models.CharField(max_length=512, blank=True)
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='New')
    assigned_recruiter = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='recruited_applications')
    internal_notes = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.candidate_name} - {self.vacancy.title if self.vacancy else 'General'}"


# =============================================================================
# MODULE 9: INSIGHTS MANAGEMENT
# =============================================================================
class Article(models.Model):
    STATUS_CHOICES = (
        ('Draft', 'Draft'),
        ('Scheduled', 'Scheduled'),
        ('Published', 'Published'),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    category = models.CharField(max_length=128, default='Architecture')
    author_name = models.CharField(max_length=128, default='A8Fusion Engineering Team')
    author_role = models.CharField(max_length=128, default='Principal Architect')
    read_time = models.CharField(max_length=32, default='6 min read')
    excerpt = models.TextField()
    content = models.TextField()
    cover_image = models.CharField(max_length=512, blank=True)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='Published')
    published_date = models.DateField(default=timezone.now)
    scheduled_for = models.DateTimeField(null=True, blank=True)
    seo_meta_title = models.CharField(max_length=255, blank=True)
    seo_meta_desc = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date', '-created_at']

    def __str__(self):
        return self.title


# =============================================================================
# MODULE 10: MEDIA LIBRARY
# =============================================================================
class MediaItem(models.Model):
    TYPE_CHOICES = (
        ('IMAGE', 'Image'),
        ('PDF', 'PDF'),
        ('BROCHURE', 'Brochure'),
        ('DOCUMENT', 'Document'),
    )

    title = models.CharField(max_length=255)
    file_url = models.CharField(max_length=512)
    file_type = models.CharField(max_length=32, choices=TYPE_CHOICES, default='IMAGE')
    category = models.CharField(max_length=64, default='General')
    file_size_kb = models.IntegerField(default=0)
    uploaded_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.title} ({self.file_type})"


# =============================================================================
# MODULE 11: SEO MANAGEMENT & REDIRECTS
# =============================================================================
class SEOSetting(models.Model):
    default_meta_title = models.CharField(max_length=255, default='A8Fusion | Institutional Technology Architecture')
    default_meta_description = models.TextField(default='Institutional technology architecture, enterprise software platforms, and sovereign digital solutions.')
    default_canonical_base = models.CharField(max_length=255, default='https://a8fusion.com')
    default_og_image = models.CharField(max_length=512, blank=True)
    robots_txt_content = models.TextField(default="User-agent: *\nAllow: /\nSitemap: https://a8fusion.com/sitemap.xml")
    sitemap_enabled = models.BooleanField(default=True)
    google_search_console_token = models.CharField(max_length=255, blank=True)
    schema_organization_json = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Global SEO Configuration"


class RedirectRule(models.Model):
    source_path = models.CharField(max_length=255, unique=True)
    target_path = models.CharField(max_length=255)
    status_code = models.IntegerField(default=301, choices=((301, '301 Permanent'), (302, '302 Temporary')))
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.source_path} -> {self.target_path} ({self.status_code})"


# =============================================================================
# MODULE 12: WEBSITE SETTINGS
# =============================================================================
class WebsiteSetting(models.Model):
    company_name = models.CharField(max_length=255, default='A8Fusion Private Limited')
    tagline = models.CharField(max_length=255, default='Enterprise Software Platforms & Engineering Architecture')
    logo_url = models.CharField(max_length=512, blank=True)
    support_email = models.EmailField(default='contact@a8fusion.com')
    phone_primary = models.CharField(max_length=64, default='+91 80 4123 4567')
    phone_secondary = models.CharField(max_length=64, blank=True)
    corporate_address = models.TextField(default='A8Fusion Technology Tower, Outer Ring Road, Bangalore 560103, Karnataka, India')
    social_linkedin = models.CharField(max_length=255, default='https://linkedin.com/company/a8fusion')
    social_twitter = models.CharField(max_length=255, default='https://twitter.com/a8fusion')
    social_github = models.CharField(max_length=255, default='https://github.com/a8fusion')
    smtp_host = models.CharField(max_length=128, blank=True)
    smtp_port = models.IntegerField(default=587)
    smtp_user = models.CharField(max_length=128, blank=True)
    footer_copyright = models.CharField(max_length=255, default='© 2026 A8Fusion Private Limited. All institutional rights reserved.')
    cookie_banner_enabled = models.BooleanField(default=True)
    cookie_banner_text = models.TextField(default='We use essential cookies to maintain institutional platform security, analyze systemic traffic, and ensure compliant operation.')
    analytics_tracking_id = models.CharField(max_length=128, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name
