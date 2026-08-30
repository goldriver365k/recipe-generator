"use client";

import { useState } from "react";

interface RecipeFormProps {
  onSubmit: (menuName: string, servings: number) => void;
}

/**
 * 첫 화면의 입력 폼. 입력 항목은 "메뉴명"과 "인원" 딱 2개뿐이다.
 */
export default function RecipeForm({ onSubmit }: RecipeFormProps) {
  const [menuName, setMenuName] = useState("");
  const [servings, setServings] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = menuName.trim();
    const servingsNumber = Number(servings);

    if (!trimmedName) {
      setError("메뉴명을 입력해 주세요.");
      return;
    }
    if (!servings || !Number.isFinite(servingsNumber) || servingsNumber <= 0) {
      setError("인원을 1 이상의 숫자로 입력해 주세요.");
      return;
    }

    setError("");
    onSubmit(trimmedName, Math.round(servingsNumber));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="menuName" className="text-sm font-semibold text-gray-700">
          메뉴명
        </label>
        <input
          id="menuName"
          type="text"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          placeholder="예: 제육볶음"
          className="w-full rounded-xl border border-gray-300 px-4 py-4 text-lg outline-none focus:border-gray-900"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="servings" className="text-sm font-semibold text-gray-700">
          인원
        </label>
        <div className="flex items-center gap-3">
          <input
            id="servings"
            type="number"
            inputMode="numeric"
            min={1}
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="50"
            className="w-full rounded-xl border border-gray-300 px-4 py-4 text-lg outline-none focus:border-gray-900"
          />
          <span className="shrink-0 text-lg font-semibold text-gray-700">명</span>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-xl bg-gray-900 px-4 py-4 text-lg font-bold text-white active:scale-[0.99]"
      >
        레시피 만들기
      </button>
    </form>
  );
}
