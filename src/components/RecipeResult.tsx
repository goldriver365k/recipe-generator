import type { ScaledRecipe } from "@/types/recipe";
import IngredientList from "./IngredientList";
import CookingSteps from "./CookingSteps";

interface RecipeResultProps {
  recipe: ScaledRecipe;
}

/** 레시피 계산 결과 전체를 보여주는 카드 */
export default function RecipeResult({ recipe }: RecipeResultProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">{recipe.menuName}</h2>
        <p className="text-gray-500">{recipe.targetServings}인분 레시피</p>
      </div>

      <IngredientList title="재료" items={recipe.ingredients} />
      <IngredientList title="양념" items={recipe.seasonings} />
      <CookingSteps steps={recipe.steps} />

      <div className="flex flex-col gap-2 rounded-xl bg-gray-900 p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">예상 실제 조리시간</span>
          <span className="font-bold">{recipe.totalCookingTimeLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">숙성 포함 총 소요시간</span>
          <span className="font-bold">{recipe.totalTimeLabel}</span>
        </div>
      </div>
    </div>
  );
}
