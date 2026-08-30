import type { IngredientItem } from "@/types/recipe";

interface IngredientListProps {
  title: string;
  items: IngredientItem[];
}

/** 재료 또는 양념 목록을 보여주는 카드 안의 리스트 */
export default function IngredientList({ title, items }: IngredientListProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-base font-bold text-gray-900">{title}</h3>
      <ul className="flex flex-col divide-y divide-gray-100">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between py-2 text-[15px]"
          >
            <span className="text-gray-700">{item.name}</span>
            <span className="font-semibold text-gray-900">
              {item.amount}
              {item.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
