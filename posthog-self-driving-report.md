# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for the Skild web application. Session Replay, Error Tracking, and Support were enabled server-side; health, error, and Support signal sources are enabled; and two Replay Vision monitors now send corroborated findings to the inbox.

Fresh scout configurations and scanners start being picked up within about 30 minutes. Findings will appear in the [Self-driving inbox](https://us.posthog.com/project/594857/inbox).

## AI data processing

Approved by the wizard's organization-level gate before this setup began.

## GitHub

The PostHog GitHub App was already connected before this setup. GitHub Issues was not selected as an inbox responder in this run.

## Project changes

The browser and server PostHog clients now use only configured environment values for the project token and host. The browser setup retains exception capture and does not disable session recording. This prevents an empty token or fallback host from silently disabling or misrouting analytics.

| File | Change |
|---|---|
| `src/routes/__root.tsx` | Removed the empty-token fallback and hard-coded UI-host fallback from the PostHog provider configuration. |
| `src/utils/posthog-server.ts` | Removed the hard-coded server host fallback; missing host configuration now behaves consistently with the existing missing-token guard. |
| `posthog-self-driving-report.md` | Created this setup record. |

## Products enabled

| Product | Result | Notes |
|---|---|---|
| Session Replay | enabled | Web SDK configuration does not disable recording. No recordings were available during setup; scanners are armed for the first recordings. |
| Error Tracking | enabled | Web SDK configuration retains `capture_exceptions: true`. |
| Support (Conversations) | enabled | Tickets require an inbound email, inbox, or Slack channel before any arrive. |

## Signal sources

| Source product | Source type | Action |
|---|---|---|
| `signals_scout` | `cross_source_issue` | Left at its server default: enabled. No opt-out row was created. |
| `health_checks` | `health_issue` | Enabled. |
| `error_tracking` | `issue_created` | Enabled. |
| `error_tracking` | `issue_reopened` | Enabled. |
| `error_tracking` | `issue_spiking` | Enabled. |
| `conversations` | `ticket` | Enabled; remains idle until a Support channel is connected. |
| `session_replay` | `session_analysis_cluster` | Deliberately skipped; Replay Vision scanners are the supported replay route. |

## Connected tools

No external-tool responder was selected. GitHub remains connected at the integration level, but the GitHub Issues responder was intentionally not enabled. Linear, Jira, Sentry, and Zendesk were not selected.

## Scout troop

The fleet was materialized and uses the server defaults of daily runs and emitting findings to the inbox.

| Status | Scout | Why |
|---|---|---|
| Enabled | `signals-scout-general` | Cross-product correlations and otherwise uncovered surfaces. |
| Enabled | `signals-scout-product-analytics` | Registry-flow and engagement regressions. |
| Enabled | `signals-scout-web-analytics` | Web traffic, attribution, landing-page, and 404 health. |
| Enabled | `signals-scout-health-checks` | Actionable PostHog setup health issues. |
| Disabled | 23 other built-in scouts | Their product surfaces are not evidenced as active here, are not currently needed, or are routed elsewhere. |
| Disabled / covered elsewhere | `signals-scout-error-tracking` | Covered by the native Error Tracking responders. |
| Disabled / covered elsewhere | `signals-scout-session-replay` | Covered by the Replay Vision monitors below. |

The enforced budget is **100 runs per day**; **0** had been used at setup time and **100** remained. The current banner states that scouts are early access and directs requests for additional runs to `team-self-driving@posthog.com`.

## Custom scouts

One focused candidate was proposed: a registry-engagement monitor that would watch the browse → open → install-command-copy path for traffic collapse or intent-to-use regression. This is a distinct discriminator from the built-in product-analytics scout, which watches saved conversion flows while entrants hold. The proposal was not selected, so no custom scouts were created.

Potential publisher-flow monitoring was ruled out because the repository currently exposes publish intent but not a concrete publish-success or failure event pair. If a custom scout is later noisy, set its configuration's `emit` value to `false` in PostHog to keep it in dry-run mode.

## Replay Vision scanners

A scanner is an LLM that reviews individual session recordings on a schedule and pushes clearly visible defects to the inbox. These are the only items in this setup that consume Replay Vision quota. Findings arrive at half weight and need independent corroboration before promotion into an inbox report.

| Status | Scanner | Watches | Query scope | Sampling | Estimate |
|---|---|---|---|---:|---|
| Created | **Broken registry experiences** | Visible failures while registry content is opened, skills are opened, publishing is started, or install commands are copied. | Sessions whose URL contains `/skills`, the registry browsing and publication area. | 0.5 | 0 monthly observations / 0 credits at setup because no recordings exist. |
| Created | **Registry user frustration** | Clear visible struggle while browsing, publishing, opening skills, copying commands, or using auth controls. | Sessions containing `$rageclick` only. | 1.0 | 0 monthly observations / 0 credits at setup because no recordings exist. |

The sizing guide was unavailable in this project, so monthly budget availability could not be independently checked; the created scanner responses nevertheless reported zero projected observations and zero projected credits because recordings are not yet present.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so the enabled Support responder can receive tickets.
- [ ] Generate real browser traffic and recordings; the two Replay Vision monitors will begin scanning automatically once recordings arrive.
- [ ] Optionally enable a connected-tool responder later if GitHub Issues, Linear, Jira, Sentry, Zendesk, or another supported system should create Self-driving reports.
- [ ] Review the disabled scouts in the inbox and enable a specialist when its matching product surface becomes active.

## What happens next

The scout coordinator picks up the fresh configurations within about 30 minutes. Scouts draw from the verified daily run budget, and Replay Vision monitors begin when recordings exist. Findings are clustered into reports in the [Self-driving inbox](https://us.posthog.com/project/594857/inbox); immediately actionable reports can then start coding tasks.
