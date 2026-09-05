import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
	const token =
		process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
		import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
	const host =
		process.env.VITE_PUBLIC_POSTHOG_HOST ||
		import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

	if (!token) {
		if (import.meta.env.DEV) {
			throw new Error(
				"VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
			);
		}
		return null;
	}

	if (!host) {
		if (import.meta.env.DEV) {
			throw new Error(
				"VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured",
			);
		}
		return null;
	}

	if (!posthogClient) {
		posthogClient = new PostHog(token, {
			host,
			flushAt: 1,
			flushInterval: 0,
		});
	}
	return posthogClient;
}
