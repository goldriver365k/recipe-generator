import type { ScaledRecipeStep } from "@/types/recipe";

interface CookingStepsProps {
  steps: ScaledRecipeStep[];
}

/** 조리방법을 단계별로, 각 단계의 예상 시간과 함께 보여준다. */
export default function CookingSteps({ steps }: CookingStepsProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-base font-bold text-gray-900">조리방법</h3>
      <ol className="flex flex-col gap-3">
        {steps.map((step) => (
          <li
            key={step.step}
            className="rounded-lg bg-gray-50 p-3 text-[15px]"
          >
            <p className="font-semibold text-gray-900">
              {step.step}. {step.title}
            </p>
            <p className="mt-1 text-gray-700">{step.description}</p>
            <p className="mt-2 text-sm text-gray-500">예상시간: {step.timeLabel}</p>
            {step.restTimeLabel && (
              <p className="text-sm text-gray-500">숙성시간: {step.restTimeLabel}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
