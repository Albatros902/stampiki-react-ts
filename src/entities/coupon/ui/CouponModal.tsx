import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Coupon, CouponCell } from "../model/types";
import { CouponGrid } from "./CouponGrid";

interface Props {
  coupon: Coupon;
  onClose: () => void;
}

export const CouponModal = ({ coupon, onClose }: Props) => {
  const [cells, setCells] = useState<CouponCell[]>([]);

  const loadCells = async () => {
    const data = await window.couponCellsAPI.getByCouponId(coupon.id);
    setCells(data);
  };

  useEffect(() => {
    loadCells();
  }, []);

  const setStamp = async (cellId: number) => {
    await window.couponCellsAPI.setStamp(cellId, 1);
    loadCells();
  };

  const clearStamp = async (cellId: number) => {
    await window.couponCellsAPI.clearStamp(cellId);
    loadCells();
  };

  const filledCount = cells.filter((c) => c.stamp_id).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Затемнение */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Контент */}
      <div
        className="
          relative
          bg-white
          w-[900px]
          h-[550px]
          rounded-3xl
          shadow-2xl
          p-8
          flex
          gap-8
          z-10
        "
      >
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 hover:scale-110 transition"
        >
          <X size={28} />
        </button>

        {/* Левая часть — сетка */}
        <div className="w-[70%]">
          <CouponGrid
            cells={cells}
            onSetStamp={setStamp}
            onClearStamp={clearStamp}
          />
        </div>

        {/* Правая часть — информация */}
        <div className="w-[30%] border-l pl-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">{coupon.title}</h2>

          <div className="mb-4">
            <p className="text-sm opacity-60">Прогресс</p>

            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="h-3 rounded-full transition-all"
                style={{
                  width: `${(filledCount / coupon.cell_count) * 100}%`,
                  backgroundColor: "rgb(var(--color-primary))",
                }}
              />
            </div>

            <p className="mt-2 text-sm font-medium">
              {filledCount} / {coupon.cell_count}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
