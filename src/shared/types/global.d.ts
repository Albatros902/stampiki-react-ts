/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    stampsAPI: {
      getAll: () => Promise<any>;
      create: (title: string, svg: string) => Promise<any>;
      update: (id: number, title: string, svg: string) => Promise<boolean>;
      delete: (id: number) => Promise<boolean>;
    };

    couponsAPI: {
      getAll: () => Promise<any>;
      create: (
        title: string,
        cell_count: number,
        access_code: string,
        image_path?: string
      ) => Promise<any>;
      updateStatus: (id: number, status: "active" | "ready") => Promise<boolean>;
      verifyAccess: (id: number, code: string) => Promise<boolean>;
      use: (id: number) => Promise<boolean>;
      delete: (id: number) => Promise<boolean>;
    };

    couponCellsAPI: {
      getByCouponId: (coupon_id: number) => Promise<any>;
      setStamp: (cell_id: number, stamp_id: number) => Promise<boolean>;
      clearStamp: (cell_id: number) => Promise<boolean>;
    };

    tagsAPI: {
      getAll: () => Promise<any>;
      create: (title: string) => Promise<any>;
      delete: (id: number) => Promise<boolean>;
    };
  }
}
