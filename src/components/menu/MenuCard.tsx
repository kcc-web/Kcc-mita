"use client";
import Image from "next/image";
import FlavorBadge from "./FlavorBadge";
import type { Bean } from "@/types/bean";

type Props ={
    bean: Bean;
    onOpen: () => void;
    className?: string;
}

export default function MenuCard({ bean, onOpen , className}:Props)  {
  return (
    <button onClick={onOpen} className="text-left rounded-2xl shadow-md p-3 hover:shadow-lg transition">
      <div className="relative w-full h-48 rounded-2xl overflow-hidden">
        <Image src={bean.photo} alt={bean.name} fill className="object-cover" priority />
      </div>
      <h3 className="mt-3 text-xl font-semibold">{bean.name}</h3>
      <p className="text-sm opacity-70">{bean.origin}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {bean.flavor.slice(0, 3).map((f) => (<FlavorBadge key={f} text={f} />))}
      </div>
    </button>
  );
}
