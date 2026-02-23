import { useEffect, useState } from "react";
import { CreateCouponForm } from "../../features/create-coupon/ui/CreateCouponForm";
import { CouponCard } from "../../entities/coupon/ui/CouponCard";
import { CouponModal } from "../../entities/coupon/ui/CouponModal";
import { Coupon } from "../../entities/coupon/model/types";

export const CouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selected, setSelected] = useState<Coupon | null>(null);

  const load = async () => {
    const data = await window.couponsAPI.getAll();
    setCoupons(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-8 bg-[rgb(var(--color-bg))] min-h-screen">
      <CreateCouponForm onCreated={load} />

      <div className="grid grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onOpen={() => setSelected(coupon)}
          />
        ))}
      </div>

      {selected && (
        <CouponModal coupon={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};
