/**
 * Cantidad de registros por feature/entidad.
 * Prioridad: CLI (--promoters=N) > env (SEED_PROMOTERS) > default de este archivo.
 *
 * Cuando agregues features, suma aquí la clave y léela en el runner.
 */
export type SeedCounts = {
  promoters: number;
  contributors: number;
  projects: number;
  goals: number;
  rewards: number;
  contributions: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  promoters: 10,
  contributors: 15,
  projects: 12,
  goals: 15,
  rewards: 15,
  contributions: 20,
};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };

  const envPromoters = process.env.SEED_PROMOTERS;
  if (envPromoters !== undefined && envPromoters !== "") {
    counts.promoters = Number(envPromoters);
  }
  const envContributors = process.env.SEED_CONTRIBUTORS;
  if (envContributors !== undefined && envContributors !== "") {
    counts.contributors = Number(envContributors);
  }
  const envProjects = process.env.SEED_PROJECTS;
  if (envProjects !== undefined && envProjects !== "") {
    counts.projects = Number(envProjects);
  }
    const envGoals = process.env.SEED_GOALS;
  if (envGoals !== undefined && envGoals !== "") {
    counts.goals = Number(envGoals);
  }
    const envRewards = process.env.SEED_REWARDS;
  if (envRewards !== undefined && envRewards !== "") {
    counts.rewards = Number(envRewards);
  }
    const envContributions = process.env.SEED_CONTRIBUTIONS;
  if (envContributions !== undefined && envContributions !== "") {
    counts.contributions = Number(envContributions);
  }
  for (const arg of argv) {
    const m = arg.match(/^--([a-zA-Z_]+)=(\d+)$/);
    if (!m) continue;
    const key = m[1] as keyof SeedCounts;
    const value = Number(m[2]);
    if (key in counts) {
      counts[key] = value;
    }
  }

  return counts;
}
