import { getDB } from "./database";

export class CouponCellsRepository {
  private db = getDB();

  getByCouponId(coupon_id: number) {
    return this.db
      .prepare(
        `
      SELECT * FROM coupon_cells
      WHERE coupon_id = ?
      ORDER BY id ASC
    `,
      )
      .all(coupon_id);
  }

  create(coupon_id: number, index: number) {
    const stmt = this.db.prepare(`
      INSERT INTO coupon_cells (coupon_id, cell_index, is_filled)
      VALUES (?, ?, 0)
    `);

    return stmt.run(coupon_id, index);
  }

  markFilled(id: number) {
    this.db
      .prepare(
        `
      UPDATE coupon_cells
      SET is_filled = 1
      WHERE id = ?
    `,
      )
      .run(id);
  }

  deleteByCouponId(coupon_id: number) {
    this.db
      .prepare(
        `
      DELETE FROM coupon_cells WHERE coupon_id = ?
    `,
      )
      .run(coupon_id);
  }

  delete(id: number) {
    this.db
      .prepare(
        `
      DELETE FROM coupon_cells WHERE id = ?
    `,
      )
      .run(id);
  }
}
