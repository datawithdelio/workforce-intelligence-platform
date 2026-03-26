# Submission Guide

For class submission, include:

- a single PDF containing screenshots of the login flow, dashboard, employee pages, approvals, notifications, admin pages, and DS/risk-score views
- a zip file with the final source code
- a short writeup explaining why the app is a good fit for SESMag personas, especially DAV

Prepared writeup:

- use [SESMag-writeup.md](/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/docs/SESMag-writeup.md) as the starting point for the paragraph you submit

Suggested screenshots:

- login page
- dashboard KPI cards
- dashboard main insight card
- employee directory
- employee profile page
- profile edit / change-request flow
- approval queue and approval detail
- notifications page
- admin users page
- engagement risk dashboard

Recommended screenshot order:

1. [Landing page](/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/apps/web/app/page.tsx)
2. [Login page](/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/apps/web/app/login/page.tsx)
3. [Dashboard](/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/apps/web/app/dashboard/page.tsx)
4. [Employee directory](/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/apps/web/app/employees/page.tsx)
5. [Employee profile](/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/apps/web/app/employees/[id]/page.tsx)
6. [Profile edit flow](/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/apps/web/app/employees/[id]/edit/page.tsx)
7. [Profile history](/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/apps/web/app/employees/[id]/history/page.tsx)
8. [Approval queue](/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/apps/web/app/approvals/page.tsx)
9. [Approval detail](/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/apps/web/app/approvals/[id]/page.tsx)
10. [Notifications](/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/apps/web/app/notifications/page.tsx)
11. [Admin users](/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/apps/web/app/admin/users/page.tsx)
12. [AI scores dashboard](/Users/deliorincon/Desktop/pipeline/workforce-intelligence-platform/apps/web/app/admin/scores/page.tsx)

Helpful demo credentials:

- `admin@example.com` / `password123`
- `olivia.james@example.com` / `password123`

Source zip target:

- create `workforce-intelligence-platform-source.zip`
- exclude `node_modules`, `.next`, `.turbo`, `.venv`, and local cache folders
