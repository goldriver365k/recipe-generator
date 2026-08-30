"use client";

import { useState } from "react";
import RecipeForm from "@/components/RecipeForm";
import RecipeResult from "@/components/RecipeResult";
import { findSampleRecipe } from "@/data/sampleRecipes";
import { scaleIngredientList } from "@/utils/calculateIngredients";
import { scaleSeasoningList } from "@/utils/calculateSeasonings";
import { scaleSteps, calculateTotalTimes } from "@/utils/calculateCookingTime";
import { generateRecipeWithAI, toScaledRecipe } from "@/utils/generateRecipeWithAI";
import type { ScaledRecipe } from "@/types/recipe";

type Status = "idle" | "loading" | "result" | "error";

export default function App() {
  const [status, setStatus] = useState<Status>("idle");
  const [recipe, setRecipe] = useState<ScaledRecipe | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(menuName: string, servings: number) {
    const baseRecipe = findSampleRecipe(menuName);

    // 준비된 샘플 레시피가 있으면 AI를 호출하지 않고 바로 계산한다. (비용 절감)
    if (baseRecipe) {
      const { totalCookingTimeLabel, totalTimeLabel } = calculateTotalTimes(
        baseRecipe.steps,
        servings
      );

      setRecipe({
        menuName: baseRecipe.menuName,
        baseServings: baseRecipe.baseServings,
        targetServings: servings,
        ingredients: scaleIngredientList(
          baseRecipe.ingredients,
          baseRecipe.baseServings,
          servings
        ),
        seasonings: scaleSeasoningList(
          baseRecipe.seasonings,
          baseRecipe.baseServings,
          servings
        ),
        steps: scaleSteps(baseRecipe.steps, servings),
        totalCookingTimeLabel,
        totalTimeLabel,
      });
      setStatus("result");
      return;
    }

    // 샘플에 없는 메뉴명은 AI가 생성한다.
    setStatus("loading");
    setErrorMessage("");
    try {
      const aiRecipe = await generateRecipeWithAI({ menuName, servings });
      setRecipe(toScaledRecipe(aiRecipe));
      setStatus("result");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "AI 레시피 생성에 실패했습니다."
      );
      setStatus("error");
    }
  }

  function handleReset() {
    setRecipe(null);
    setErrorMessage("");
    setStatus("idle");
  }

  return (
    <main className="flex min-h-screen justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-[600px]">
        <h1 className="mb-6 text-center text-xl font-extrabold text-gray-900">
          Recipe Generator
        </h1>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          {status === "result" && recipe && (
            <>
              <RecipeResult recipe={recipe} />
              <button
                type="button"
                onClick={handleReset}
                className="mt-6 w-full rounded-xl border border-gray-300 px-4 py-3 text-base font-semibold text-gray-700"
              >
                다른 메뉴 만들기
              </button>
            </>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center gap-3 py-10 text-gray-600">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
              <p className="text-base font-semibold">AI가 레시피를 만들고 있어요...</p>
            </div>
          )}

          {(status === "idle" || status === "error") && (
            <>
              <RecipeForm onSubmit={handleSubmit} />
              {status === "error" && (
                <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
