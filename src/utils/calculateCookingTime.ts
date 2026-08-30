import type { RecipeStep, ScaledRecipeStep } from "@/types/recipe";

/**
 * 인원수 구간별 조리시간 보정 배율.
 *
 * 작업지시서 5번 규칙: 인원수가 늘어난다고 조리시간이 같은 배수로
 * 늘어나지는 않는다(팬/솥 크기, 화력, 분할 조리 등의 영향). 초기 버전은
 * 아래 표를 그대로 쓰고, 실제 현장 데이터가 쌓이면 이 배열만 조정하면 된다.
 */
export const COOKING_TIME_MULTIPLIER_TIERS: {
  maxServings: number; // 이 인원수까지 적용 (Infinity면 초과 전체)
  multiplier: number;
}[] = [
  { maxServings: 10, multiplier: 1.0 }, // 1~10명
  { maxServings: 30, multiplier: 1.2 }, // 11~30명
  { maxServings: 50, multiplier: 1.4 }, // 31~50명
  { maxServings: 100, multiplier: 1.7 }, // 51~100명
  { maxServings: Infinity, multiplier: 2.0 }, // 100명 초과
];

/** 목표 인원수에 해당하는 보정 배율을 찾는다. */
export function getCookingTimeMultiplier(servings: number): number {
  const tier = COOKING_TIME_MULTIPLIER_TIERS.find(
    (t) => servings <= t.maxServings
  );
  return tier ? tier.multiplier : COOKING_TIME_MULTIPLIER_TIERS[COOKING_TIME_MULTIPLIER_TIERS.length - 1].multiplier;
}

/**
 * 조리시간 계산 함수.
 * 인원수(servings)와 기준 조리시간(baseTime, 분)을 받아
 * 인원수 구간 배율을 적용한 실제 조리시간(분)을 반환한다.
 * 소수점은 반올림한다.
 */
export function calculateCookingTime(servings: number, baseTime: number): number {
  const multiplier = getCookingTimeMultiplier(servings);
  return Math.round(baseTime * multiplier);
}

/** 분 단위 숫자를 "약 N분" 형태 문자열로 만든다. */
function formatMinutesLabel(minutes: number): string {
  return `약 ${minutes}분`;
}

/** 최소/최대 분 범위를 "약 N~M분" 또는 "약 N분" 형태 문자열로 만든다. */
function formatMinutesRangeLabel(min: number, max: number): string {
  return min === max ? `약 ${min}분` : `약 ${min}~${max}분`;
}

/** 단계 목록 전체에 인원수 배율을 적용해 화면 표시용 단계 목록을 만든다. */
export function scaleSteps(steps: RecipeStep[], servings: number): ScaledRecipeStep[] {
  return steps.map((step) => {
    const scaledMin = calculateCookingTime(servings, step.baseTimeMinutes.min);
    const scaledMax = calculateCookingTime(servings, step.baseTimeMinutes.max);

    return {
      step: step.step,
      title: step.title,
      description: step.description,
      timeLabel: formatMinutesRangeLabel(scaledMin, scaledMax),
      restTimeLabel:
        step.restTimeMinutes !== undefined
          ? formatMinutesLabel(step.restTimeMinutes)
          : undefined,
    };
  });
}

/**
 * 전체 예상 실제 조리시간(숙성/휴지 제외)과, 숙성을 포함한 총 소요시간을 계산한다.
 * 각 단계는 min~max 범위를 갖기 때문에 범위의 중간값을 더해 하나의 총합을 만든다.
 */
export function calculateTotalTimes(
  steps: RecipeStep[],
  servings: number
): { totalCookingTimeLabel: string; totalTimeLabel: string } {
  let totalMinutes = 0;
  let totalRestMinutes = 0;

  for (const step of steps) {
    const scaledMin = calculateCookingTime(servings, step.baseTimeMinutes.min);
    const scaledMax = calculateCookingTime(servings, step.baseTimeMinutes.max);
    totalMinutes += (scaledMin + scaledMax) / 2;
    totalRestMinutes += step.restTimeMinutes ?? 0;
  }

  const roundedCookingTime = Math.round(totalMinutes);
  const roundedTotalTime = Math.round(totalMinutes + totalRestMinutes);

  return {
    totalCookingTimeLabel: formatMinutesLabel(roundedCookingTime),
    totalTimeLabel: formatMinutesLabel(roundedTotalTime),
  };
}
