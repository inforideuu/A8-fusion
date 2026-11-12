from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, AuditLog, Page, Service, Solution, Industry,
    Enquiry, JobVacancy, JobApplication, Article,
    MediaItem, SEOSetting, RedirectRule, WebsiteSetting
)

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_disabled', 'is_staff')
    list_filter = ('role', 'is_disabled', 'is_staff', 'is_superuser')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('A8Fusion Institutional Profile', {'fields': ('role', 'phone', 'designation', 'avatar', 'is_disabled', 'last_login_ip')}),
    )

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'action', 'module', 'username', 'ip_address', 'status')
    list_filter = ('module', 'status', 'created_at')
    search_fields = ('username', 'details', 'action')
    readonly_fields = [f.name for f in AuditLog._meta.fields]

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_published', 'in_navigation', 'nav_order', 'updated_at')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'tag', 'is_published', 'order', 'updated_at')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Solution)
class SolutionAdmin(admin.ModelAdmin):
    list_display = ('title', 'badge', 'category', 'status', 'is_published', 'order')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Industry)
class IndustryAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_published', 'order')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ('reference_code', 'full_name', 'enquiry_type', 'organization', 'status', 'priority', 'assigned_to', 'created_at')
    list_filter = ('enquiry_type', 'status', 'priority', 'country')
    search_fields = ('reference_code', 'full_name', 'email', 'organization')

@admin.register(JobVacancy)
class JobVacancyAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'location', 'status', 'created_at')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('candidate_name', 'vacancy', 'email', 'phone', 'status', 'assigned_recruiter', 'applied_at')
    list_filter = ('status', 'vacancy')

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author_name', 'status', 'published_date')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(MediaItem)
class MediaItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'file_type', 'category', 'file_size_kb', 'uploaded_at')

@admin.register(SEOSetting)
class SEOSettingAdmin(admin.ModelAdmin):
    list_display = ('default_meta_title', 'default_canonical_base', 'sitemap_enabled', 'updated_at')

@admin.register(RedirectRule)
class RedirectRuleAdmin(admin.ModelAdmin):
    list_display = ('source_path', 'target_path', 'status_code', 'is_active')

@admin.register(WebsiteSetting)
class WebsiteSettingAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'support_email', 'phone_primary', 'updated_at')
