import { Star } from "lucide-react";
import { CouponCell } from "../model/types";

interface Props {
  cells: CouponCell[];
  onSetStamp: (cellId: number) => void;
  onClearStamp: (cellId: number) => void;
}

export const CouponGrid = ({ cells, onSetStamp, onClearStamp }: Props) => {
  // Автоматическая адаптация колонок
  const getColumns = () => {
    if (cells.length <= 5) return "grid-cols-5";
    if (cells.length <= 10) return "grid-cols-5";
    if (cells.length <= 20) return "grid-cols-5";
    return "grid-cols-6";
  };

  return (
    <div className={`grid ${getColumns()} gap-4`}>
      {cells.map((cell) => (
        <div
          key={cell.id}
          className="border border-[rgb(var(--color-border))] 
                     rounded-xl flex items-center justify-center 
                     cursor-pointer hover:bg-[rgb(var(--color-bg))] 
                     transition h-16"
          onClick={() =>
            cell.stamp_id ? onClearStamp(cell.id) : onSetStamp(cell.id)
          }
        >
          {cell.stamp_id && (
            <Star
              className="text-[rgb(var(--color-primary))] 
                         transition-transform scale-100"
              fill="currentColor"
            />
          )}
        </div>
      ))}
    </div>
  );
};
