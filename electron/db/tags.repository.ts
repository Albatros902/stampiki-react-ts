import { getDB } from "./database";


export interface Tag {
  id: number;
  title: string;
}

export class TagsRepository {
  private db = getDB();

  getAll(): Tag[] {
    const stmt = this.db.prepare("SELECT * FROM tags ORDER BY title ASC");
    return stmt.all() as Tag[];
  }

  getById(id: number): Tag | null {
    const stmt = this.db.prepare("SELECT * FROM tags WHERE id = ?");
    return (stmt.get(id) as Tag) || null;
  }

  create(title: string): Tag {
    const stmt = this.db.prepare("INSERT INTO tags (title) VALUES (?)");
    const info = stmt.run(title);
    return { id: info.lastInsertRowid as number, title };
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare("DELETE FROM tags WHERE id = ?");
    const info = stmt.run(id);
    return info.changes > 0;
  }
}
