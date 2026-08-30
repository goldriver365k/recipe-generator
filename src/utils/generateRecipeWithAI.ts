import type { ScaledRecipe } from "@/types/recipe";

/**
 * AI 레시피 생성.
 *
 * 작업지시서 6번 규칙: mock 데이터(sampleRecipes)에 없는 메뉴명을 입력하면
 * 이 함수를 통해 AI가 레시피를 생성한다. 실제 AI 호출(OpenAI API)은
 * 클라이언트에 API 키를 노출하지 않기 위해 서버 라우트
 * (app/api/generate-recipe/route.ts)에서만 이루어지고, 이 함수는 그 라우트를
 * fetch로 호출하는 역할만 한다.
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

/** /api/generate-recipe 를 호출해 AI가 생성한 레시피(JSON)를 받아온다. */
export async function generateRecipeWithAI(
  request: AIRecipeRequest
): Promise<AIRecipeResponse> {
  const response = await fetch("/api/generate-recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      typeof data?.error === "string" ? data.error : "AI 레시피 생성에 실패했습니다.";
    throw new Error(message);
  }

  return data as AIRecipeResponse;
}

/** AI 응답(JSON)을 화면에 그대로 출력할 수 있는 ScaledRecipe 형태로 변환한다. */
export function toScaledRecipe(ai: AIRecipeResponse): ScaledRecipe {
  return {
    menuName: ai.menuName,
    baseServings: ai.servings,
    targetServings: ai.servings,
    ingredients: ai.ingredients,
    seasonings: ai.seasonings,
    steps: ai.steps.map((step) => ({
      step: step.step,
      title: step.title,
      description: step.description,
      timeLabel: step.time,
    })),
    totalCookingTimeLabel: ai.totalCookingTime,
    totalTimeLabel: ai.totalTime,
  };
}
