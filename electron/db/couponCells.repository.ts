import { getDB } from "./database";

export class CouponCellsRepository {
  private db = getDB();

  getByCouponId(coupon_id: number) {
    return this.db
      .prepare(
        `
        SELECT * FROM coupon_cells
        WHERE coupon_id = ?
        ORDER BY position ASC
      `,
      )
      .all(coupon_id);
  }

  create(coupon_id: number, position: number) {
    return this.db
      .prepare(
        `
        INSERT INTO coupon_cells (coupon_id, position, stamp_id)
        VALUES (?, ?, NULL)
      `,
      )
      .run(coupon_id, position);
  }

  setStamp(cell_id: number, stamp_id: number) {
    return this.db
      .prepare(
        `
        UPDATE coupon_cells
        SET stamp_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      )
      .run(stamp_id, cell_id);
  }

  clearStamp(cell_id: number) {
    return this.db
      .prepare(
        `
        UPDATE coupon_cells
        SET stamp_id = NULL, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      )
      .run(cell_id);
  }

  delete(id: number) {
    return this.db.prepare(`DELETE FROM coupon_cells WHERE id = ?`).run(id);
  }
}
