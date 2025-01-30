"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function VehicleSelector() {
  const [makes, setMakes] = useState<{ MakeId: number; MakeName: string }[]>(
    []
  );
  const [selectedMake, setSelectedMake] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [makeId, setMakeId] = useState<number | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2014 }, (_, i) => 2015 + i);

  const isNextButtonEnabled = makeId !== null && selectedYear !== "";

  useEffect(() => {
    async function fetchMakes() {
      try {
        const response = await fetch(
          "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json"
        );
        const data = await response.json();
        console.log(data);
        setMakes(data.Results);
      } catch (error) {
        console.error("Error fetching vehicle makes:", error);
      }
    }

    fetchMakes();
  }, []);

  return (
    <div className="flex flex-col p-4 space-y-4">
      <label className="block">
        Select Make:
        <select
          className="block w-full p-2 border rounded-md"
          value={selectedMake ? selectedMake.id.toString() : ""}
          onChange={(e) => {
            const selectedOption = makes.find(
              (make) => make.MakeId.toString() === e.target.value
            );
            setSelectedMake(
              selectedOption
                ? { id: selectedOption.MakeId, name: selectedOption.MakeName }
                : null
            );
            setMakeId(selectedOption?.MakeId ?? null);
          }}
        >
          <option value="">Select a Make</option>
          {makes.map((make) => (
            <option key={make.MakeId} value={make.MakeId.toString()}>
              {make.MakeName}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        Select Year:
        <select
          className="block w-full p-2 border rounded-md"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">Select a Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>

      {selectedMake && selectedYear && (
        <p className="mt-4 font-semibold">
          Selected: {selectedMake.name} - {selectedYear}
        </p>
      )}
      <Link href={`/result/${makeId}/${selectedYear}`} passHref>
        <button
          type="button"
          disabled={!isNextButtonEnabled}
          className="flex justify-center items-center w-full px-10 py-2 bg-black text-white text-lg rounded-full disabled:opacity-50"
        >
          Next
        </button>
      </Link>
    </div>
  );
}
