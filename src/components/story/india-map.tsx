// 'use client';

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { BarChartBig } from 'lucide-react';
// import type { StateSale } from '@/app/lib/story-data';

// type IndiaMapProps = {
//   states: StateSale[];
// };

// export function IndiaMap({ states }: IndiaMapProps) {
//   // The states prop is ignored to show a generic illustration instead of a map.
//   return (
//     <Card className="shadow-lg flex flex-col items-center justify-center min-h-[400px]">
//       <CardHeader className="text-center">
//         <CardTitle className="flex items-center justify-center gap-2">
//             <BarChartBig className="h-5 w-5 text-primary"/>
//             Data Illustration
//         </CardTitle>
//         <CardDescription>A visual representation of sales data.</CardDescription>
//       </CardHeader>
//       <CardContent className="flex flex-1 items-center justify-center">
//         <div className="text-muted-foreground/20">
//             <BarChartBig size={150} strokeWidth={0.75} />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartBig } from "lucide-react";

type StateSale = {
  name: string;
  sales: number;
};

// ✅ FINAL ID MAP — matches your SVG EXACTLY
const idMap: Record<string, string> = {
  "Andaman and Nicobar Islands": "INAN",
  "Andhra Pradesh": "INAP",
  "Arunachal Pradesh": "INAR",
  "Assam": "INAS",
  "Bihar": "INBR",
  "Chandigarh": "INCH",
  "Chhattisgarh": "INCT",
  "Dadra and Nagar Haveli and Daman and Diu": "INDH",
  "Delhi": "INDL",
  "Goa": "INGA",
  "Gujarat": "INGJ",
  "Haryana": "INHR",
  "Himachal Pradesh": "INHP",
  "Jammu and Kashmir": "INJK",
  "Jharkhand": "INJH",
  "Karnataka": "INKA",
  "Kerala": "INKL",
  "Ladakh": "INLA",
  "Lakshadweep": "INLD",
  "Madhya Pradesh": "INMP",
  "Maharashtra": "INMH",
  "Manipur": "INMN",
  "Meghalaya": "INML",
  "Mizoram": "INMZ",
  "Nagaland": "INNL",
  "Odisha": "INOD",
  "Puducherry": "INPY",
  "Punjab": "INPB",
  "Rajasthan": "INRJ",
  "Sikkim": "INSK",
  "Tamil Nadu": "INTN",
  "Telangana": "INTG",
  "Tripura": "INTR",
  "Uttar Pradesh": "INUP",
  "Uttarakhand": "INUT",
  "West Bengal": "INWB",
};

export default function IndiaMap({ states }: { states: StateSale[] }) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    fetch("/maps/india.svg")
      .then((res) => res.text())
      .then((raw) => {
        // remove all fills from the original SVG
        const cleaned = raw.replace(/fill="[^"]*"/g, "");
        setSvg(cleaned);
      });
  }, []);

  if (!svg) return <div>Loading Map...</div>;

  // ✅ Identify top 3 states
  const top3 = [...states].sort((a, b) => b.sales - a.sales).slice(0, 3);

const getColor = (name: string) => {
  if (name === top3[0].name) return "#0B7A22";     // Dark green (Top 1)
  if (top3.some(s => s.name === name)) return "#22C55E"; // Green (Top 2–3)
  return "#D1D5DB";                                // Grey others
};

  let finalSvg = svg;

  // ✅ Apply the correct fills
  states.forEach((s) => {
    const svgId = idMap[s.name];
    if (!svgId) return;

    finalSvg = finalSvg.replace(
      new RegExp(`id="${svgId}"`, "g"),
      `id="${svgId}" fill="${getColor(s.name)}"`
    );
  });

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <BarChartBig className="h-5 w-5 text-primary" />
          Data Illustration
        </CardTitle>
        <CardDescription>Top 3 visual representation of sales data.</CardDescription>
      </CardHeader>

<CardContent className="flex justify-center items-center">
  <div className="relative flex justify-center items-center">
    <div
      className="origin-top scale-[0.45]"
      dangerouslySetInnerHTML={{ __html: finalSvg }}
    />
  </div>
</CardContent>
{/* <CardContent className="flex justify-center items-center p-0">
  <div className="w-full flex justify-center">
    <div className="relative overflow-hidden"
         style={{
           width: "100%",
           maxWidth: "320px",       // final visible width
           height: "320px",         // fixes bottom spacing
           display: "flex",
           justifyContent: "center",
           alignItems: "center",
         }}
    >
      <div
        className="origin-top-left scale-[0.30]"   // adjust size if needed
        dangerouslySetInnerHTML={{ __html: finalSvg }}
      />
    </div>
  </div>
</CardContent> */}
    </Card>
  );
}