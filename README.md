# Recipe Generator

메뉴명과 인원수만 입력하면 해당 인원에 맞는 레시피(재료/양념/조리방법/조리시간)를
자동으로 계산해 보여주는 웹앱입니다.

## 실행

```bash
npm install
npm run dev
```

`http://localhost:3000` 에서 확인할 수 있습니다.

## 1차 버전 범위

- 입력: 메뉴명, 인원 두 가지만 받습니다.
- 데이터: DB/로그인 없이, 코드에 내장된 샘플 레시피 4종(제육볶음, 김치찌개, 된장찌개, 불고기)만 지원합니다.
- 인원수에 따라 재료량/양념량은 비례 계산, 조리시간은 인원수 구간별 보정 배율을 적용해 계산합니다.
- 샘플 레시피에 없는 메뉴를 입력하면 안내 메시지만 표시합니다. AI 레시피 생성은
  아직 연결되어 있지 않으며(`src/utils/generateRecipeWithAI.ts`), 구조만 준비되어 있습니다.

## 프로젝트 구조

```text
app/                 Next.js App Router 진입점 (layout, page)
src/
 ├─ App.tsx           최상위 화면 컴포넌트 (입력 ↔ 결과 전환)
 ├─ components/
 │   ├─ RecipeForm.tsx
 │   ├─ RecipeResult.tsx
 │   ├─ IngredientList.tsx
 │   └─ CookingSteps.tsx
 ├─ data/
 │   └─ sampleRecipes.ts
 ├─ utils/
 │   ├─ calculateIngredients.ts
 │   ├─ calculateSeasonings.ts
 │   ├─ calculateCookingTime.ts
 │   └─ generateRecipeWithAI.ts   (아직 호출되지 않는 stub)
 └─ types/
     └─ recipe.ts
```

## 계산 규칙

- `calculateIngredientAmount()` / `calculateSeasoningAmount()`: 재료와 양념의 환산
  로직을 분리해 두었습니다. 지금은 둘 다 단순 비례식이지만, 양념은 추후 별도
  보정이 필요할 수 있어 함수를 나눠 두었습니다.
- `calculateCookingTime()`: 인원수 구간별 보정 배율(`COOKING_TIME_MULTIPLIER_TIERS`)을
  기준 조리시간에 곱해 계산합니다. 인원수가 늘어도 조리시간이 단순히 같은 배수로
  늘지 않도록 하기 위함이며, 배율 값은 이 배열만 수정하면 조정됩니다.
