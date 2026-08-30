import type { IngredientItem } from "@/types/recipe";

/**
 * 재료 1개 항목의 양을 기준 인원수 → 목표 인원수 비율로 환산한다.
 *
 * 지금은 단순 비례식이지만, 재료(양념이 아닌 일반 재료)는 특성상
 * 대부분 인원수에 정비례해도 무방하므로 별도 로직 없이 그대로 둔다.
 * 양념 전용 보정이 필요할 경우를 위해 calculateSeasoningAmount()를 분리해 두었다.
 */
export function calculateIngredientAmount(
  baseAmount: number,
  baseServings: number,
  targetServings: number
): number {
  if (baseServings <= 0) return 0;
  return (baseAmount / baseServings) * targetServings;
}

/** 재료 양을 화면에 보여주기 좋은 형태로 반올림한다. (kg/L은 소수 1자리, 그 외는 정수) */
export function roundAmount(amount: number, unit: string): number {
  const isLargeUnit = unit === "kg" || unit === "L" || unit === "l";
  const precision = isLargeUnit ? 10 : 1;
  return Math.round(amount * precision) / precision;
}

/** 재료 목록 전체를 목표 인원수에 맞게 환산한다. */
export function scaleIngredientList(
  ingredients: IngredientItem[],
  baseServings: number,
  targetServings: number
): IngredientItem[] {
  return ingredients.map((item) => ({
    ...item,
    amount: roundAmount(
      calculateIngredientAmount(item.amount, baseServings, targetServings),
      item.unit
    ),
  }));
}
