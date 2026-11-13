import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function RedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Skip on admin routes
    if (location.pathname.startsWith('/admin')) return;

    fetch('http://127.0.0.1:8000/api/seo/redirects/')
      .then(res => res.ok ? res.json() : null)
      .then(rules => {
        if (!Array.isArray(rules) || rules.length === 0) return;

        const currentPath = location.pathname.toLowerCase().replace(/\/$/, '') || '/';
        const match = rules.find(r => {
          if (!r.is_active) return false;
          const src = (r.source_path || '').trim().toLowerCase().replace(/\/$/, '') || '/';
          return src === currentPath;
        });

        if (match && match.target_path) {
          const target = match.target_path.trim();
          console.log(`[Redirect Routing] 301 Redirect executed: ${match.source_path} -> ${target}`);
          if (target.startsWith('http://') || target.startsWith('https://')) {
            window.location.replace(target);
          } else {
            navigate(target, { replace: true });
          }
        }
      })
      .catch(() => {});
  }, [location.pathname, navigate]);

  return null;
}

