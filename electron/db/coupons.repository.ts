import { getDB } from "./database";

export interface Coupon {
  id: number;
  title: string;
  cell_count: number;
  image_path: string | null;
  access_code: string;
  status: "active" | "ready";
  created_at: string;
}

export class CouponsRepository {
  private db = getDB();

  getAll(): Coupon[] {
    return this.db
      .prepare(
        `
      SELECT * FROM coupons
      ORDER BY created_at DESC
    `,
      )
      .all() as Coupon[];
  }

  getById(id: number): Coupon | null {
    const coupon = this.db
      .prepare(`SELECT * FROM coupons WHERE id = ?`)
      .get(id) as Coupon | undefined;

    return coupon ?? null;
  }

  create(
    title: string,
    cell_count: number,
    access_code: string,
    image_path?: string,
  ): Coupon {
    const stmt = this.db.prepare(`
    INSERT INTO coupons
    (title, cell_count, access_code, image_path, status)
    VALUES (?, ?, ?, ?, 'active')
  `);

    const result = stmt.run(title, cell_count, access_code, image_path ?? null);

    return this.getById(result.lastInsertRowid as number)!;
  }

  update(id: number, title: string, cell_count: number) {
    this.db
      .prepare(
        `
      UPDATE coupons
      SET title = ?, cell_count = ?
      WHERE id = ?
    `,
      )
      .run(title, cell_count, id);

    return this.getById(id);
  }

  delete(id: number) {
    this.db
      .prepare(
        `
      DELETE FROM coupons WHERE id = ?
    `,
      )
      .run(id);

    return { success: true };
  }

  updateStatus(id: number, status: "active" | "ready") {
    return this.db
      .prepare(
        `
      UPDATE coupons
      SET status = ?
      WHERE id = ?
    `,
      )
      .run(status, id);
  }

  verifyAccess(id: number, code: string): boolean {
    const coupon = this.getById(id);
    if (!coupon) return false;

    return coupon.access_code === code;
  }
}
