export interface Stamp {
  id: number;
  title: string;
  svg: string;
  created_at: string;
}

export const stampsAPI = {
  getAll: (): Promise<Stamp[]> => window.stampsAPI.getAll(),
  create: (title: string, svg: string) => window.stampsAPI.create(title, svg),
};
