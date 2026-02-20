export interface Tag {
  id: number;
  title: string;
}

export const tagsAPI = {
  getAll: (): Promise<Tag[]> => window.tagsAPI.getAll(),
  create: (title: string) => window.tagsAPI.create(title),
};
