import {
  DEFAULT_SCORING_RULES,
  type GradeCode,
  type House,
  type HouseStanding,
  type ItemKind,
  type ResultEntry,
  type ScoringRules,
} from "../../lib/types";

export function suggestGrade(
  marks: number | null | undefined,
  rules: ScoringRules = DEFAULT_SCORING_RULES,
): GradeCode | null {
  if (marks == null || Number.isNaN(marks)) return null;
  const pct = (marks / rules.max_marks) * 100;
  if (pct >= rules.grade_thresholds.A) return "A";
  if (pct >= rules.grade_thresholds.B) return "B";
  if (pct >= rules.grade_thresholds.C) return "C";
  return null;
}

export function computeEntryPoints(input: {
  grade: GradeCode | null;
  rank: number | null;
  itemKind: ItemKind;
  rules?: ScoringRules;
}): number {
  const rules = input.rules ?? DEFAULT_SCORING_RULES;
  let points = 0;
  if (input.grade) {
    points += rules.grade_points[input.grade] ?? 0;
  }
  if (input.rank === 1 || input.rank === 2 || input.rank === 3) {
    const key = String(input.rank) as "1" | "2" | "3";
    points += rules.rank_points[key] ?? 0;
  }
  const multiplier =
    input.itemKind === "group" ? rules.group_multiplier : 1;
  return points * multiplier;
}

export type StandingInputEntry = Pick<
  ResultEntry,
  "house_id" | "grade" | "rank" | "points"
>;

export function computeHouseStandings(
  entries: StandingInputEntry[],
  houses: House[],
): HouseStanding[] {
  const byHouse = new Map<
    string,
    {
      total_points: number;
      grade_a_count: number;
      grade_b_count: number;
      grade_c_count: number;
      wins_count: number;
    }
  >();

  for (const house of houses) {
    byHouse.set(house.id, {
      total_points: 0,
      grade_a_count: 0,
      grade_b_count: 0,
      grade_c_count: 0,
      wins_count: 0,
    });
  }

  for (const entry of entries) {
    let bucket = byHouse.get(entry.house_id);
    if (!bucket) {
      bucket = {
        total_points: 0,
        grade_a_count: 0,
        grade_b_count: 0,
        grade_c_count: 0,
        wins_count: 0,
      };
      byHouse.set(entry.house_id, bucket);
    }
    bucket.total_points += entry.points;
    if (entry.grade === "A") bucket.grade_a_count += 1;
    if (entry.grade === "B") bucket.grade_b_count += 1;
    if (entry.grade === "C") bucket.grade_c_count += 1;
    if (entry.rank === 1) bucket.wins_count += 1;
  }

  const ranked = houses
    .map((house) => {
      const stats = byHouse.get(house.id)!;
      return {
        house_id: house.id,
        house,
        ...stats,
        overall_rank: null as number | null,
      };
    })
    .sort((a, b) => {
      if (b.total_points !== a.total_points) return b.total_points - a.total_points;
      if (b.grade_a_count !== a.grade_a_count) return b.grade_a_count - a.grade_a_count;
      if (b.wins_count !== a.wins_count) return b.wins_count - a.wins_count;
      return a.house.name_en.localeCompare(b.house.name_en);
    });

  let lastPoints = Number.NaN;
  let lastRank = 0;
  ranked.forEach((row, index) => {
    if (row.total_points !== lastPoints) {
      lastRank = index + 1;
      lastPoints = row.total_points;
    }
    row.overall_rank = row.total_points > 0 ? lastRank : null;
  });

  return ranked;
}
