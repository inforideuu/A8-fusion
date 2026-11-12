import os
import django
import sys
from datetime import date, timedelta
from django.utils import timezone

# Setup django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'a8fusion_backend.settings')
django.setup()

from api.models import (
    User, AuditLog, Page, Service, Solution, Industry,
    Enquiry, JobVacancy, JobApplication, Article,
    MediaItem, SEOSetting, RedirectRule, WebsiteSetting
)

def run_seed():
    print("🌱 Seeding A8Fusion MySQL Database...")

    # 1. Create Users & RBAC Roles
    users_data = [
        {
            'username': 'admin',
            'email': 'admin@a8fusion.com',
            'first_name': 'Chief',
            'last_name': 'Administrator',
            'password': 'AdminPassword@2026',
            'role': 'SUPER_ADMIN',
            'designation': 'Executive Vice President of Technology',
            'is_staff': True,
            'is_superuser': True,
        },
        {
            'username': 'webadmin',
            'email': 'webmaster@a8fusion.com',
            'first_name': 'Aarav',
            'last_name': 'Sharma',
            'password': 'AdminPassword@2026',
            'role': 'WEBSITE_ADMIN',
            'designation': 'Lead Systems Administrator',
            'is_staff': True,
        },
        {
            'username': 'contentmgr',
            'email': 'content@a8fusion.com',
            'first_name': 'Elena',
            'last_name': 'Rostova',
            'password': 'AdminPassword@2026',
            'role': 'CONTENT_MANAGER',
            'designation': 'Editorial & Content Director',
            'is_staff': True,
        },
        {
            'username': 'salesmgr',
            'email': 'sales@a8fusion.com',
            'first_name': 'Vikram',
            'last_name': 'Nair',
            'password': 'AdminPassword@2026',
            'role': 'SALES_MANAGER',
            'designation': 'Global Head of Enterprise Sales',
            'is_staff': True,
        },
        {
            'username': 'hrmgr',
            'email': 'hr@a8fusion.com',
            'first_name': 'Priya',
            'last_name': 'Menon',
            'password': 'AdminPassword@2026',
            'role': 'HR_MANAGER',
            'designation': 'Head of People & Global Talent',
            'is_staff': True,
        },
        {
            'username': 'bdmgr',
            'email': 'partnerships@a8fusion.com',
            'first_name': 'Marcus',
            'last_name': 'Vance',
            'password': 'AdminPassword@2026',
            'role': 'BD_MANAGER',
            'designation': 'Director of Strategic Alliances',
            'is_staff': True,
        },
    ]

    created_users = {}
    for u in users_data:
        user, created = User.objects.get_or_create(username=u['username'], defaults={
            'email': u['email'],
            'first_name': u['first_name'],
            'last_name': u['last_name'],
            'role': u['role'],
            'designation': u['designation'],
            'is_staff': u.get('is_staff', False),
            'is_superuser': u.get('is_superuser', False),
        })
        user.set_password(u['password'])
        user.save()
        created_users[u['username']] = user
        print(f"  ✓ User {u['username']} ({u['role']}) created/updated.")

    # 2. Website Settings
    web_setting, _ = WebsiteSetting.objects.get_or_create(id=1, defaults={
        'company_name': 'A8Fusion Private Limited',
        'tagline': 'Institutional Technology Architecture & Enterprise Software Platforms',
        'support_email': 'contact@a8fusion.com',
        'phone_primary': '+91 80 4123 4567',
        'corporate_address': 'A8Fusion Technology Tower, Outer Ring Road, Bangalore 560103, Karnataka, India',
        'social_linkedin': 'https://linkedin.com/company/a8fusion',
        'social_twitter': 'https://twitter.com/a8fusion',
        'social_github': 'https://github.com/a8fusion',
        'footer_copyright': '© 2026 A8Fusion Private Limited. All institutional rights reserved.',
        'cookie_banner_enabled': True,
        'cookie_banner_text': 'We use essential cookies to maintain institutional platform security, analyze systemic traffic, and ensure compliant operation.',
        'analytics_tracking_id': 'G-A8FUSION2026'
    })
    print("  ✓ Website Settings configured.")

    # 3. SEO Settings
    seo_setting, _ = SEOSetting.objects.get_or_create(id=1, defaults={
        'default_meta_title': 'A8Fusion | Institutional Technology Architecture & Enterprise Software Platforms',
        'default_meta_description': 'A8Fusion delivers mission-critical enterprise platforms, zero-trust cloud architectures, and sovereign digital systems for multinational corporations and state apparatuses.',
        'default_canonical_base': 'https://a8fusion.com',
        'sitemap_enabled': True,
        'google_search_console_token': 'google-site-verification=a8fusion_verified_token_2026',
        'robots_txt_content': "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://a8fusion.com/sitemap.xml"
    })
    print("  ✓ SEO Settings configured.")

    # 4. Redirect Rules
    redirects = [
        ('/home', '/', 301),
        ('/solutions/erp', '/solutions/erp-core-suite', 301),
        ('/contact-us', '/contact', 301),
    ]
    for src, tgt, code in redirects:
        RedirectRule.objects.get_or_create(source_path=src, defaults={'target_path': tgt, 'status_code': code})
    print("  ✓ Redirect rules verified.")

    # 5. Core Services
    services_data = [
        ('Custom Software Engineering', 'custom-software-engineering', 'ARCHITECTURAL RIGOR', 'Design and delivery of fault-tolerant distributed backends, microservice meshes, and high-concurrency event pipelines.', 'Cpu'),
        ('Enterprise Software Platforms', 'enterprise-software-platforms', 'MISSION-CRITICAL SUITES', 'Full-cycle engineering of multi-entity ERP, supply chain telemetry, and regulatory compliance platforms.', 'Layers'),
        ('Cloud & Sovereign Infrastructure', 'cloud-sovereign-infrastructure', 'ZERO-TRUST ARCHITECTURE', 'Immutable infrastructure as code, air-gapped sovereign cloud deployments, and multi-region failover matrices.', 'Cloud'),
        ('Cybersecurity & Zero-Trust', 'cybersecurity-zero-trust', 'MILITARY-GRADE DEFENSE', 'Hardware-rooted identity verifications, automated threat hunting, and end-to-end cryptographic integrity.', 'ShieldCheck'),
        ('AI & Algorithmic Automation', 'ai-algorithmic-automation', 'PREDICTIVE INTELLIGENCE', 'Deterministic machine learning models, private enterprise LLMs, and real-time operational decision engines.', 'BrainCircuit'),
        ('Legacy Modernization', 'legacy-modernization', 'STRANGLER FIG ARCHITECTURE', 'Zero-downtime decomposition of monolithic mainframes into modular event-driven microservices.', 'RefreshCw'),
        ('Public Sector Digital Architecture', 'public-sector-digital-architecture', 'STATUTORY COMPLIANCE', 'Sovereign governance portals, civic registry backbones, and zero-compromise citizen data isolation.', 'Building2'),
    ]
    for idx, (title, slug, tag, desc, icon) in enumerate(services_data, 1):
        Service.objects.get_or_create(slug=slug, defaults={
            'title': title,
            'tag': tag,
            'short_desc': desc,
            'icon_name': icon,
            'order': idx,
            'is_published': True
        })
    print(f"  ✓ {len(services_data)} Services seeded.")

    # 6. Enterprise Solutions (8 Platforms)
    solutions_data = [
        ('ERP Core Suite', 'erp-core-suite', 'MULTI-ENTITY', 'Comprehensive enterprise resource planner unifying cross-border procurement, multi-currency ledgering, and sovereign tax compliance.', 'Active'),
        ('CRM Nexus Enterprise', 'crm-nexus-enterprise', 'B2B PIPELINE', 'Institutional relationship management suite architected for high-value government procurement and multinational contracts.', 'Active'),
        ('HRM Workforce Sovereign', 'hrm-workforce-sovereign', 'GLOBAL TALENT', 'Unified workforce governance system handling multinational biometric attendance, statutory payroll, and employee life cycles.', 'Active'),
        ('FinTech Ledger & Billing', 'fintech-ledger-billing', 'DOUBLE-ENTRY', 'Cryptographically verified general ledger engine capable of sub-millisecond transaction balancing and international settlement.', 'Active'),
        ('SCM Logistics Engine', 'scm-logistics-engine', 'TELEMETRY IOT', 'Cross-border freight telemetry and automated customs clearing pipeline engineered for multi-modal transport operators.', 'Active'),
        ('Document Archival Vault', 'document-archival-vault', 'AIR-GAPPED COMPLIANCE', 'Tamper-evident legal record retention system meeting SEC Rule 17a-4 and international data retention mandates.', 'Active'),
        ('Identity Governance Suite', 'identity-governance-suite', 'ZERO-TRUST IAM', 'Centralized federated authentication system enforcing role-based privileges, hardware keys, and continuous posture evaluation.', 'Active'),
        ('Public Services Hub', 'public-services-hub', 'G2C ARCHITECTURE', 'Resilient digital citizen interface providing high-availability public service dispatch, identity issuance, and tax collection.', 'Active'),
    ]
    for idx, (title, slug, badge, desc, stat) in enumerate(solutions_data, 1):
        Solution.objects.get_or_create(slug=slug, defaults={
            'title': title,
            'badge': badge,
            'short_desc': desc,
            'status': stat,
            'order': idx,
            'is_published': True
        })
    print(f"  ✓ {len(solutions_data)} Solutions seeded.")

    # 7. Industries
    industries_data = [
        ('Banking & Financial Services', 'banking-financial-services', 'Sub-millisecond trade processing, ISO 20022 messaging, and fault-tolerant core banking backbones.'),
        ('Healthcare & Life Sciences', 'healthcare-life-sciences', 'HIPAA/GDPR-compliant clinical telemetry pipelines and federated electronic health record hubs.'),
        ('Government & Public Sector', 'government-public-sector', 'Sovereign data governance, citizen services infrastructure, and zero-trust public identity networks.'),
        ('Manufacturing & Logistics', 'manufacturing-logistics', 'Predictive plant maintenance, IoT edge orchestration, and automated multimodal supply chain telemetry.'),
        ('Energy & Utilities', 'energy-utilities', 'Smart grid telemetry ingestion, supervisory SCADA isolation, and national power distribution balancing.'),
        ('Telecommunications', 'telecommunications', 'OSS/BSS billing convergence, 5G network slicing controllers, and high-throughput CDR mediation pipelines.'),
    ]
    for idx, (title, slug, ov) in enumerate(industries_data, 1):
        Industry.objects.get_or_create(slug=slug, defaults={
            'title': title,
            'overview': ov,
            'order': idx,
            'is_published': True
        })
    print(f"  ✓ {len(industries_data)} Industries seeded.")

    # 8. Sample CRM Enquiries
    enquiries_data = [
        {
            'enquiry_type': 'project',
            'full_name': 'Dr. Alexander Vance',
            'email': 'a.vance@nordic-apex.se',
            'phone': '+46 8 123 4567',
            'organization': 'Nordic Apex Infrastructure AB',
            'country': 'Sweden',
            'industry': 'Energy & Utilities',
            'estimated_budget': '$500,000 - $1,000,000',
            'timeframe': '3 - 6 Months',
            'message': 'Requiring high-resilience supervisory telemetry infrastructure for multi-station renewable grid monitoring.',
            'status': 'Negotiation',
            'priority': 'Urgent',
            'assigned': 'salesmgr'
        },
        {
            'enquiry_type': 'government',
            'full_name': 'Hon. Kenneth Okonjo',
            'email': 'k.okonjo@mict.gov.ng',
            'phone': '+234 9 461 4000',
            'organization': 'Federal Ministry of Communications',
            'country': 'Nigeria',
            'industry': 'Government & Public Sector',
            'estimated_budget': 'Over $1,000,000',
            'timeframe': '6 - 12 Months',
            'message': 'Tender evaluation for sovereign data repository and unified civil identity interoperability bridge.',
            'status': 'Proposal Sent',
            'priority': 'Urgent',
            'assigned': 'salesmgr'
        },
        {
            'enquiry_type': 'partnership',
            'full_name': 'Sophia Von Berg',
            'email': 's.vonberg@munich-core.de',
            'phone': '+49 89 2180 0',
            'organization': 'Munich Core Systems GmbH',
            'country': 'Germany',
            'industry': 'Banking & Financial Services',
            'estimated_budget': '$250,000 - $500,000',
            'timeframe': 'Immediate',
            'message': 'Exploring OEM partnership for integrating A8Fusion Double-Entry Ledger into regional European banking cores.',
            'status': 'Qualified',
            'priority': 'High',
            'assigned': 'bdmgr'
        },
        {
            'enquiry_type': 'project',
            'full_name': 'Rajeshwari Chidambaram',
            'email': 'r.chidambaram@bharatlogistics.in',
            'phone': '+91 44 2855 9000',
            'organization': 'Bharat Multi-Modal Logistics Ltd',
            'country': 'India',
            'industry': 'Manufacturing & Logistics',
            'estimated_budget': '$100,000 - $250,000',
            'timeframe': '3 - 6 Months',
            'message': 'Seeking enterprise supply chain telemetry platform across 48 automated inland distribution centers.',
            'status': 'Contacted',
            'priority': 'Medium',
            'assigned': 'salesmgr'
        },
        {
            'enquiry_type': 'general',
            'full_name': 'David Chen',
            'email': 'david.chen@pacific-fin.sg',
            'phone': '+65 6789 0123',
            'organization': 'Pacific Capital Partners',
            'country': 'Singapore',
            'industry': 'Banking & Financial Services',
            'estimated_budget': '$50,000 - $100,000',
            'timeframe': 'Flexible',
            'message': 'Inquiry regarding zero-trust identity federation licensing and compliance audits for MAS regulations.',
            'status': 'New',
            'priority': 'Low',
            'assigned': 'salesmgr'
        },
        {
            'enquiry_type': 'project',
            'full_name': 'Beatriz Silva',
            'email': 'b.silva@saopaulo-health.br',
            'phone': '+55 11 3061 7000',
            'organization': 'Hospital das Clinicas Network',
            'country': 'Brazil',
            'industry': 'Healthcare & Life Sciences',
            'estimated_budget': '$500,000 - $1,000,000',
            'timeframe': '3 - 6 Months',
            'message': 'Implementation of federated EHR data pipeline with strict LGPD compliance for 14 hospital branches.',
            'status': 'Won',
            'priority': 'High',
            'assigned': 'salesmgr'
        },
    ]

    for item in enquiries_data:
        assigned_user = created_users.get(item.pop('assigned'))
        enq, _ = Enquiry.objects.get_or_create(email=item['email'], defaults={
            **item,
            'assigned_to': assigned_user,
            'internal_notes': f"Institutional evaluation initiated. Priority: {item['priority']}",
            'follow_up_date': date.today() + timedelta(days=7),
            'communication_history': [
                {
                    'date': (timezone.now() - timedelta(days=1)).strftime('%Y-%m-%d %H:%M'),
                    'type': 'Email',
                    'author': 'System',
                    'summary': f"Initial enquiry received via corporate portal from {item['full_name']}."
                }
            ]
        })
    print(f"  ✓ {len(enquiries_data)} CRM Enquiries seeded.")

    # 9. Career Vacancies & Applications
    vacancies_data = [
        ('Principal Distributed Systems Architect', 'principal-distributed-systems-architect', 'Core Architecture', 'Bangalore, India / Hybrid', 'Full-Time', '10+ Years', 2, 'Lead architecture of high-throughput transactional backends and microservice fabrics.'),
        ('Senior Cryptography & Security Engineer', 'senior-cryptography-security-engineer', 'Information Security', 'Global / Remote', 'Full-Time', '6+ Years', 1, 'Design hardware-anchored identity primitives, Zero-Knowledge proofs, and zero-trust verification engines.'),
        ('Enterprise ERP Technical Lead', 'enterprise-erp-technical-lead', 'Enterprise Platforms', 'Bangalore, India', 'Full-Time', '8+ Years', 3, 'Spearhead database modeling, multi-branch transactional engines, and financial reconciliation systems.'),
    ]
    for title, slug, dept, loc, jtype, exp, openings, ov in vacancies_data:
        vac, _ = JobVacancy.objects.get_or_create(slug=slug, defaults={
            'title': title,
            'department': dept,
            'location': loc,
            'job_type': jtype,
            'experience': exp,
            'openings': openings,
            'overview': ov,
            'status': 'Published'
        })
    print(f"  ✓ {len(vacancies_data)} Job Vacancies seeded.")

    # Seed Job Application
    lead_vac = JobVacancy.objects.first()
    if lead_vac:
        JobApplication.objects.get_or_create(email='k.deshmukh@gmail.com', defaults={
            'vacancy': lead_vac,
            'candidate_name': 'Kavita Deshmukh',
            'phone': '+91 98765 43210',
            'experience_years': '11 Years',
            'current_company': 'Morgan Stanley Systems',
            'linkedin_url': 'https://linkedin.com/in/kavita-deshmukh-tech',
            'cover_letter': 'Excited to bring my decade of distributed systems and low-latency database expertise to A8Fusion.',
            'status': 'Interview',
            'assigned_recruiter': created_users.get('hrmgr'),
            'internal_notes': 'Technical screen completed with exceptional score. Advancing to architecture review.'
        })
    print("  ✓ Sample Job Application seeded.")

    # 10. Articles / Insights
    articles_data = [
        ('Architectural Rigor in Sovereign Cloud Implementations', 'architectural-rigor-sovereign-cloud', 'Cloud Architecture', 'A8Fusion Research', 'Principal Architect', '6 min read', 'Evaluating statutory data boundaries, cryptographic enclaves, and multi-region failover matrices.', 'Published'),
        ('Deterministic Double-Entry Ledgers at Scale', 'deterministic-double-entry-ledgers', 'Financial Engineering', 'Vikram Nair', 'FinTech Lead', '8 min read', 'Balancing ACID transactional guarantees with sub-millisecond throughput in multinational banking architectures.', 'Published'),
        ('Zero-Trust Identity Governance for Enterprise Conclaves', 'zero-trust-identity-governance', 'Cybersecurity', 'Marcus Vance', 'Security Director', '5 min read', 'Hardware security keys, biometric identity anchoring, and continuous posture evaluation.', 'Published'),
    ]
    for title, slug, cat, author, role, read_t, exc, stat in articles_data:
        Article.objects.get_or_create(slug=slug, defaults={
            'title': title,
            'category': cat,
            'author_name': author,
            'author_role': role,
            'read_time': read_t,
            'excerpt': exc,
            'content': f"Detailed analysis regarding {title}. Engineered for institutional decision-makers.",
            'status': stat
        })
    print(f"  ✓ {len(articles_data)} Articles seeded.")

    # 11. Initial Audit Logs
    AuditLog.objects.get_or_create(action='SYSTEM_INIT', defaults={
        'user': created_users.get('admin'),
        'username': 'admin',
        'module': 'System',
        'ip_address': '127.0.0.1',
        'details': 'A8Fusion Enterprise Backend & MySQL Database initialized successfully.',
        'status': 'SUCCESS'
    })
    print("  ✓ Audit Log initialized.")

    print("\n✅ Database Seeding Completed Successfully! All 14 Modules Ready.")

if __name__ == '__main__':
    run_seed()

