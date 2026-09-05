import { usePostHog } from "@posthog/react";
import { useState } from "react";

type CopyMeta = {
	skillId: string;
	skillTitle: string;
	skillCategory: string;
};

export function useCopyInstallCommand(installCommand: string, meta: CopyMeta) {
	const posthog = usePostHog();
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(installCommand);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			posthog.capture("install_command_copied", {
				skill_id: meta.skillId,
				skill_title: meta.skillTitle,
				skill_category: meta.skillCategory,
				install_command: installCommand,
			});
		} catch {
			setCopied(false);
		}
	};

	return { copied, handleCopy };
}
