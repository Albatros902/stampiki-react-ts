import { useEffect, useState } from "react";

interface Coupon {
  id: number;
  title: string;
  cell_count: number;
  status: string;
}

export const CouponList = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const load = async () => {
    const data = await window.couponsAPI.getAll();
    setCoupons(data);
  };

  useEffect(() => {
    load();
  }, []);

  const createCoupon = async () => {
    await window.couponsAPI.create("Новый купон", 3, "0001");
    load();
  };

  const updateCoupon = async (id: number) => {
    await window.couponsAPI.update(id, "Обновленный купон", 10);
    load();
  };

  const deleteCoupon = async (id: number) => {
    await window.couponsAPI.delete(id);
    load();
  };

  const createCell = async (coupon_id: number) => {
    await window.couponCellsAPI.create(coupon_id, Date.now());
    alert("Ячейка создана");
  };

  return (
    <div>
      <button onClick={createCoupon}>Создать купон</button>

      <ul>
        {coupons.map((c) => (
          <li key={c.id}>
            <strong>{c.title}</strong> ({c.cell_count}) — {c.status}
            <div style={{ marginTop: 5 }}>
              <button onClick={() => updateCoupon(c.id)}>Обновить</button>

              <button onClick={() => deleteCoupon(c.id)}>Удалить</button>

              <button onClick={() => createCell(c.id)}>Добавить ячейку</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
