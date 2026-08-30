import type { IngredientItem } from "@/types/recipe";
import { roundAmount } from "./calculateIngredients";

/**
 * 양념(고추장, 고춧가루, 소금, 설탕 등) 1개 항목의 양을 환산한다.
 *
 * 작업지시서 4번 규칙: 양념은 재료와 달리 인원수가 늘어난다고 해서
 * 반드시 단순 배수로 늘려야 하는 것은 아니다(짠맛/매운맛은 인원수에
 * 정확히 비례하지 않는 경우가 많다). 지금은 계산 함수만 분리해 두고
 * 초기 버전에서는 재료와 동일한 단순 비례식을 사용한다.
 * 추후 이 함수 내부 로직만 바꾸면 전체 앱에 반영된다.
 */
export function calculateSeasoningAmount(
  baseAmount: number,
  baseServings: number,
  targetServings: number
): number {
  if (baseServings <= 0) return 0;
  // TODO: 대량 조리 시 양념 배율 보정(예: 배율에 따라 0.9~1x 가중치 적용)을
  //       이 자리에 추가한다. 지금은 단순 비례식.
  return (baseAmount / baseServings) * targetServings;
}

/** 양념 목록 전체를 목표 인원수에 맞게 환산한다. */
export function scaleSeasoningList(
  seasonings: IngredientItem[],
  baseServings: number,
  targetServings: number
): IngredientItem[] {
  return seasonings.map((item) => ({
    ...item,
    amount: roundAmount(
      calculateSeasoningAmount(item.amount, baseServings, targetServings),
      item.unit
    ),
  }));
}
