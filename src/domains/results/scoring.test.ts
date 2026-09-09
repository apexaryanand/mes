import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeEntryPoints,
  computeSchoolStandings,
  suggestGrade,
} from "./scoring";
import { DEFAULT_SCORING_RULES, type School } from "../../lib/types";

describe("suggestGrade", () => {
  it("maps official Kalolsavam thresholds", () => {
    assert.equal(suggestGrade(80), "A");
    assert.equal(suggestGrade(79), "B");
    assert.equal(suggestGrade(70), "B");
    assert.equal(suggestGrade(69), "C");
    assert.equal(suggestGrade(60), "C");
    assert.equal(suggestGrade(59), null);
  });
});

describe("computeEntryPoints", () => {
  it("uses grade points only with default rules", () => {
    assert.equal(
      computeEntryPoints({ grade: "A", rank: 1, itemKind: "individual" }),
      5,
    );
    assert.equal(
      computeEntryPoints({ grade: "B", rank: 2, itemKind: "individual" }),
      3,
    );
    assert.equal(
      computeEntryPoints({ grade: "C", rank: 3, itemKind: "individual" }),
      1,
    );
  });

  it("applies optional rank points and group multiplier from config", () => {
    const rules = {
      ...DEFAULT_SCORING_RULES,
      rank_points: { "1": 5, "2": 3, "3": 1 },
      group_multiplier: 2,
    };
    assert.equal(
      computeEntryPoints({
        grade: "A",
        rank: 1,
        itemKind: "group",
        rules,
      }),
      20,
    );
  });
});

describe("computeSchoolStandings", () => {
  const schools: School[] = [
    {
      id: "a",
      slug: "a",
      code: "A",
      name_en: "School A",
      name_ml: "A",
      short_name: "A",
    },
    {
      id: "b",
      slug: "b",
      code: "B",
      name_en: "School B",
      name_ml: "B",
      short_name: "B",
    },
  ];

  it("matches the homepage example totals from published grades", () => {
    const entries = [
      ...Array.from({ length: 14 }, () => ({
        school_id: "a",
        grade: "A" as const,
        rank: 1,
        points: 5,
      })),
      ...Array.from({ length: 8 }, () => ({
        school_id: "a",
        grade: "B" as const,
        rank: 2,
        points: 3,
      })),
      ...Array.from({ length: 3 }, () => ({
        school_id: "a",
        grade: "C" as const,
        rank: 3,
        points: 1,
      })),
      {
        school_id: "b",
        grade: "A" as const,
        rank: 1,
        points: 5,
      },
    ];
    const standings = computeSchoolStandings(entries, schools);
    assert.equal(standings[0].school_id, "a");
    assert.equal(standings[0].total_points, 97);
    assert.equal(standings[0].grade_a_count, 14);
    assert.equal(standings[0].grade_b_count, 8);
    assert.equal(standings[0].grade_c_count, 3);
    assert.equal(standings[0].overall_rank, 1);
    assert.equal(standings[1].overall_rank, 2);
  });

  it("ignores schools with zero published points for ranking display", () => {
    const standings = computeSchoolStandings([], schools);
    assert.equal(standings[0].overall_rank, null);
    assert.equal(standings[0].total_points, 0);
  });
});
