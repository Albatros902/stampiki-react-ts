import { getDB } from "./database";

export class CouponsRepository {
  private db = getDB();

  getAll() {
    return this.db
      .prepare(
        `
      SELECT * FROM coupons
      ORDER BY created_at DESC
    `,
      )
      .all();
  }

  getById(id: number) {
    return this.db
      .prepare(
        `
      SELECT * FROM coupons WHERE id = ?
    `,
      )
      .get(id);
  }

  create(
    title: string,
    cell_count: number,
    access_code: string,
    image_path?: string,
  ) {
    const stmt = this.db.prepare(`
    INSERT INTO coupons
    (title, cell_count, access_code, image_path, status)
    VALUES (?, ?, ?, ?, 'active')
  `);

    const result = stmt.run(title, cell_count, access_code, image_path ?? null);

    return this.getById(result.lastInsertRowid as number);
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
}
