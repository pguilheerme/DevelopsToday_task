import CarItem from "@/components/CarItem/CarItem";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/GetMakesForVehicleType/car?format=json`
  );
  const data = await res.json();

  if (!data.Results) return [];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2014 }, (_, i) => 2015 + i);

  return data.Results.flatMap((make: { MakeId: number; MakeName: string }) =>
    years.map((year) => ({
      makeId: make.MakeId.toString(),
      year: year.toString(),
    }))
  );
}

export default async function ResultPage({
  params,
}: {
  params: { makeId: number; year: string };
}) {
  const { makeId, year } = await params;

  if (!params || !makeId || !year) {
    return notFound();
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center py-16 bg-gray-100">
      <CarItem />
    </div>
  );
}
