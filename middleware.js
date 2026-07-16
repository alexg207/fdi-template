// Edge middleware: HTTP Basic Auth gate for the whole dashboard (incl.
// network-data.js) so the founder-shared link isn't wide open. The FDI engine
// sets FDI_DASHBOARD_PASSWORD as a project env var at deploy time; the username
// is always "primary". FAIL-CLOSED: if no password is configured, deny all.
// Zero-dependency, Web-standard Request/Response so it runs without a build step.
export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const expected = process.env.FDI_DASHBOARD_PASSWORD || '';
  if (!expected) {
    return new Response('Dashboard access is not configured.', { status: 401 });
  }
  const header = request.headers.get('authorization') || '';
  if (header.startsWith('Basic ')) {
    let decoded = '';
    try { decoded = atob(header.slice(6)); } catch (e) { decoded = ''; }
    const i = decoded.indexOf(':');
    const pass = i >= 0 ? decoded.slice(i + 1) : '';
    if (pass === expected) return; // authorized — continue to the static asset
  }
  return new Response('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Primary FDI", charset="UTF-8"' },
  });
}
