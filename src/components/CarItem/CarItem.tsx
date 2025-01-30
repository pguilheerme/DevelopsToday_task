/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import Link from "next/link";

type MakeProps = {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
};

export default function CarItem() {
  const { makeId, year } = useParams();
  const [make, setMake] = useState<MakeProps[] | null>(null);

  useEffect(() => {
    async function fetchMakes() {
      if (makeId && year) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
          );
          const data = await response.json();
          setMake(data.Results);
        } catch (error) {
          console.error("Error fetching vehicle makes:", error);
        }
      }
    }

    fetchMakes();
  }, []);

  return (
    <div className="w-full max-w-5xl flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Results</h1>
      <Suspense fallback={<Loading />}>
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 mx-auto">
          {make?.map((make) => (
            <div
              key={make.Model_ID}
              className="w-56 h-56 flex flex-col justify-center items-center bg-white rounded-xl shadow-md gap-3 p-4
                  hover:shadow-lg transition-shadow duration-300"
            >
              <span className="text-lg font-semibold text-gray-900">
                Make: {make?.Make_Name}
              </span>
              <span className="text-sm text-gray-600">
                Model: {make?.Model_Name}
              </span>
            </div>
          ))}
        </div>
      </Suspense>
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-black text-white text-lg rounded-full font-medium shadow-md
              hover:bg-gray-800 transition-all duration-300"
      >
        Go Back
      </Link>
    </div>
  );
}
