export interface Coupon {
  id: number;
  title: string;
  cell_count: number;
  status: "active" | "ready";
}

export interface CouponCell {
  id: number;
  coupon_id: number;
  position: number;
  stamp_id: number | null;
}
