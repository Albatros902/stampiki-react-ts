import { ChevronRight } from "lucide-react";
import { Coupon } from "../model/types";

interface Props {
  coupon: Coupon;
  onOpen: () => void;
}

export const CouponCard = ({ coupon, onOpen }: Props) => {
  return (
    <div
      onClick={onOpen}
      className="
        bg-white
        border-2 border-[rgb(var(--color-primary))]
        rounded-2xl
        px-6 py-4
        shadow-md
        hover:shadow-xl
        hover:scale-[1.02]
        transition-all
        cursor-pointer
      "
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{coupon.title}</h3>

        <ChevronRight size={28} className="text-[rgb(var(--color-primary))]" />
      </div>
    </div>
  );
};
