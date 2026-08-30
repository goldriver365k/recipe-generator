import type { BaseRecipe } from "@/types/recipe";

/**
 * 초기 버전용 mock 레시피 데이터 (4종).
 * AI API를 계속 호출하지 않고도 화면/계산 로직을 검증하기 위한 샘플이다.
 *
 * 모든 레시피는 baseServings = 10(10인분)을 기준으로 재료/양념 양을 저장한다.
 * 조리 단계의 baseTimeMinutes는 "1~10인분(배율 ×1.0)" 구간 기준 시간이며,
 * 실제 화면에 표시되는 시간은 calculateCookingTime()이 인원수 구간별
 * 배율을 적용해 계산한다.
 */
export const sampleRecipes: BaseRecipe[] = [
  {
    menuName: "제육볶음",
    baseServings: 10,
    ingredients: [
      { name: "돼지고기", amount: 1.5, unit: "kg" },
      { name: "양파", amount: 0.5, unit: "kg" },
      { name: "대파", amount: 200, unit: "g" },
      { name: "당근", amount: 140, unit: "g" },
    ],
    seasonings: [
      { name: "고추장", amount: 180, unit: "g" },
      { name: "고춧가루", amount: 80, unit: "g" },
      { name: "간장", amount: 120, unit: "ml" },
      { name: "설탕", amount: 70, unit: "g" },
      { name: "다진마늘", amount: 80, unit: "g" },
      { name: "참기름", amount: 30, unit: "ml" },
    ],
    steps: [
      {
        step: 1,
        title: "재료 손질",
        description: "돼지고기와 채소를 적당한 크기로 자른다.",
        baseTimeMinutes: { min: 6, max: 7 },
      },
      {
        step: 2,
        title: "양념장 만들기",
        description: "고추장, 고춧가루, 간장, 설탕, 다진마늘 등을 골고루 섞는다.",
        baseTimeMinutes: { min: 2, max: 3 },
      },
      {
        step: 3,
        title: "고기 양념하기",
        description: "돼지고기에 양념장을 넣고 잘 버무린다.",
        baseTimeMinutes: { min: 3, max: 4 },
        restTimeMinutes: 20,
      },
      {
        step: 4,
        title: "고기 볶기",
        description: "충분히 달군 팬에서 고기를 볶는다.",
        baseTimeMinutes: { min: 6, max: 7 },
      },
      {
        step: 5,
        title: "채소 넣기",
        description: "양파, 당근, 대파를 넣고 함께 볶는다.",
        baseTimeMinutes: { min: 3, max: 4 },
      },
      {
        step: 6,
        title: "마무리",
        description: "간을 확인하고 참기름 등을 넣어 마무리한다.",
        baseTimeMinutes: { min: 1, max: 1 },
      },
    ],
  },
  {
    menuName: "김치찌개",
    baseServings: 10,
    ingredients: [
      { name: "돼지고기", amount: 800, unit: "g" },
      { name: "신김치", amount: 1.5, unit: "kg" },
      { name: "두부", amount: 600, unit: "g" },
      { name: "대파", amount: 150, unit: "g" },
      { name: "양파", amount: 300, unit: "g" },
    ],
    seasonings: [
      { name: "고춧가루", amount: 60, unit: "g" },
      { name: "다진마늘", amount: 40, unit: "g" },
      { name: "국간장", amount: 40, unit: "ml" },
      { name: "설탕", amount: 20, unit: "g" },
      { name: "멸치육수", amount: 2, unit: "L" },
    ],
    steps: [
      {
        step: 1,
        title: "재료 손질",
        description: "김치, 두부, 대파, 양파, 돼지고기를 먹기 좋은 크기로 썬다.",
        baseTimeMinutes: { min: 7, max: 8 },
      },
      {
        step: 2,
        title: "고기·김치 볶기",
        description: "냄비에 돼지고기와 김치를 넣고 볶는다.",
        baseTimeMinutes: { min: 4, max: 5 },
      },
      {
        step: 3,
        title: "육수 넣고 끓이기",
        description: "멸치육수를 붓고 한소끔 끓인다.",
        baseTimeMinutes: { min: 8, max: 9 },
      },
      {
        step: 4,
        title: "마무리",
        description: "두부, 대파, 양파를 넣고 간을 맞춰 마무리한다.",
        baseTimeMinutes: { min: 3, max: 4 },
      },
    ],
  },
  {
    menuName: "된장찌개",
    baseServings: 10,
    ingredients: [
      { name: "두부", amount: 700, unit: "g" },
      { name: "애호박", amount: 500, unit: "g" },
      { name: "양파", amount: 300, unit: "g" },
      { name: "감자", amount: 400, unit: "g" },
      { name: "대파", amount: 100, unit: "g" },
    ],
    seasonings: [
      { name: "된장", amount: 250, unit: "g" },
      { name: "고추장", amount: 30, unit: "g" },
      { name: "다진마늘", amount: 30, unit: "g" },
      { name: "멸치육수", amount: 2.5, unit: "L" },
    ],
    steps: [
      {
        step: 1,
        title: "재료 손질",
        description: "두부, 애호박, 양파, 감자, 대파를 한입 크기로 썬다.",
        baseTimeMinutes: { min: 6, max: 7 },
      },
      {
        step: 2,
        title: "육수에 된장 풀기",
        description: "멸치육수에 된장과 고추장을 잘 풀어준다.",
        baseTimeMinutes: { min: 2, max: 3 },
      },
      {
        step: 3,
        title: "끓이기",
        description: "감자, 양파를 먼저 넣고 끓이다 애호박, 두부를 넣는다.",
        baseTimeMinutes: { min: 8, max: 9 },
      },
      {
        step: 4,
        title: "마무리",
        description: "대파와 다진마늘을 넣고 한소끔 더 끓여 마무리한다.",
        baseTimeMinutes: { min: 2, max: 3 },
      },
    ],
  },
  {
    menuName: "불고기",
    baseServings: 10,
    ingredients: [
      { name: "소고기(불고기용)", amount: 3, unit: "kg" },
      { name: "양파", amount: 0.8, unit: "kg" },
      { name: "당근", amount: 300, unit: "g" },
      { name: "대파", amount: 200, unit: "g" },
      { name: "버섯", amount: 400, unit: "g" },
    ],
    seasonings: [
      { name: "간장", amount: 500, unit: "ml" },
      { name: "설탕", amount: 250, unit: "g" },
      { name: "다진마늘", amount: 100, unit: "g" },
      { name: "배즙", amount: 300, unit: "ml" },
      { name: "참기름", amount: 80, unit: "ml" },
    ],
    steps: [
      {
        step: 1,
        title: "재료 손질",
        description: "소고기와 채소, 버섯을 적당한 크기로 손질한다.",
        baseTimeMinutes: { min: 7, max: 8 },
      },
      {
        step: 2,
        title: "양념장 만들기",
        description: "간장, 설탕, 다진마늘, 배즙, 참기름을 섞어 양념장을 만든다.",
        baseTimeMinutes: { min: 3, max: 4 },
      },
      {
        step: 3,
        title: "고기 재우기",
        description: "소고기에 양념장을 넣고 골고루 버무린다.",
        baseTimeMinutes: { min: 3, max: 4 },
        restTimeMinutes: 30,
      },
      {
        step: 4,
        title: "볶기",
        description: "달군 팬(또는 불판)에 고기와 채소를 함께 볶는다.",
        baseTimeMinutes: { min: 6, max: 7 },
      },
      {
        step: 5,
        title: "마무리",
        description: "국물 농도와 간을 확인하고 마무리한다.",
        baseTimeMinutes: { min: 1, max: 2 },
      },
    ],
  },
];

/** 메뉴명으로 mock 레시피를 찾는다. 앞뒤 공백을 무시하고 완전히 일치해야 찾는다. */
export function findSampleRecipe(menuName: string): BaseRecipe | undefined {
  const normalized = menuName.trim();
  return sampleRecipes.find((recipe) => recipe.menuName === normalized);
}
