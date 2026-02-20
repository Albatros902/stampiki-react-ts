import { getDB } from "./database";


export interface Stamp {
  id: number;
  title: string;
  svg: string;
  created_at: string;
}

export class StampsRepository {
  private db = getDB();

  getAll(): Stamp[] {
    const stmt = this.db.prepare(
      "SELECT * FROM stamps ORDER BY created_at DESC",
    );
    return stmt.all() as Stamp[]; 
  }

  getById(id: number): Stamp | null {
    const stmt = this.db.prepare("SELECT * FROM stamps WHERE id = ?");
    return (stmt.get(id) as Stamp) || null;
  }

  // Создать новый штампик
  create(title: string, svg: string): Stamp {
    const stmt = this.db.prepare(
      "INSERT INTO stamps (title, svg) VALUES (?, ?)",
    );
    const info = stmt.run(title, svg);

    return {
      id: info.lastInsertRowid as number,
      title,
      svg,
      created_at: new Date().toISOString(),
    };
  }

  // Обновить существующий штампик
  update(id: number, title: string, svg: string): boolean {
    const stmt = this.db.prepare(
      "UPDATE stamps SET title = ?, svg = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?",
    );
    const info = stmt.run(title, svg, id);
    return info.changes > 0;
  }

  // Удалить штампик
  delete(id: number): boolean {
    const stmt = this.db.prepare("DELETE FROM stamps WHERE id = ?");
    const info = stmt.run(id);
    return info.changes > 0;
  }
}
