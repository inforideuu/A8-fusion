"""
Django settings for a8fusion_backend project.
"""

from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-#=3(#2k+7xuq#hyu0z42^z*zics@2o_85c1ie$mao$&uu_^!tt'

DEBUG = True

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'a8fusion_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'a8fusion_backend.wsgi.application'

try:
    import certifi
    CA_PATH = certifi.where()
except ImportError:
    CA_PATH = None

# ==============================================================================
# ENVIRONMENT-AWARE DATABASE CONFIGURATION
# ==============================================================================
# Localhost / Dev: Uses local MySQL (127.0.0.1:3306, a8fusion, root/root)
# Live / Production: Uses TiDB Cloud Serverless MySQL (port 4000, SSL enabled)
#
# To activate TiDB Cloud (Live), set any of the following environment variables:
#   - IS_LIVE=true
#   - ENVIRONMENT=production
#   - DJANGO_ENV=production
#   - USE_TIDB=true
# Or deploy to Render, Railway, Vercel, PythonAnywhere, etc.
# ==============================================================================
IS_LIVE = (
    os.environ.get('IS_LIVE', '').lower() in ('true', '1', 'yes') or
    os.environ.get('ENVIRONMENT', '').lower() in ('production', 'prod', 'live') or
    os.environ.get('DJANGO_ENV', '').lower() in ('production', 'prod', 'live') or
    os.environ.get('USE_TIDB', '').lower() in ('true', '1', 'yes') or
    'RENDER' in os.environ or
    'RAILWAY_ENVIRONMENT' in os.environ or
    'VERCEL' in os.environ or
    'PYTHONANYWHERE_DOMAIN' in os.environ
)

if IS_LIVE:
    # Live Environment: TiDB Cloud Serverless MySQL
    tidb_options = {
        'charset': 'utf8mb4',
        'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
    }
    if CA_PATH:
        tidb_options['ssl'] = {'ca': CA_PATH}

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.environ.get('TIDB_DATABASE', os.environ.get('DB_NAME', 'sys')),
            'USER': os.environ.get('TIDB_USER', os.environ.get('DB_USER', '4G7bcrR8u73nZ6w.root')),
            'PASSWORD': os.environ.get('TIDB_PASSWORD', os.environ.get('DB_PASSWORD', 'UlByP7IIAKpIhNhD')),
            'HOST': os.environ.get('TIDB_HOST', os.environ.get('DB_HOST', 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com')),
            'PORT': int(os.environ.get('TIDB_PORT', os.environ.get('DB_PORT', 4000))),
            'OPTIONS': tidb_options,
        }
    }
else:
    # Local Environment: Local MySQL
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.environ.get('LOCAL_DB_NAME', 'a8fusion'),
            'USER': os.environ.get('LOCAL_DB_USER', 'root'),
            'PASSWORD': os.environ.get('LOCAL_DB_PASSWORD', 'root'),
            'HOST': os.environ.get('LOCAL_DB_HOST', '127.0.0.1'),
            'PORT': os.environ.get('LOCAL_DB_PORT', '3306'),
            'OPTIONS': {
                'charset': 'utf8mb4',
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            },
        }
    }

AUTH_USER_MODEL = 'api.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 6},
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}
