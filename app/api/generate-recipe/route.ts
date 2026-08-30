import { NextRequest, NextResponse } from "next/server";
import type { AIRecipeResponse } from "@/utils/generateRecipeWithAI";

// OpenAI 호출은 서버에서만 일어나야 하므로 Node.js 런타임의 Route Handler로 구현한다.
// (클라이언트에 API 키가 노출되지 않는다.)
export const runtime = "nodejs";

const RECIPE_JSON_SCHEMA = {
  name: "recipe",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      menuName: { type: "string" },
      servings: { type: "number" },
      ingredients: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            amount: { type: "number" },
            unit: { type: "string" },
          },
          required: ["name", "amount", "unit"],
        },
      },
      seasonings: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            amount: { type: "number" },
            unit: { type: "string" },
          },
          required: ["name", "amount", "unit"],
        },
      },
      steps: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            step: { type: "number" },
            title: { type: "string" },
            description: { type: "string" },
            time: { type: "string" },
          },
          required: ["step", "title", "description", "time"],
        },
      },
      totalCookingTime: { type: "string" },
      totalTime: { type: "string" },
    },
    required: [
      "menuName",
      "servings",
      "ingredients",
      "seasonings",
      "steps",
      "totalCookingTime",
      "totalTime",
    ],
  },
} as const;

const SYSTEM_PROMPT =
  "당신은 대량조리(단체급식/케이터링) 전문 조리 컨설턴트입니다. " +
  "사용자가 알려주는 메뉴명과 인원수에 맞는 실전 레시피를 한국어로 작성합니다. " +
  "재료/양념 양은 요청받은 인원수 기준으로 실제 조리에 적합한 양을 계산하고, " +
  "단위는 g, kg, ml, L 중 알맞은 것을 사용합니다. " +
  "조리 단계는 4~7단계로 나누고, 각 단계에 실제로 걸리는 예상 시간을 " +
  "'약 5분' 또는 '약 8~10분' 형태의 한국어 문자열로 적습니다. " +
  "숙성/휴지가 필요한 단계는 description에 명시하고 time에 반영합니다. " +
  "인원수가 많아질수록 팬/솥 크기, 화력, 분할 조리의 영향으로 조리시간이 " +
  "인원수에 정비례하지는 않는다는 점을 반영해 주세요. " +
  "반드시 주어진 JSON 스키마 형식으로만 응답하세요.";

export async function POST(request: NextRequest) {
  let body: { menuName?: unknown; servings?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const menuName = typeof body.menuName === "string" ? body.menuName.trim() : "";
  const servingsInput =
    typeof body.servings === "number" ? body.servings : Number(body.servings);

  if (!menuName || !Number.isFinite(servingsInput) || servingsInput <= 0) {
    return NextResponse.json(
      { error: "메뉴명과 인원(1 이상)을 입력해 주세요." },
      { status: 400 }
    );
  }
  const servings = Math.round(servingsInput);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "서버에 OPENAI_API_KEY가 설정되어 있지 않습니다." },
      { status: 500 }
    );
  }

  const baseUrl = process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1";

  try {
    const openaiResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_RECIPE_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        response_format: {
          type: "json_schema",
          json_schema: RECIPE_JSON_SCHEMA,
        },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `메뉴명: ${menuName}\n인원수: ${servings}명`,
          },
        ],
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error:", openaiResponse.status, errorText);
      return NextResponse.json(
        { error: "AI 레시피 생성에 실패했습니다. 잠시 후 다시 시도해 주세요." },
        { status: 502 }
      );
    }

    const data = await openaiResponse.json();
    const content = data?.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
      console.error("Unexpected OpenAI response shape:", JSON.stringify(data));
      return NextResponse.json(
        { error: "AI 응답을 읽을 수 없습니다." },
        { status: 502 }
      );
    }

    let parsed: AIRecipeResponse;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response JSON:", parseError, content);
      return NextResponse.json(
        { error: "AI 응답 형식이 올바르지 않습니다." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("generate-recipe route error:", error);
    return NextResponse.json(
      { error: "AI 레시피 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
