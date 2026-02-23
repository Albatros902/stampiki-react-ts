import { useState } from "react";

export const CreateCouponForm = ({ onCreated }: { onCreated: () => void }) => {
  const [title, setTitle] = useState("");
  const [count, setCount] = useState(5);

  const create = async () => {
    if (!title) return;
    await window.couponsAPI.create(title, count, "0001");
    setTitle("");
    onCreated();
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        className="border rounded-xl px-3 py-2"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        className="border rounded-xl px-3 py-2 w-24"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
      />
      <button
        onClick={create}
        className="bg-[rgb(var(--color-primary))] 
                   text-white px-4 py-2 rounded-xl"
      >
        Создать
      </button>
    </div>
  );
};
