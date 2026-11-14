import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'a8fusion_backend.settings')

import django
django.setup()

from api.models import JobVacancy, JobApplication

vacancies_data = [
    {
        'title': 'Lead Enterprise Systems Architect',
        'slug': 'lead-enterprise-systems-architect',
        'department': 'Architecture & Engineering',
        'location': 'Singapore / Hybrid',
        'job_type': 'Full-Time Executive',
        'experience': '10+ Years',
        'openings': 2,
        'overview': 'Seeking an exceptional Principal Architect to oversee multi-tenant enterprise core platforms and mission-critical cloud topologies for international banking and government clients.',
        'responsibilities': [
            'Design fault-tolerant, high-concurrency microservice architectures with zero single points of failure.',
            'Author formal Architecture Decision Records (ADRs) and lead technical governance reviews.',
            'Guide cross-functional engineering squads across distributed development centers.',
            'Serve as executive technical advisor during client architecture alignment workshops.'
        ],
        'requirements': [
            'Demonstrated track record designing large-scale distributed systems in Java / Go / Rust.',
            'Deep mastery of Kubernetes, event streaming (Kafka/Pulsar), and distributed database consistency models.',
            'Previous experience delivering high-compliance enterprise software in banking, defense, or sovereign government.'
        ],
        'status': 'Published'
    },
    {
        'title': 'Senior AI / ML Research Engineer (Private LLMs & RAG)',
        'slug': 'senior-ai-ml-research-engineer',
        'department': 'Artificial Intelligence Practice',
        'location': 'London, UK / Remote EMEA',
        'job_type': 'Full-Time',
        'experience': '6+ Years',
        'openings': 2,
        'overview': 'Join our Sovereign AI team to fine-tune open-weights models and architect enterprise retrieval-augmented generation (RAG) pipelines operating on air-gapped VPCs.',
        'responsibilities': [
            'Implement private LLM inferencing pipelines using vLLM, TensorRT-LLM, and vector search clusters.',
            'Develop deterministic hallucination detection and prompt-injection guardrails for enterprise data.',
            'Optimize embedding pipelines across structured SQL repositories and unstructured document vaults.'
        ],
        'requirements': [
            'Strong proficiency in Python, PyTorch, Hugging Face transformers, and vector databases (Qdrant / Milvus).',
            'Solid mathematical foundation in linear algebra, attention mechanisms, and information retrieval.',
            'Experience deploying containerized machine learning models in production Kubernetes clusters.'
        ],
        'status': 'Published'
    },
    {
        'title': 'Enterprise ERP Implementation Lead',
        'slug': 'enterprise-erp-implementation-lead',
        'department': 'Enterprise Solutions',
        'location': 'Dubai, UAE / On-Site Client Engagements',
        'job_type': 'Full-Time',
        'experience': '8+ Years',
        'openings': 3,
        'overview': 'Lead the scoping, gap analysis, and deployment of A8 Enterprise ERP across multinational industrial conglomerates and state utilities.',
        'responsibilities': [
            'Conduct detailed business process analysis across procurement, finance, inventory, and HR functions.',
            'Coordinate data migration strategies from legacy SAP/Oracle systems to modern A8Fusion platforms.',
            'Manage multi-stakeholder project milestones, steering committee reviews, and user acceptance testing (UAT).'
        ],
        'requirements': [
            'Extensive background in enterprise ERP implementations (SAP, Oracle, NetSuite, Microsoft Dynamics).',
            'Flawless stakeholder communication skills and deep understanding of multi-currency accounting standards.',
            'PMP, PRINCE2, or equivalent enterprise project management certification.'
        ],
        'status': 'Published'
    },
    {
        'title': 'Senior Cybersecurity & Zero-Trust Engineer',
        'slug': 'senior-cybersecurity-zero-trust-engineer',
        'department': 'Cybersecurity Practice',
        'location': 'Singapore / Remote APAC',
        'job_type': 'Full-Time',
        'experience': '7+ Years',
        'openings': 2,
        'overview': 'Architect and audit zero-trust security postures, PKI infrastructure, and identity governance across multi-cloud and sovereign deployments.',
        'responsibilities': [
            'Design micro-segmented zero-trust network boundaries and mutual TLS authentication across service meshes.',
            'Perform rigorous application security assessments (SAST/DAST) and red-team simulation scenarios.',
            'Ensure institutional compliance with ISO 27001, SOC 2 Type II, and sovereign data localization laws.'
        ],
        'requirements': [
            'Hands-on mastery of HashiCorp Vault, Keycloak/Okta, Open Policy Agent (OPA), and network firewalls.',
            'CISSP, CISM, or OSCP certification preferred.',
            'Thorough understanding of cryptographic primitives, HSMs, and zero-knowledge architectures.'
        ],
        'status': 'Published'
    },
    {
        'title': 'Senior Frontend Systems Engineer (React & TypeScript)',
        'slug': 'senior-frontend-systems-engineer',
        'department': 'Architecture & Engineering',
        'location': 'Global Remote',
        'job_type': 'Full-Time',
        'experience': '5+ Years',
        'openings': 2,
        'overview': 'Craft pixel-perfect, high-performance web workstations, data visualizers, and institutional portals engineered with uncompromising accessibility and speed.',
        'responsibilities': [
            'Build robust, typed UI component libraries, real-time analytics visualizers, and responsive dashboards.',
            'Optimize client-side rendering performance, memory allocation, and bundle size.',
            'Collaborate with UI/UX researchers to convert complex enterprise workflows into intuitive, clean interfaces.'
        ],
        'requirements': [
            'Advanced mastery of modern React, TypeScript, Tailwind CSS, and state management architectures.',
            'Passion for typography, editorial aesthetics, visual hierarchy, and sub-second load times.',
            'Familiarity with WebSockets, Canvas, and high-frequency data streaming interfaces.'
        ],
        'status': 'Published'
    }
]

# Update old legacy slugs if present
legacy_mapping = {
    'principal-distributed-systems-architect': 'lead-enterprise-systems-architect',
    'senior-cryptography-security-engineer': 'senior-cybersecurity-zero-trust-engineer',
    'enterprise-erp-technical-lead': 'enterprise-erp-implementation-lead',
}

for old_slug, new_slug in legacy_mapping.items():
    try:
        old_obj = JobVacancy.objects.filter(slug=old_slug).first()
        if old_obj:
            old_obj.slug = new_slug
            old_obj.save()
            print(f"Migrated legacy slug '{old_slug}' -> '{new_slug}'")
    except Exception as e:
        print(f"Error mapping {old_slug}: {e}")

# Upsert all 5 current technical opportunities
for vdata in vacancies_data:
    obj, created = JobVacancy.objects.update_or_create(
        slug=vdata['slug'],
        defaults=vdata
    )
    status_str = "Created" if created else "Updated"
    print(f"✓ {status_str} Vacancy: {obj.id} - {obj.title} ({obj.slug})")

print(f"\nTotal JobVacancies in MySQL: {JobVacancy.objects.count()}")
for vac in JobVacancy.objects.all():
    print(f"  [{vac.id}] {vac.title} | {vac.department} | {vac.status} | {vac.openings} openings")

