import { CouponsPage } from "./coupons/CouponsPage";

export const MainPage = () => {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] p-10">
      <h1 className="text-3xl font-bold mb-8">Stampiki App</h1>

      <CouponsPage />
    </div>
  );
};
