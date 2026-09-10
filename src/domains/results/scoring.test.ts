import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeEntryPoints,
  computeHouseStandings,
  suggestGrade,
} from "./scoring";
import { DEFAULT_SCORING_RULES, type House } from "../../lib/types";

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

describe("computeHouseStandings", () => {
  const houses: House[] = [
    {
      id: "a",
      slug: "blue-house",
      code: "BLU",
      name_en: "Blue House",
      name_ml: "Blue",
      short_name: "Blue",
      color: "blue",
    },
    {
      id: "b",
      slug: "red-house",
      code: "RED",
      name_en: "Red House",
      name_ml: "Red",
      short_name: "Red",
      color: "red",
    },
  ];

  it("matches the homepage example totals from published grades", () => {
    const entries = [
      ...Array.from({ length: 14 }, () => ({
        house_id: "a",
        grade: "A" as const,
        rank: 1,
        points: 5,
      })),
      ...Array.from({ length: 8 }, () => ({
        house_id: "a",
        grade: "B" as const,
        rank: 2,
        points: 3,
      })),
      ...Array.from({ length: 3 }, () => ({
        house_id: "a",
        grade: "C" as const,
        rank: 3,
        points: 1,
      })),
      {
        house_id: "b",
        grade: "A" as const,
        rank: 1,
        points: 5,
      },
    ];
    const standings = computeHouseStandings(entries, houses);
    assert.equal(standings[0].house_id, "a");
    assert.equal(standings[0].total_points, 97);
    assert.equal(standings[0].grade_a_count, 14);
    assert.equal(standings[0].grade_b_count, 8);
    assert.equal(standings[0].grade_c_count, 3);
    assert.equal(standings[0].overall_rank, 1);
    assert.equal(standings[1].overall_rank, 2);
  });

  it("ignores houses with zero published points for ranking display", () => {
    const standings = computeHouseStandings([], houses);
    assert.equal(standings[0].overall_rank, null);
    assert.equal(standings[0].total_points, 0);
  });
});
