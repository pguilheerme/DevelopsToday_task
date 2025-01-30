/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Loading from "@/components/Loading/Loading";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type MakeProps = {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
};

export default function ResultPage() {
  const { makeId, year } = useParams();
  const [make, setMake] = useState<MakeProps[] | null>(null);

  useEffect(() => {
    async function fetchMakes() {
      if (makeId && year) {
        console.log("MakeId: ", makeId);
        console.log("year: ", year);
        try {
          const response = await fetch(
            `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
          );
          const data = await response.json();
          console.log(data);
          setMake(data.Results);
        } catch (error) {
          console.error("Error fetching vehicle makes:", error);
        }
      }
    }

    fetchMakes();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full lg:h-screen flex flex-col justify-center items-center py-32">
        <div className="lg:w-[60%] w-[90%] flex flex-col justify-center items-center">
          <h1 className="text-4xl">Results</h1>
          <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {make?.map((make) => (
              <div
                key={make.Model_ID}
                className="w-52 h-52 flex flex-col justify-center items-center bg-gray-200 rounded-xl shadow-sm gap-3"
              >
                <span className="text-lg font-bold">
                  Make: {make?.Make_Name}
                </span>
                <span className="text-sm">Model: {make?.Model_Name}</span>
              </div>
            ))}
          </div>
          <Link
            className="w-full flex justify-center items-center px-10 py-2 bg-black text-white text-lg rounded-full"
            href={"/"}
          >
            Go back
          </Link>
        </div>
      </div>
    </Suspense>
  );
}
