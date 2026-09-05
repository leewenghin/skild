import { createServerFn } from "@tanstack/react-start";
import { getSkills } from "#/dataconnect-generated";
import { dataConnect } from "#/lib/firebase";

export const getSkillsFn = createServerFn({ method: "GET" })
	.validator((limit: number) => limit)
	.handler(async ({ data: limit }) => {
		try {
			const { data } = await getSkills(dataConnect, {
				searchTerm: "",
				limit,
			});

			return data.skills;
		} catch (error) {
			console.error(error);
			return [];
		}
	});
