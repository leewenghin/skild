import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { getSkillsFn } from "#/lib/skills";
import { useCopyInstallCommand } from "#/lib/use-copy-install-command";
import { getSkillCategory } from "#/lib/utils";

export const Route = createFileRoute("/skills/$skillId")({
	component: SkillDetail,
	loader: async ({ params }) => {
		const skills = await getSkillsFn({ data: 50 });
		const skill = skills.find((item) => item.id === params.skillId);

		if (!skill) {
			throw notFound();
		}

		return skill;
	},
	notFoundComponent: SkillNotFound,
});

function SkillDetail() {
	const skill = Route.useLoaderData();
	const category = getSkillCategory(skill.tags);
	const { copied, handleCopy } = useCopyInstallCommand(skill.installCommand, {
		skillId: skill.id,
		skillTitle: skill.title,
		skillCategory: category,
	});

	return (
		<article id="skill-detail">
			<Link to="/skills" className="back">
				<ArrowLeft size={16} />
				<span>Back to registry</span>
			</Link>

			<header>
				<p className="category">{category}</p>
				<h1>{skill.title}</h1>
				<p className="lede">{skill.description}</p>
			</header>

			<section className="author">
				<img
					src={skill.author.imageUrl || "/logo512.png"}
					alt={`${skill.author.username} avatar`}
				/>
				<div>
					<p>{skill.author.username ?? skill.author.email}</p>
					<p>
						{skill.createdAt
							? new Date(skill.createdAt).toLocaleDateString()
							: "Unknown date"}
					</p>
				</div>
			</section>

			<section className="install">
				<h2>Install</h2>
				<div className="command">
					<div className="command-copy">
						<span>{">_"}</span>
						<p>{skill.installCommand}</p>
					</div>
					<button
						type="button"
						onClick={handleCopy}
						aria-label="Copy install command"
					>
						{copied ? <Check size={16} /> : <Copy size={16} />}
					</button>
				</div>
			</section>

			{skill.tags.length > 0 && (
				<section className="tags">
					<h2>Tags</h2>
					<ul>
						{skill.tags.map((tag) => (
							<li key={tag}>{tag}</li>
						))}
					</ul>
				</section>
			)}
		</article>
	);
}

function SkillNotFound() {
	return (
		<div id="skill-detail" className="missing">
			<h1>Skill not found</h1>
			<p>This skill does not exist or is no longer published.</p>
			<Link to="/skills" className="btn-primary">
				Back to registry
			</Link>
		</div>
	);
}
