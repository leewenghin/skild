import { Show } from "@clerk/tanstack-react-start";
import { usePostHog } from "@posthog/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { type FormEvent, useState } from "react";

export const Route = createFileRoute("/skills/new")({
	component: PublishSkill,
});

function PublishSkill() {
	return (
		<div id="new-skill">
			<Link to="/skills" className="back">
				<ArrowLeft size={16} />
				<span>Back to registry</span>
			</Link>

			<div className="intro">
				<h1>Publish a Skill</h1>
				<p>Share a reusable agent capability with the registry.</p>
			</div>

			<Show when="signed-out">
				<div className="card">
					<p>You must sign in before you can publish a skill.</p>
					<div className="card-actions">
						<Link to="/sign-in/$" className="btn-primary">
							Sign in
						</Link>
						<Link to="/skills" className="btn-secondary">
							Browse registry
						</Link>
					</div>
				</div>
			</Show>

			<Show when="signed-in">
				<PublishForm />
			</Show>
		</div>
	);
}

function PublishForm() {
	const posthog = usePostHog();
	const [submittedCommand, setSubmittedCommand] = useState<string | null>(null);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const title = String(form.get("title") ?? "").trim();
		const installCommand = String(form.get("installCommand") ?? "").trim();

		posthog.capture("publish_skill_submitted", {
			skill_title: title,
			install_command: installCommand,
		});
		setSubmittedCommand(installCommand);
	};

	if (submittedCommand !== null) {
		return (
			<div className="alert success">
				Draft received. Registry publishing is not yet connected, so{" "}
				<span>{submittedCommand || "your skill"}</span> is not live yet.
			</div>
		);
	}

	return (
		<form className="content" onSubmit={handleSubmit}>
			<div className="block">
				<div className="form-item">
					<label className="form-label" htmlFor="title">
						Title
					</label>
					<input
						id="title"
						name="title"
						className="input-field input-field-lg"
						placeholder="Performance Tuner"
						required
					/>
				</div>

				<div className="form-item">
					<label className="form-label" htmlFor="description">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						className="input-field input-field-textarea input-field-description"
						placeholder="What does this skill do?"
						required
					/>
				</div>

				<div className="form-item">
					<label className="form-label" htmlFor="tags">
						Tags
					</label>
					<span className="form-description">Separate tags with commas.</span>
					<input
						id="tags"
						name="tags"
						className="input-field input-field-sm"
						placeholder="engineering, ai-agent"
					/>
				</div>

				<div className="form-item">
					<label className="form-label" htmlFor="installCommand">
						Install command
					</label>
					<input
						id="installCommand"
						name="installCommand"
						className="input-field input-field-sm input-field-mono"
						placeholder="npx skild add performance-tuner"
						required
					/>
				</div>

				<div className="form-item">
					<label className="form-label" htmlFor="promptConfig">
						Prompt config
					</label>
					<textarea
						id="promptConfig"
						name="promptConfig"
						className="input-field input-field-textarea input-field-prompt input-field-mono"
						placeholder="You are a professional performance engineer."
						required
					/>
				</div>

				<div className="form-item">
					<label className="form-label" htmlFor="usageExample">
						Usage example
					</label>
					<textarea
						id="usageExample"
						name="usageExample"
						className="input-field input-field-textarea input-field-usage input-field-mono"
						placeholder="Review the code and optimize it."
						required
					/>
				</div>
			</div>

			<div className="actions">
				<button type="submit" className="btn-primary">
					Publish Skill
				</button>
				<Link to="/skills" className="btn-secondary">
					Cancel
				</Link>
			</div>
		</form>
	);
}
