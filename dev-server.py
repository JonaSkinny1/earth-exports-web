#!/usr/bin/env python3
"""Local preview server for Earth Exports that behaves like static hosts:
unknown paths get 404.html (F.R.A.N.K.'s empty cargo bay) with a real 404 status.
Plain `python -m http.server` can't do that; it shows its own error page.
Usage: python3 dev-server.py [port]   (default 8768, binds 0.0.0.0)
Netlify and Cloudflare Pages pick up 404.html automatically; nothing to configure there.
Every response carries Cache-Control: no-cache, so phones re-check files on each visit instead of reusing
stale CSS/JS (plain `python -m http.server` sends no cache header, and mobile browsers then guess)."""
import http.server, os, sys
ROOT = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()
    def send_error(self, code, message=None, explain=None):
        page = os.path.join(ROOT, "404.html")
        if code == 404 and os.path.exists(page):
            body = open(page, "rb").read()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8768
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    with http.server.ThreadingHTTPServer(("0.0.0.0", port), Handler) as srv:
        print(f"Earth Exports preview on http://127.0.0.1:{port}/ (custom 404 on)")
        srv.serve_forever()
