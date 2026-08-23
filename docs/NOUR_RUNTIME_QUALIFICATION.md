# NOUR Runtime Qualification

Canonical governing contract: https://app.notion.com/p/3c55bbcf367e8106b4abccf87c9252b5

The executable contract in `src/nour/qualification.mjs` is the gatekeeper layer. A production build must not call itself QUALIFIED until the live runtime uses it and the following are enforced end-to-end.

## Required runtime integration

- Persist `NourJourneyState` server-side by `journeyId` with customer isolation.
- Persist append-only journey events for Context → Decision → Customer Action → Evidence → State Update.
- Load current showroom context separately from historic customer journey memory.
- Route every live interaction through exactly one `nextBestAction`.
- Keep customer and staff projections separate.
- Wire staff interventions to Done / Not possible / Needs follow-up and feed result back into state.
- Enforce configuration validity outside the model.
- Enforce commercial authority outside the model.
- Version configurations and invalidate approval on material mutation.
- Require explicit approval of the current configuration version before order transition.
- Block only consequence-dependent actions when verification is missing; do not freeze unrelated browsing/configuration.
- Respect customer stop immediately.
- Preserve handoff context.
- Enforce customer isolation, purpose limitation, consent and room-image retention through backend controls.

## Release gate

**QUALIFIED** only when all critical tests pass in the deployed runtime.

**CONDITIONAL** only when remaining defects are non-consequential UX polish.

**FAILED** if any truth, privacy, configuration, approval, authority, persistence, customer-stop, or handoff invariant fails.
