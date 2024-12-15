/* eslint-disable react/no-unescaped-entities */
'use client'
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Level } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const LevelsView = ({ levels, storeLevel }: { levels: Level[], storeLevel: Level }) => {
  return (
    <>
      <p className="text-sm text-gray-700 mb-2">SellerDashboard/storeLevel</p>
      <h1 className="text-2xl font-semibold">Store Level</h1>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {levels.map((level) => (
        <div key={level.levelNumber} className="w-full flex justify-center">
          <Card
            className={`shadow-md rounded-lg border border-gray-200 w-full max-w-sm ${
              level.levelNumber === storeLevel.levelNumber
                ? 'bg-blue-50 text-black h-[620px]'
                : 'h-[570px] mt-8'
            }`}
          >
            <CardHeader>
              <CardTitle className="font-semibold text-center">
                {level.levelNumber === storeLevel.levelNumber ? (
                  <p className="text-xs text-center text-white bg-blue-700 px-2 py-1 rounded-md mt-2">
                    Your Current Level
                  </p>
                ) : (
                  <p className="text-xs text-center text-white bg-blue-700 px-2 py-1 rounded-md mt-2">
                    {`Level ${level.levelNumber}`}
                  </p>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-semibold mt-2">Benefits:</h3>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  {level.benefits.map((benefit, index) => (
                    <li key={index} className="">
                      {benefit}
                    </li>
                  ))}
                </ul>
                {level.levelNumber !== storeLevel.levelNumber &&
                  level.levelNumber > storeLevel.levelNumber && (
                    <p className="text-sm text-blue-400">
                      Achieve {level.minSales} or more sales to unlock this level.
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
      </div>

    </>
  );
};

export default LevelsView;
