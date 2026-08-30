"use client";

import { useState } from "react";
import RecipeForm from "@/components/RecipeForm";
import RecipeResult from "@/components/RecipeResult";
import { findSampleRecipe, sampleRecipes } from "@/data/sampleRecipes";
import { scaleIngredientList } from "@/utils/calculateIngredients";
import { scaleSeasoningList } from "@/utils/calculateSeasonings";
import { scaleSteps, calculateTotalTimes } from "@/utils/calculateCookingTime";
import type { ScaledRecipe } from "@/types/recipe";

export default function App() {
  const [recipe, setRecipe] = useState<ScaledRecipe | null>(null);
  const [notFoundMenuName, setNotFoundMenuName] = useState<string | null>(null);

  function handleSubmit(menuName: string, servings: number) {
    const baseRecipe = findSampleRecipe(menuName);

    if (!baseRecipe) {
      // 1차 버전에서는 AI API를 호출하지 않는다. (작업지시서 6/7번 참고)
      // 실제 AI 연동은 src/utils/generateRecipeWithAI.ts 를 채우면 된다.
      setNotFoundMenuName(menuName);
      setRecipe(null);
      return;
    }

    const { totalCookingTimeLabel, totalTimeLabel } = calculateTotalTimes(
      baseRecipe.steps,
      servings
    );

    setNotFoundMenuName(null);
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
  }

  function handleReset() {
    setRecipe(null);
    setNotFoundMenuName(null);
  }

  return (
    <main className="flex min-h-screen justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-[600px]">
        <h1 className="mb-6 text-center text-xl font-extrabold text-gray-900">
          Recipe Generator
        </h1>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          {recipe ? (
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
          ) : (
            <>
              <RecipeForm onSubmit={handleSubmit} />
              {notFoundMenuName && (
                <p className="mt-4 text-sm text-gray-500">
                  &ldquo;{notFoundMenuName}&rdquo; 레시피는 아직 준비되어 있지 않아요. 지금은 샘플 메뉴(
                  {sampleRecipes.map((r) => r.menuName).join(", ")})만 만들 수 있어요.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
