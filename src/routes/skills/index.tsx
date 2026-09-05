import { createFileRoute, Link } from "@tanstack/react-router";
import { SkillCard } from "#/components";
import { getSkillsFn } from "#/lib/skills";

export const Route = createFileRoute("/skills/")({
	component: SkillsPage,
	loader: () => getSkillsFn({ data: 50 }),
});

function SkillsPage() {
	const skills = Route.useLoaderData();

	return (
		<div id="skills-page">
			<div className="intro">
				<header>
					<h1>Skill Registry</h1>
					<p>Browse every published agent skill in creation order.</p>
				</header>
				<Link to="/skills/new" className="btn-primary">
					Publish Skill
				</Link>
			</div>

			<div className="results">
				{skills.length > 0 ? (
					<>
						<p>
							{skills.length} {skills.length === 1 ? "skill" : "skills"}{" "}
							available.
						</p>
						<div className="skills-grid">
							{skills.map((skill) => (
								<SkillCard key={skill.id} {...skill} />
							))}
						</div>
					</>
				) : (
					<p>No skills have been created yet.</p>
				)}
			</div>
		</div>
	);
}
