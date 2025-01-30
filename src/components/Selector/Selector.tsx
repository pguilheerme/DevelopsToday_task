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
          `${process.env.NEXT_PUBLIC_API_URL}/GetMakesForVehicleType/car?format=json`
        );
        const data = await response.json();
        setMakes(data.Results);
      } catch (error) {
        console.error("Error fetching vehicle makes:", error);
      }
    }

    fetchMakes();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 space-y-6 lg:bg-gray-100 md:bg-gray-100 rounded-lg md:shadow-md lg:shadow-md w-full max-w-md mx-auto">
      <label className="w-full text-lg font-medium text-gray-700">
        Select Make:
        <select
          className="mt-2 block w-full p-3 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-gray-500 focus:outline-none"
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

      <label className="w-full text-lg font-medium text-gray-700">
        Select Year:
        <select
          className="mt-2 block w-full p-3 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-gray-500 focus:outline-none"
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
        <p className="mt-4 text-lg font-semibold text-gray-800">
          Selected:{" "}
          <span className="text-gray-600">
            {selectedMake.name} - {selectedYear}
          </span>
        </p>
      )}

      <Link href={`/result/${makeId}/${selectedYear}`} passHref>
        <button
          type="button"
          disabled={!isNextButtonEnabled}
          className="w-full px-10 py-3 bg-black text-white text-lg rounded-full shadow-md 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300
            hover:bg-gray-800 hover:shadow-lg"
        >
          Next
        </button>
      </Link>
    </div>
  );
}
