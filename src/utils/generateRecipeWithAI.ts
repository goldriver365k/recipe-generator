import type { BaseRecipe } from "@/types/recipe";

/**
 * AI 레시피 생성 - 구조만 준비해 둔 자리(stub).
 *
 * 작업지시서 6/7번 규칙:
 *  - mock 데이터(sampleRecipes)에 없는 메뉴명을 입력하면 AI가 레시피를
 *    생성할 수 있는 "구조"만 만들어 둔다.
 *  - 개발 중 비용 절감을 위해 이번 1차 작업 범위에서는 실제 AI API를
 *    호출하지 않는다. 화면/계산 로직이 mock 데이터로 먼저 검증된 뒤,
 *    이 함수 내부만 실제 API 호출로 교체하면 된다.
 */

/** AI에게 전달하는 최소 입력 데이터 */
export interface AIRecipeRequest {
  menuName: string;
  servings: number;
}

/**
 * AI 응답으로 기대하는 JSON 형식.
 * (작업지시서 6번 예시와 동일한 구조)
 */
export interface AIRecipeResponse {
  menuName: string;
  servings: number;
  ingredients: { name: string; amount: number; unit: string }[];
  seasonings: { name: string; amount: number; unit: string }[];
  steps: {
    step: number;
    title: string;
    description: string;
    time: string;
  }[];
  totalCookingTime: string;
  totalTime: string;
}

/**
 * 실제 AI 호출부.
 * TODO: 이번 1차 작업 범위 이후, 여기에서 실제 AI API를 호출하고
 *       응답을 AIRecipeResponse(JSON)로 파싱하도록 구현한다.
 *
 * 지금은 mock 단계이므로 호출되지 않으며, 호출 시 명시적으로
 * "아직 지원하지 않음" 에러를 던진다.
 */
export async function generateRecipeWithAI(
  _request: AIRecipeRequest
): Promise<BaseRecipe> {
  throw new Error(
    "AI 레시피 생성은 아직 연결되어 있지 않습니다. (1차 버전은 mock 데이터만 지원)"
  );
}
