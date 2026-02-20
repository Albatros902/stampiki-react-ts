import { CouponList } from "../entities/coupon/ui/CouponList";

export const MainPage = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Stampiki App</h1>
      <CouponList />
    </div>
  );
};
