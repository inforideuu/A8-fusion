from rest_framework import serializers
from .models import (
    User, RolePermission, AuditLog, Page, Service, Solution, Industry,
    Enquiry, JobVacancy, JobApplication, Article,
    MediaItem, SEOSetting, RedirectRule, WebsiteSetting
)

class RolePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolePermission
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'designation', 'avatar', 'is_disabled',
            'is_active', 'is_staff', 'is_superuser', 'last_login',
            'last_login_ip', 'last_activity', 'date_joined', 'password'
        ]
        read_only_fields = ['last_login', 'last_activity', 'date_joined']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class SolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solution
        fields = '__all__'


class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = '__all__'


class EnquirySerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.SerializerMethodField()

    class Meta:
        model = Enquiry
        fields = '__all__'

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}".strip() or obj.assigned_to.username
        return None


class JobVacancySerializer(serializers.ModelSerializer):
    applications_count = serializers.SerializerMethodField()

    class Meta:
        model = JobVacancy
        fields = '__all__'

    def get_applications_count(self, obj):
        return obj.applications.count()


class JobApplicationSerializer(serializers.ModelSerializer):
    vacancy_title = serializers.SerializerMethodField()
    recruiter_name = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = '__all__'

    def get_vacancy_title(self, obj):
        return obj.vacancy.title if obj.vacancy else 'General Application'

    def get_recruiter_name(self, obj):
        if obj.assigned_recruiter:
            return f"{obj.assigned_recruiter.first_name} {obj.assigned_recruiter.last_name}".strip() or obj.assigned_recruiter.username
        return None


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'


class MediaItemSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = MediaItem
        fields = '__all__'

    def get_uploaded_by_name(self, obj):
        return obj.uploaded_by.username if obj.uploaded_by else 'Admin'


class SEOSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEOSetting
        fields = '__all__'


class RedirectRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RedirectRule
        fields = '__all__'


class WebsiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteSetting
        fields = '__all__'

