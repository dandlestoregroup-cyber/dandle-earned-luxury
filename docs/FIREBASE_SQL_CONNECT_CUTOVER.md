# DANDLE/NOUR Firebase SQL Connect cutover

This directory is reviewable source preparation only. It does not establish a
Firebase project, create a SQL Connect service, provision Cloud SQL, migrate
data, switch runtime reads/writes, or prove Firebase Authentication. Production
remains on the single backend recorded in `config/data-backend-cutover.json`.

## Safety invariants

- Never deploy or provision without explicit spend approval and a verified
  project, service, instance, region, billing plan, migration and rollback.
- Keep `schemaValidation: COMPATIBLE`; do not use `STRICT` against an existing
  database because it can remove unmodeled objects.
- Do not enable dual production writes. Perform an isolated reconciliation and
  controlled cutover only after counts/checksums, auth, processor-authoritative
  payment behavior and rollback have passed.
- Public access is catalogue-read-only. Customer records require Firebase Auth
  and order reads are filtered by `auth.uid`. Commerce, payment, migration and
  operations writes are Admin-SDK-only (`NO_ACCESS`).
- Do not store PAN, CVV, provider secrets or raw credentials. Persist only
  sanitized processor evidence needed for idempotency and reconciliation.

## Required verification before production

1. Record the owner-approved billing decision and canonical Firebase project.
2. Verify the SQL Connect service and Cloud SQL instance/region are the intended
   targets; replace planned identifiers only with provider evidence.
3. Run the official SQL Connect emulator/compiler and generate both SDKs.
4. Exercise anonymous Firebase Auth, ownership filtering, negative cross-user
   access, catalogue reads and Admin-SDK-only mutation denial.
5. Import an isolated snapshot, reconcile row counts and checksums, and prove a
   rollback without touching the live authority.
6. Integrate the generated Admin SDK behind existing trusted server handlers;
   prove PayTabs verification, webhook replay/idempotency and operations retry.
7. Verify a safely isolated full production-equivalent read/write journey.
8. Only then attach evidence to every manifest gate. A separate reviewed change
   may switch both production reads and writes together; split authority and
   dual writes remain forbidden.

Run local source guards with `npm run verify:firebase-sql-connect`. The deploy
guard intentionally fails until explicit approval and every manifest gate are
present. It never deploys resources itself.
