export interface Coupon {
  id: number;
  title: string;
  cell_count: number;
  image_path?: string | null;
  access_code: string;
  status: "active" | "ready";
  created_at: string;
}

export const couponsAPI = {
  getAll: (): Promise<Coupon[]> => window.couponsAPI.getAll(),
  create: (title: string, cell_count: number, code: string, image?: string) =>
    window.couponsAPI.create(title, cell_count, code, image),
  verifyAccess: (id: number, code: string) => window.couponsAPI.verifyAccess(id, code),
  use: (id: number) => window.couponsAPI.use(id),
  updateStatus: (id: number, status: "active" | "ready") => window.couponsAPI.updateStatus(id, status),
};
