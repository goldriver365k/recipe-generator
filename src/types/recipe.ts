// 레시피 도메인에서 공통으로 쓰는 타입 정의

/** 재료/양념 한 줄 (예: 돼지고기 7.5kg) */
export interface IngredientItem {
  name: string;
  amount: number;
  unit: string;
}

/** 조리 단계 하나 (예: "1. 재료 손질") */
export interface RecipeStep {
  step: number;
  title: string;
  description: string;
  /** 이 단계의 기준(1~10인분) 조리 시간 - 분 단위. 범위가 있으면 min/max, 없으면 동일값 */
  baseTimeMinutes: {
    min: number;
    max: number;
  };
  /**
   * 숙성/휴지 등 "조리사가 손대지 않고 기다리는" 시간(분).
   * 인원수가 늘어도 거의 변하지 않는다고 가정하여 배율 계산에서 제외한다.
   */
  restTimeMinutes?: number;
}

/** mock 데이터 / AI 응답에 공통으로 쓰이는 기준 레시피 (아직 인원수로 스케일링되기 전) */
export interface BaseRecipe {
  menuName: string;
  /** 이 레시피의 재료/양념 수치가 기준으로 삼는 인원수 */
  baseServings: number;
  ingredients: IngredientItem[];
  seasonings: IngredientItem[];
  steps: RecipeStep[];
}

/** 화면에 출력할, 특정 인원수로 계산이 끝난 최종 레시피 */
export interface ScaledRecipe {
  menuName: string;
  baseServings: number;
  targetServings: number;
  ingredients: IngredientItem[];
  seasonings: IngredientItem[];
  steps: ScaledRecipeStep[];
  /** 실제 조리에 드는 시간 (숙성/휴지 제외), 예: "약 30분" */
  totalCookingTimeLabel: string;
  /** 숙성/휴지를 포함한 총 소요 시간, 예: "약 50분" */
  totalTimeLabel: string;
}

export interface ScaledRecipeStep {
  step: number;
  title: string;
  description: string;
  /** 예: "약 8~10분" */
  timeLabel: string;
  /** 예: "약 20분" (없으면 표시하지 않음) */
  restTimeLabel?: string;
}
