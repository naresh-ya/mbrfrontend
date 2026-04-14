// // 'use client';

// // import { Card } from '@/components/ui/card';
// // import { Badge } from '@/components/ui/badge';
// // import { ArrowUp, ArrowDown } from 'lucide-react';
// // import {
// //   ChartContainer,
// //   ChartTooltip,
// //   ChartTooltipContent,
// // } from '@/components/ui/chart';
// // import { Area, AreaChart } from 'recharts';
// // import { cn } from '@/lib/utils';

// // type KpiCardProps = {

  
// // category: string;        // NEW
// //   title: string;
// //   subtitle?: string;       // NEW
// //   value: string;           
// //   comparison: string;      // NEW
// //   narrative: string;       // NEW
// //   statusTag: string;       // NEW
// //   trend: "increase" | "decrease";  // from actual.trend
// //     changeType: "increase" | "decrease"; // from forecast.trend
// //   chartData: { month: string; value: number }[];
// // };

// // export function KpiCard({
// //   category,
// //   title,
// //   subtitle,
// //   value,
// //   comparison,
// //   narrative,
// //   statusTag,
// //   trend,
// //   changeType,
// //   chartData
// // }: KpiCardProps) {

// //   const isIncrease = changeType === "increase";

// //   const chartColor = isIncrease
// //     ? 'hsl(var(--chart-1))'
// //     : 'hsl(var(--destructive))';

// //   const chartConfig = {
// //     value: {
// //       label: 'Value',
// //       color: chartColor
// //     }
// //   };

// //   // ✅ USE ONLY RAW VALUES — ignore month
// //   const trendValues = chartData.map(d => d.value);

// //   // ✅ Convert to Recharts-friendly format
// //   const trendData = trendValues.map((v, i) => ({
// //     index: i,
// //     value: v
// //   }));

// //   return (
// //      <Card className="border border-gray-300 rounded-xl shadow-sm p-4 flex flex-col">

// //       {/* CATEGORY + STATUS TAG */}
// //       <div className="flex justify-between items-center">
// //         <span className="text-[10px] uppercase tracking-wide text-gray-500">
// //           {category}
// //         </span>

// //         <Badge className="text-[10px] bg-blue-100 text-blue-700">
// //           {statusTag}
// //         </Badge>
// //       </div>

// //       {/* TITLE + SUBTITLE */}
// //       <div className="mt-1">
// //         <div className="text-[13px] font-semibold text-gray-900">{title}</div>
// //         {subtitle && (
// //           <div className="text-[11px] text-gray-500 mt-[1px]">{subtitle}</div>
// //         )}
// //       </div>
// // {/* VALUE + COMPARISON (SIDE BY SIDE) */}
// //       <div className="flex justify-between items-center mt-2">
// //         <div className="text-2xl font-semibold tracking-tight">{value}</div>

// //         <div
// //           className={cn(
// //             "text-xs flex items-center gap-1 leading-tight",
// //             isIncrease ? "text-green-600" : "text-red-500"
// //           )}
// //         >
// //           {isIncrease ? (
// //             <ArrowUp className="h-3 w-3" />
// //           ) : (
// //             <ArrowDown className="h-3 w-3" />
// //           )}
// //           {comparison}
// //         </div>
// //       </div>

// //       {/* STATIC LABELS UNDER VALUE ROW */}
// //       <div className="flex justify-between text-[11px] text-gray-500 mt-1">
// //         <span>distribution</span>
// //         <span> growth</span>
// //       </div>



// //       {/* NARRATIVE */}
// //       <div className="text-[11px] text-gray-500 mt-1">{narrative}</div>

// //       {/* ✅ Graph (Values Only) */}
// //       <div className="h-[90px] w-full -mt-1">
// //         <ChartContainer config={chartConfig} className="h-full w-full">
// //           <AreaChart data={trendData} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>

// //             <defs>
// //               <linearGradient id={`${title.replace(/\s+/g, '-')}-fill`} x1="0" y1="0" x2="0" y2="1">
// //                 <stop offset="0%" stopColor={chartColor} stopOpacity={0.8} />
// //                 <stop offset="100%" stopColor={chartColor} stopOpacity={0.05} />
// //               </linearGradient>
// //             </defs>

// //             <Area
// //               dataKey="value"
// //               type="monotone"
// //               strokeWidth={2}
// //               stroke={chartColor}
// //               fill={`url(#${title.replace(/\s+/g, '-')}-fill)`}
// //               activeDot={{ r: 4 }}
// //             />

// //             <ChartTooltip
// //               cursor={{ stroke: "#A0C8FF", strokeWidth: 1 }}
// //               content={<ChartTooltipContent indicator="dot" hideLabel={false} />}
// //               wrapperStyle={{ outline: "none" }}
// //             />
// //           </AreaChart>
// //         </ChartContainer>
// //       </div>

// //     </Card>
// //   );
// // }

// 'use client';

// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { ArrowUp, ArrowDown } from 'lucide-react';
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from '@/components/ui/chart';
// import { Area, AreaChart } from 'recharts';
// import { cn } from '@/lib/utils';

// type KpiCardProps = {
//   category: string;
//   title: string;
//   subtitle?: string;
//   value: string;
//   comparison: string;
//   narrative: string;
//   statusTag: string;
//   trend: "increase" | "decrease";
//   changeType: "increase" | "decrease"; 
//   chartData: { month: string; value: number }[];
// };

// export function KpiCard({
//   category,
//   title,
//   subtitle,
//   value,
//   comparison,
//   narrative,
//   statusTag,
//   trend,
//   changeType,
//   chartData
// }: KpiCardProps) {

//   const isIncrease = changeType === "increase";

//   const chartColor = isIncrease
//     ? 'hsl(var(--chart-1))'
//     : 'hsl(var(--destructive))';

//   const chartConfig = {
//     value: { label: 'Value', color: chartColor }
//   };

//   const trendData = chartData.map((d, i) => ({
//     index: i,
//     value: d.value
//   }));

//   return (
//     <Card className="border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col">

//       {/* CATEGORY + STATUS TAG */}
//       <div className="flex justify-between items-center">
//         <span className="text-[10px] uppercase tracking-wide text-gray-500">
//           {category}
//         </span>

//         <Badge className="text-[10px] bg-blue-100 text-blue-700 px-2 py-[2px]">
//           {statusTag}
//         </Badge>
//       </div>

//       {/* TITLE + SUBTITLE */}
//       <div className="mt-2">
//         <div className="text-[13px] font-semibold text-gray-900">
//           {title}
//         </div>

//         {subtitle && (
//           <div className="text-[11px] text-gray-500 leading-tight">
//             {subtitle}
//           </div>
//         )}
//       </div>

//       {/* VALUE + COMPARISON (PERFECT BASELINE ALIGNMENT) */}
//       <div className="flex justify-between items-baseline mt-2">

//         {/* ✅ Smaller exact size like screenshot */}
//         <div className="text-[18px] font-semibold leading-none text-gray-900">
//           {value}
//         </div>

//         <div
//           className={cn(
//             "flex items-center gap-1 text-[11px] leading-none",
//             isIncrease ? "text-green-600" : "text-red-600"
//           )}
//         >
//           {isIncrease ? (
//             <ArrowUp className="h-3 w-3" />
//           ) : (
//             <ArrowDown className="h-3 w-3" />
//           )}
//           {comparison}
//         </div>
//       </div>

//       {/* ✅ LABELS ALIGN PERFECTLY UNDER BOTH SIDES */}
//       <div className="flex justify-between mt-[2px] text-[10px] text-gray-500">
//         <span>distribution</span>
//         <span>growth</span>
//       </div>

//       {/* NARRATIVE */}
//       <div className="text-[11px] text-gray-700 mt-2">
//         {narrative}
//       </div>

//       {/* GRAPH */}
//       <div className="h-[90px] w-full mt-3">
//         <ChartContainer config={chartConfig} className="h-full w-full">
//           <AreaChart data={trendData} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
//             <defs>
//               <linearGradient id={`${title.replace(/\s+/g, '-')}-fill`} x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor={chartColor} stopOpacity={0.8} />
//                 <stop offset="100%" stopColor={chartColor} stopOpacity={0.05} />
//               </linearGradient>
//             </defs>

//             <Area
//               dataKey="value"
//               type="monotone"
//               strokeWidth={2}
//               stroke={chartColor}
//               fill={`url(#${title.replace(/\s+/g, '-')}-fill)`}
//             />

//             <ChartTooltip
//               cursor={{ stroke: "#A0C8FF", strokeWidth: 1 }}
//               content={<ChartTooltipContent indicator="dot" hideLabel={false} />}
//               wrapperStyle={{ outline: "none" }}
//             />
//           </AreaChart>
//         </ChartContainer>
//       </div>

//     </Card>
//   );
// }

'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, XAxis } from 'recharts';
import { cn } from '@/lib/utils';

type KpiCardProps = {
  category: string;
  title: string;
  subtitle?: string;
  value: string;
  comparison: string;
  narrative: string;
  statusTag: string;
  trend: "increase" | "decrease";
  changeType: "increase" | "decrease";
  casualImpact: string;
  chartData: { month: string; value: number }[];
};

export function KpiCard({
  category,
  title,
  subtitle,
  value,
  comparison,
  narrative,
  statusTag,
  trend,
  changeType,
  casualImpact,
  chartData
}: KpiCardProps) {

  const isIncrease = changeType === "increase";

  // Prefer chart color based on statusTag (high/medium/low)
  const tag = (statusTag || "").toString().toLowerCase();
  const displayStatusTag =
    tag === "high"
      ? "increasing"
      : tag === "medium"
      ? "neutral"
      : tag === "low"
      ? "declining"
      : statusTag;

  const chartColor =
    tag === "high"
      ? '#16a34a' // green-600
      : tag === "medium"
      ? '#d97706' // amber-600
      : tag === "low"
      ? '#dc2626' // red-600
      : isIncrease
      ? 'hsl(var(--chart-1))'
      : 'hsl(var(--destructive))';

  const chartConfig = {
    value: { label: 'Value', color: chartColor }
  };

  const trendData = chartData.map((d) => ({
    month: d.month,
    value: d.value,
  }));

  return (
    <Card
      className="
        border border-gray-200 
        rounded-xl shadow-sm 
        p-4 flex flex-col
        w-[300px]   
        h-[320px]  
      "
    >

      {/* ✅ CATEGORY + STATUS BADGE */}
      <div className="flex justify-between items-center">
        <span className="text-[10px] uppercase tracking-wide text-gray-500">
          {category}
        </span>

        {(() => {
          const tag = (statusTag || "").toString().toLowerCase();
          const base = "text-[10px] px-2 py-[2px]";
          const cls =
            tag === "high"
              ? `${base} bg-green-100 text-green-700`
              : tag === "medium"
              ? `${base} bg-yellow-100 text-yellow-700`
              : tag === "low"
              ? `${base} bg-red-100 text-red-700`
              : `${base} bg-blue-100 text-blue-700`;

          return <Badge className={cls}>{displayStatusTag}</Badge>;
        })()}
      </div>

      {/* ✅ TITLE + SUBTITLE */}
      <div className="mt-2 leading-tight">
        <div className="text-[13px] font-semibold text-gray-900">
          {title}
        </div>

        {/* {subtitle && (
          <div className="text-[11px] text-gray-500">{subtitle}</div>
        )} */}
      </div>

      {/* ✅ VALUE + COMPARISON (aligned perfectly) */}
      <div className="flex justify-start items-baseline mt-2 gap-2">

        {/* ✅ Smaller value EXACTLY like screenshot */}
        <div className="text-[15px] font-semibold leading-none text-gray-900">
          {value}
        </div>

        <div
          className={cn(
            "flex items-center gap-1 text-[11px] leading-none",
            isIncrease ? "text-green-600" : "text-red-600"
          )}
        >
          {isIncrease ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          {comparison}
        </div>
      </div>

      {/* ✅ PERFECT LABEL ALIGNMENT */}
      <div className="flex justify-start items-baseline mt-2 gap-4 text-[10px] text-gray-500">
        {/* <span>CC Volume Abs</span> */}

        {/* ✅ moved closer to comparison & not far from value */}
        {/* <span>{subtitle}</span> */}
      </div>

      {/* ✅ NARRATIVE */}
      <div className="text-[11px] text-gray-700 mt-2 leading-tight">
        {casualImpact}
      </div>

      {/* ✅ GRAPH (same as your code) */}
  <div className="h-[90px] w-full mt-auto">
  <ChartContainer config={chartConfig} className="h-full w-full">
    <AreaChart data={trendData} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
      <XAxis dataKey="month" hide />
      <defs>
        <linearGradient id={`${title.replace(/\s+/g, '-')}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={chartColor} stopOpacity={0.8} />
          <stop offset="100%" stopColor={chartColor} stopOpacity={0.05} />
        </linearGradient>
      </defs>

      <Area
        dataKey="value"
        type="monotone"
        strokeWidth={2}
        stroke={chartColor}
        fill={`url(#${title.replace(/\s+/g, '-')}-fill)`}
        activeDot={{ r: 4 }}
      />

      <ChartTooltip
        cursor={{ stroke: chartColor, strokeWidth: 1 }}
        content={<ChartTooltipContent indicator="dot" hideLabel={false} />}
        wrapperStyle={{ outline: "none" }}
      />
    </AreaChart>
  </ChartContainer>
</div>
    </Card>
  );
}
