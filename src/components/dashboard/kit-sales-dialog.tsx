// "use client";

// import {
//   ArrowDown,
//   ArrowUp,
//   Info,
//   CornerDownLeft,
//   Mic,
//   SendHorizontal,
// } from "lucide-react";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";

// import type { KpiData } from "@/app/lib/data";

// type KitSalesDialogProps = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   data: KpiData | null;
// };

// export function KitSalesDialog({
//   open,
//   onOpenChange,
//   data,
// }: KitSalesDialogProps) {
//   if (!data) return null;

//   const suggestions = [
//     "Show the key drivers.",
//     "Show top risks for this KPI.",
//     "Explain segment shifts.",
//   ];

//   // ✅ Extract insight separately
//   const { insight, ...segments } = data.segmentMix;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent
//         className="
//           sm:max-w-3xl
//           h-[92vh]
//           rounded-xl bg-white shadow-xl
//           p-0 flex flex-col
//           overflow-hidden
//         "
//       >
//         {/* ✅ FIXED HEADER */}
//         <DialogHeader className="px-6 pt-5 pb-3 border-b bg-white">
//           <DialogTitle className="text-xl font-semibold text-gray-900">
//             {data.title}
//           </DialogTitle>
//           <DialogDescription className="text-sm text-gray-500">
//             {data.subtitle}
//           </DialogDescription>
//         </DialogHeader>

//         {/* ✅ SCROLLABLE MID SECTION (scrollbar hidden) */}
//         <div
//           className="
//             flex-1 overflow-y-scroll
//             scrollbar-hide [&::-webkit-scrollbar]:hidden
//             px-6 py-4 space-y-6
//           "
//         >
//           {/* ✅ 3 KPI Tiles */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

//             {/* ✅ Advance Indicator */}
//             <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
//               <span className="text-[11px] text-gray-500">{data.advanceIndicator.label}</span>

//               <div className="flex items-center gap-2 mt-1">
//                 <span className="text-lg font-semibold">{data.advanceIndicator.value}</span>
//                 {data.advanceIndicator.trend === "increase" ? (
//                   <ArrowUp className="h-3 w-3 text-green-600" />
//                 ) : (
//                   <ArrowDown className="h-3 w-3 text-red-500" />
//                 )}
//               </div>
//             </div>

//             {/* ✅ Achievement vs RF */}
//             <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
//               <span className="text-[11px] text-gray-500">{data.achievementVsRF.label}</span>

//               <div className="flex items-center gap-2 mt-1">
//                 <span className="text-lg font-semibold">{data.achievementVsRF.value}</span>

//                 <Badge
//                   className={`
//                     text-[10px] px-2 py-[2px] rounded-full
//                     ${
//                       data.achievementVsRF.status === "On Track"
//                         ? "bg-green-100 text-green-700 border border-green-300"
//                         : data.achievementVsRF.status === "At Risk"
//                         ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
//                         : "bg-red-100 text-red-700 border border-red-300"
//                     }
//                   `}
//                 >
//                   {data.achievementVsRF.status}
//                 </Badge>
//               </div>
//             </div>

//             {/* ✅ Segment Mix */}
//            {/* ✅ Segment Mix */}
// {/* ✅ Segment Mix */}
// {/* ✅ Segment Mix */}
// <div className="p-2 rounded-lg border border-gray-200 bg-gray-50">
//   <span className="text-[11px] text-gray-500">Segment Mix</span>

//   <div className="mt-2 space-y-1">
//     {Object.entries(segments).map(([key, seg]: any) =>
//       key !== "insight" ? (
//         <div
//           key={key}
//           className="
//             flex items-center justify-between 
//             py-1
//           "
//         >
//           {/* LABEL + VALUE LEFT-ALIGNED */}
//           <div className="flex items-center gap-3">
//             <span className="text-[11px] font-medium text-gray-800 w-[80px]">
//               {key.replace("_", " ")}
//             </span>

//             <span className="text-[11px] font-semibold text-gray-900">
//               {seg.value}
//             </span>
//           </div>

//           {/* BADGE RIGHT */}
//           <Badge
//             className={`
//               text-[10px] px-2 py-[1px] rounded-full
//               ${
//                 seg.status === "On Track"
//                   ? "bg-green-100 text-green-700 border border-green-300"
//                   : seg.status === "At Risk"
//                   ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
//                   : "bg-red-100 text-red-700 border border-red-300"
//               }
//             `}
//           >
//             {seg.status}
//           </Badge>
//         </div>
//       ) : null
//     )}
//   </div>

//   {/* Insight (optional) */}
//   {/* <p className="mt-2 text-[10px] text-gray-600 leading-snug">
//     {insight}
//   </p> */}
// </div>

//           </div>

//           {/* ✅ Causal Links */}
//           <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
//             <h4 className="flex items-center text-[12px] font-semibold text-gray-700">
//               <Info className="mr-2 h-4 w-4 text-blue-600" />
//               Causal Links & Impact
//             </h4>

//             <p className="mt-2 text-[13px] text-gray-600 leading-snug">
//               {data.causalLinks.causalImpact}
//             </p>
//           </div>

//           {/* ✅ EXPORT + SIMULATE BUTTONS (Centered like reference UI) */}
//           <div className="flex justify-end gap-4 mt-4">
//             <Button
//               variant="outline"
//               className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6"
//             >
//               EXPORT DATA
//             </Button>

//             <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6">
//               SIMULATE IN SCENARIO PLANNER
//             </Button>
//           </div>
//         </div>

//         {/* ✅ FIXED FOOTER WITH SUGGESTIONS + CHATBOX */}
//         <div className="px-6 py-4 bg-white border-t">

//           {/* Suggested Prompts */}
//           <div className="flex flex-wrap gap-2 mb-3">
//             {suggestions.map((text, idx) => (
//               <div
//                 key={idx}
//                 className="
//                   flex items-center text-[12px] 
//                   px-3 py-1 rounded-md bg-gray-50 
//                   border border-gray-200 text-gray-700 
//                   hover:bg-gray-100 cursor-pointer
//                 "
//               >
//                 <CornerDownLeft className="h-3 w-3 mr-1 text-blue-600" />
//                 {text}
//               </div>
//             ))}
//           </div>

//           {/* ✅ Chatbox with MIC + SEND */}
//           <div className="border border-gray-300 rounded-lg flex items-center p-2 gap-2">

//             <Mic className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />

//             <Input
//               placeholder="Want to dive deeper?"
//               className="border-none shadow-none text-sm flex-1"
//             />

//             <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1">
//               <SendHorizontal className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// "use client";

// import {
//   ArrowDown,
//   ArrowUp,
//   Info,
//   CornerDownLeft,
//   Mic,
//   SendHorizontal,
// } from "lucide-react";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";

// import { useState, useRef, useEffect } from "react";
// import type { KpiData } from "@/app/lib/data";

// type KitSalesDialogProps = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   data: KpiData | null;
// };

// export function KitSalesDialog({
//   open,
//   onOpenChange,
//   data,
// }: KitSalesDialogProps) {

//   // ✅ Extract chat state
//   const [chatInput, setChatInput] = useState("");
//   const [messages, setMessages] = useState<
//     { from: "user" | "system"; text: string }[]
//   >([]);

//   const scrollRef = useRef<HTMLDivElement>(null);

//   // ✅ Auto-scroll chat
//   useEffect(() => {
//     if (scrollRef.current)
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//   }, [messages]);

//   const suggestions = [
//     "Show Segment Insights",
//     "Show trend insights",
    
//   ];

//   if (!data)
//     return (
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent className="sm:max-w-3xl">Loading…</DialogContent>
//       </Dialog>
//     );

//   const { insight, ...segments } = data.segmentMix;

//   const handleSuggestionClick = (text: string) => {
//     setChatInput(text);
//   };

//   const handleSend = () => {
//     if (!chatInput.trim()) return;

//     setMessages((prev) => [...prev, { from: "user", text: chatInput }]);

//     setMessages((prev) => [
//       ...prev,
//       {
//         from: "system",
//         text: `Here's the insight related to "${chatInput}".`,
//       },
//     ]);

//     setChatInput("");
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent
//         className="
//           sm:max-w-3xl
//           h-[92vh]
//           rounded-xl bg-white shadow-xl
//           p-0 flex flex-col
//           overflow-hidden
//         "
//       >
//         {/* ✅ HEADER */}
//         <DialogHeader className="px-6 pt-5 pb-3 border-b bg-white">
//           <DialogTitle className="text-xl font-semibold text-gray-900">
//             {data.title}
//           </DialogTitle>
//           <DialogDescription className="text-sm text-gray-500">
//             {data.subtitle}
//           </DialogDescription>
//         </DialogHeader>

//         {/* ✅ SCROLLABLE MIDDLE */}
//         <div
//           ref={scrollRef}
//           className="
//             flex-1 overflow-y-scroll
//             scrollbar-hide [&::-webkit-scrollbar]:hidden
//             px-6 py-4 space-y-6
//           "
//         >
//           {/* ✅ KPI TILES */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

//             {/* ✅ Advance Indicator */}
//             <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
//               <span className="text-[11px] text-gray-500">
//                 {data.advanceIndicator.label}
//               </span>
//               <div className="flex items-center gap-2 mt-1">
//                 <span className="text-lg font-semibold">
//                   {data.advanceIndicator.value}
//                 </span>
//                 {data.advanceIndicator.trend === "increase" ? (
//                   <ArrowUp className="h-3 w-3 text-green-600" />
//                 ) : (
//                   <ArrowDown className="h-3 w-3 text-red-500" />
//                 )}
//               </div>
//             </div>

//             {/* ✅ Achievement vs RF */}
//             <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
//               <span className="text-[11px] text-gray-500">
//                 {data.achievementVsRF.label}
//               </span>
//               <div className="flex items-center gap-2 mt-1">
//                 <span className="text-lg font-semibold">
//                   {data.achievementVsRF.value}
//                 </span>
//                 <Badge
//                   className={`
//                     text-[10px] px-2 py-[2px] rounded-full
//                     ${
//                       data.achievementVsRF.status === "On Track"
//                         ? "bg-green-100 text-green-700 border border-green-300"
//                         : data.achievementVsRF.status === "At Risk"
//                         ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
//                         : "bg-red-100 text-red-700 border border-red-300"
//                     }
//                   `}
//                 >
//                   {data.achievementVsRF.status}
//                 </Badge>
//               </div>
//             </div>

//             {/* ✅ Segment Mix - FINAL CLEAN VERSION */}
//             <div className="p-2 rounded-lg border border-gray-200 bg-gray-50">
//               <span className="text-[11px] text-gray-500">Segment Mix</span>

//               <div className="mt-2 space-y-1">
//                 {Object.entries(segments).map(([key, seg]: any) =>
//                   key !== "insight" ? (
//                     <div
//                       key={key}
//                       className="flex items-center justify-between py-1"
//                     >
//                       <div className="flex items-center gap-3">
//                         <span className="text-[11px] font-medium text-gray-800 w-[80px]">
//                           {key.replace("_", " ")}
//                         </span>

//                         <span className="text-[11px] font-semibold text-gray-900">
//                           {seg.value}
//                         </span>
//                       </div>

//                       <Badge
//                         className={`
//                           text-[10px] px-2 py-[1px] rounded-full
//                           ${
//                             seg.status === "On Track"
//                               ? "bg-green-100 text-green-700 border border-green-300"
//                               : seg.status === "At Risk"
//                               ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
//                               : "bg-red-100 text-red-700 border border-red-300"
//                           }
//                         `}
//                       >
//                         {seg.status}
//                       </Badge>
//                     </div>
//                   ) : null
//                 )}
//               </div>
// {/* 
//               <p className="mt-2 text-[10px] text-gray-600 leading-snug">
//                 {insight}
//               </p> */}
//             </div>
//           </div>

//           {/* ✅ Causal section */}
//           <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
//             <h4 className="flex items-center text-[12px] font-semibold text-gray-700">
//               <Info className="mr-2 h-4 w-4 text-blue-600" />
//               Causal Links & Impact
//             </h4>
//             <p className="mt-2 text-[13px] text-gray-600 leading-snug">
//               {data.causalLinks.causalImpact}
//             </p>
//           </div>

//           {/* ✅ Buttons */}
//           <div className="flex justify-end gap-4 mt-4">
//             <Button variant="outline" className="px-6">
//               EXPORT DATA
//             </Button>

//             <Button className="bg-blue-600 text-white px-6">
//               SIMULATE IN SCENARIO PLANNER
//             </Button>
//           </div>

//           {/* ✅ CHAT HISTORY */}
//           {messages.length > 0 && (
//             <div className="space-y-3 mt-6">
//               {messages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`text-sm p-3 rounded-md max-w-xl ${
//                     msg.from === "user"
//                       ? "bg-blue-50 text-blue-900 ml-auto"
//                       : "bg-gray-100 text-gray-700"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ✅ FOOTER: Suggestions + Chatbox */}
//         <div className="px-6 py-4 bg-white border-t">

//           {/* Suggestions */}
//           <div className="flex flex-wrap gap-2 mb-3">
//             {suggestions.map((text, idx) => (
//               <div
//                 key={idx}
//                 onClick={() => handleSuggestionClick(text)}
//                 className="
//                   flex items-center text-[12px] px-3 py-1 
//                   rounded-md bg-gray-50 border border-gray-200 
//                   text-gray-700 hover:bg-gray-100 cursor-pointer
//                 "
//               >
//                 <CornerDownLeft className="h-3 w-3 mr-1 text-blue-600" />
//                 {text}
//               </div>
//             ))}
//           </div>

//           {/* Chatbox */}
//           <div className="border border-gray-300 rounded-lg flex items-center p-2 gap-2">
//             <Mic className="h-5 w-5 text-gray-500 cursor-pointer" />

//             <Input
//               placeholder="Want to dive deeper?"
//               value={chatInput}
//               onChange={(e) => setChatInput(e.target.value)}
//               className="border-none shadow-none text-sm flex-1"
//             />

//             <Button
//               onClick={handleSend}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
//             >
//               <SendHorizontal className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";

import {
  ArrowDown,
  ArrowUp,
  Info,
  CornerDownLeft,
  Mic,
  SendHorizontal,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";

import type { KpiData } from "@/app/lib/data";

type KitSalesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: KpiData | null;
};

export function KitSalesDialog({
  open,
  onOpenChange,
  data,
}: KitSalesDialogProps) {
  // ✅ CHAT STATE
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<
    { from: "user" | "system"; text: string }[]
  >([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (!data)
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>Loading…</DialogContent>
      </Dialog>
    );

  // ✅ Extract insight separately (guard if segmentMix is missing)
  const segmentMix = (data.segmentMix ?? {}) as any;
  const { insight, ...segments } = segmentMix;

  // ✅ Get insights data from s3Data if available
  const insightsData = (data as any)?.s3Data?.insights;

  // ✅ SUGGESTION LABELS - dynamic from insights structure
  // If card has insights data, use the section names from JSON
  const suggestions = insightsData
    ? Object.keys(insightsData)
        .filter(key => key !== "executiveSummary" && key !== "forwardLookingRisks" && key !== "ogsmInsightCards")
        .map(key => {
          // Convert camelCase to Title Case (e.g., "segmentInsights" → "Segment Insights")
          return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        })
    : ["Show Segment Insights", "Show Trend Insights", "Show State level hotspots", "TOP 15 CITIES - Volume Drivers"];

  // ✅ Segment Insight Content
  const segmentInsightsText = `
**RF (Regular Filter) - 730.8 Mio | 68.2% share**
> RF is the undisputed volume engine driving YoY growth. High sensitivity to price and promotions means distribution stability is crucial.

**KS Premium - 254.8 Mio | 23.8% share**
> Strong premiumization indicator; contributes meaningful margin uplift driven by metro markets.

**KS High - 82.6 Mio | 7.7% share**
> Mid-tier offering at risk of being squeezed by RF and KS Premium. Needs monitoring in tier-2 markets.

**PF - 3.2 Mio | 0.3% share**
> Negligible presence. Likely being strategically phased out or deprioritized.
`;

  // ✅ Trend Insight Content (detailed)
  const trendInsightsText = `
**Trend insights:**

| Month | Volume (Mio) | MoM Δ | Commentary |
|-------:|-------------:|:-----:|------------|
| Jan-25 | 858.2 | — | Strong opening |
| Feb-25 | 816.3 | **-4.9%** | Seasonal dip (short month) |
| Mar-25 | 883.8 | **+8.3%** | Quarter-end push |
| Apr-25 | 856.3 | **-3.1%** | Post-Q1 normalization |
| May-25 | 877.0 | **+2.4%** | Gradual recovery |
| Jun-25 | 891.9 | **+1.7%** | Pre-monsoon stock building |
| Jul-25 | 876.1 | **-1.8%** | Monsoon softness |
| Aug-25 | 918.4 | **+4.8%** | Festive early stocking |
| Sep-25 | 973.1 | **+6.0%** | ▲ Step-up; festive demand onset |
| Oct-25 | 969.3 | **-0.4%** | Plateau post-Navratri |
| Nov-25 | 1,013.2 | **+4.5%** | Diwali tail + winter onset |
| **Dec-25** | **1,071.3** | **+5.7%** | ▲ **Record high; year-end acceleration** |

---

**Key Trend Signals:**

> 📈 **Structural acceleration in H2 2025:** Average monthly volume Jan–Jun: **863.9 Mio** vs. Jul–Dec average: **970.2 Mio** — a **+12.3% half-on-half step-up**. This is not just festive seasonality; it reflects genuine demand momentum building through the year.

> 📉 **February dip is recurring seasonal pattern:** The Feb dip (-4.9%) is consistent with 28-day month dynamics. Forecasting models should normalize for this to avoid false alarm signals in IMS reporting.

> 📈 **Sep-25 inflection point:** September marked a decisive volume break above the 970 Mio threshold, sustaining through Q4. This could signal new outlet activations, trade promotions landing effectively, or consumption habit shifts.

> ⚠ **October plateau (969.3 Mio) after Sep spike:** The flat MoM in October despite festive Dussehra/Navratri period is mildly concerning — could indicate sell-in front-loading in September, with actual retail offtake catching up in October/November.
`;

  // ✅ State hotspots content
  const stateHotspotsText = `
**State level hotspots:**

| State | Signal | Commentary |
|---|---|---|
| **Delhi NCR** | 🟢 ON FIRE | Single-city state contributing ~20% of national IMS |
| **Uttar Pradesh** | ✅ ON TRACK | Broad-based; Lucknow, Varanasi, Agra, Kanpur all >8 Mio |
| **Telangana** | ✅ ON TRACK | Hyderabad mega-city carries the state; hinterland (Karimnagar, Warangal, Nizamabad) adds depth |
| **Maharashtra** | ✅ ON TRACK | Mumbai + Pune = 70 Mio combined. Strong urban density |
| **Rajasthan** | ✅ ON TRACK | Jaipur flagship + Jodhpur/Udaipur/Kota secondary cluster |
| **Madhya Pradesh** | ✅ SOLID | Indore (13.2 Mio) leads; Bhopal, Gwalior as strong secondaries |
| **Gujarat** | ✅ SOLID | Well-distributed; Ahmedabad + Surat + Rajkot + Vadodara = ~32 Mio |
| **Bihar** | ⚠ WATCH | Patna (17.7 Mio) carries disproportionate state weight — hinterland depth is thin on a per-city basis |
| **West Bengal** | ⚠ AT RISK | Kolkata underperforms; state IMS is fragmented and below potential |
| **Karnataka** | ⚠ WATCH | Bangalore dominates (31.7 Mio); rest of Karnataka (Belgaum, Hubli, Mysore) contributes only ~4 Mio combined — concentrated risk |
| **Tamil Nadu** | ⚠ AT RISK | Chennai (7.6 Mio) is weak; state as a whole is thin despite being a major consumer market |
| **Kerala** | 🔴 LOW PENETRATION | Total Kerala IMS ~0.8 Mio — Cochin leads at 0.29 Mio. Structural market or access challenge |
| **Assam/NE States** | ⚠ NASCENT | Guwahati (2.7 Mio) is the NE hub; Imphal, Shillong, Aizawl are token volumes |
`;

  // ✅ Top 15 cities content
  const top15CitiesText = `
**TOP 15 CITIES — Volume Drivers**

| Rank | City | State | Volume (Mio) | Signal |
|---:|---|---|---:|---|
| 1 | **Delhi NCR** | Delhi NCR | **219.4** | ✅ National anchor |
| 2 | **Hyderabad** | Telangana | **55.9** | ✅ South metro leader |
| 3 | **Mumbai** | Maharashtra | **43.8** | ✅ West anchor |
| 4 | **Bangalore** | Karnataka | **31.7** | ✅ Tech-city premiumization hub |
| 5 | **Pune** | Maharashtra | **26.4** | ✅ Fast-growing metro |
| 6 | **Jaipur** | Rajasthan | **22.6** | ✅ Rajasthan flagship |
| 7 | **Lucknow** | Uttar Pradesh | **20.4** | ✅ UP metro anchor |
| 8 | **Ahmedabad** | Gujarat | **18.0** | ✅ Gujarat leader |
| 9 | **Patna** | Bihar | **17.7** | ✅ East's top performer |
| 10 | **Indore** | Madhya Pradesh | **13.2** | ✅ MP commercial hub |
| 11 | **Varanasi** | Uttar Pradesh | **11.3** | ✅ UP-East volume pillar |
| 12 | **Kolkata** | West Bengal | **10.5** | ⚠ Below-scale for a metro |
| 13 | **Dehradun** | Uttarakhand | **8.6** | ✅ Outperforming city size |
| 14 | **Agra** | Uttar Pradesh | **8.4** | ✅ Consistent UP contributor |
| 15 | **Kanpur** | Uttar Pradesh | **8.3** | ✅ Industrial belt strength |
`;

  // ✅ SUGGESTION CLICK → only fill the input box; user must click Send
  const handleSuggestionClick = (text: string) => {
    setChatInput(text);
  };

  // ✅ SEND BUTTON → add user + system replies
  const handleSend = () => {
    if (!chatInput.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { from: "user", text: chatInput }]);

    // Handle system responses
    if (insightsData) {
      // Dynamic response from insights data
      // Convert button text "Segment Insights" → "segmentInsights"
      const sectionKey = chatInput.replace(/\s/g, '').replace(/^./, str => str.toLowerCase());
      const camelCaseKey = sectionKey.charAt(0).toLowerCase() + sectionKey.slice(1);

      if (insightsData[camelCaseKey]) {
        const sectionData = insightsData[camelCaseKey];
        let responseText = `**${chatInput}:**\n\n`;

        // Format the response based on the data structure
        if (typeof sectionData === 'object' && !Array.isArray(sectionData)) {
          Object.entries(sectionData).forEach(([key, value]) => {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            responseText += `**${formattedKey}:** ${value}\n\n`;
          });
        } else if (Array.isArray(sectionData)) {
          responseText += JSON.stringify(sectionData, null, 2);
        } else {
          responseText += sectionData;
        }

        setMessages((prev) => [
          ...prev,
          { from: "system", text: responseText },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "system", text: `Here is the insight for "${chatInput}".` },
        ]);
      }
    } else {
      // Fallback to hardcoded responses for cards without insights data
      if (chatInput === "Show Segment Insights") {
        setMessages((prev) => [
          ...prev,
          { from: "system", text: segmentInsightsText },
        ]);
      } else if (chatInput === "Show Trend Insights") {
        setMessages((prev) => [
          ...prev,
          { from: "system", text: trendInsightsText },
        ]);
      } else if (chatInput === "Show State level hotspots") {
        setMessages((prev) => [
          ...prev,
          { from: "system", text: stateHotspotsText },
        ]);
      } else if (chatInput === "TOP 15 CITIES - Volume Drivers") {
        setMessages((prev) => [
          ...prev,
          { from: "system", text: top15CitiesText },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "system", text: `Here is the insight for "${chatInput}".` },
        ]);
      }
    }

    setChatInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-3xl 
          h-[92vh]
          rounded-xl bg-white shadow-xl
          p-0 flex flex-col
          overflow-hidden
        "
      >
        {/* ✅ HEADER */}
        <DialogHeader className="px-6 pt-5 pb-3 border-b bg-white">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {data.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {data.subtitle}
          </DialogDescription>
        </DialogHeader>

        {/* ✅ SCROLLABLE CONTENT (Hidden scrollbar) */}
        <div
          ref={scrollRef}
          className="
            flex-1 overflow-y-scroll 
            scrollbar-hide [&::-webkit-scrollbar]:hidden
            px-6 py-4 space-y-6
          "
        >
          {/* ✅ KPI Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* ✅ Advance Indicator */}
            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
              <span className="text-[11px] text-gray-500">
                {data.advanceIndicator.label}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-semibold">
                  {data.advanceIndicator.value}
                </span>

                {data.advanceIndicator.trend === "increase" ? (
                  <ArrowUp className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-500" />
                )}
                
              </div>

              
  <p className="text-[11px] text-gray-600 mt-2 leading-tight">
    {data.advanceIndicator.text}
  </p>

            </div>

            {/* ✅ Achievement vs RF */}
            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
              <span className="text-[11px] text-gray-500">
                {data.achievementVsRF.label}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-semibold">
                  {data.achievementVsRF.value}
                </span>
                <Badge
                  className={`
                    text-[10px] px-2 py-[2px] rounded-full
                    ${
                      data.achievementVsRF.status === "On Track"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : data.achievementVsRF.status === "At Risk"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }
                  `}
                >
                  {data.achievementVsRF.status}
                </Badge>
              </div>
              
 <p className="text-[11px] text-gray-600 mt-2 leading-tight">
      {data.achievementVsRF.text}
    </p>

            </div>

            {/* ✅ Segment Mix */}
            <div className="p-2 rounded-lg border border-gray-200 bg-gray-50">
              <span className="text-[11px] text-gray-500">Segment Mix</span>

              <div className="mt-2 space-y-1">
                {Object.entries(segments).map(([key, seg]: any) =>
                  key !== "insight" ? (
                    <div
                      key={key}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-medium text-gray-800 w-[80px]">
                          {key.replace("_", " ")}
                        </span>

                        <span className="text-[11px] font-semibold text-gray-900">
                          {seg.value}
                        </span>
                      </div>

                      <Badge
                        className={`
                          text-[10px] px-2 py-[1px] rounded-full
                          ${
                            seg.status === "On Track"
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : seg.status === "At Risk"
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                              : "bg-red-100 text-red-700 border border-red-300"
                          }
                        `}
                      >
                        {seg.status}
                      </Badge>
                    </div>
                  ) : null
                )}
              </div>

              {/* <p className="mt-2 text-[10px] text-gray-600 leading-snug">
                {insight}
              </p> */}
            </div>
          </div>

          {/* ✅ Causal Links (extended) */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="flex items-center text-[12px] font-semibold text-gray-700">
              <Info className="mr-2 h-4 w-4 text-blue-600" />
              Causal Links & Impact
            </h4>

            {data.causalLinksExtended && data.causalLinksExtended.length > 0 ? (
              <div className="mt-2 text-[13px] text-gray-600 leading-snug space-y-2">
                {data.causalLinksExtended.map((line, idx) => (
                  <p key={idx} className="m-0">{line}</p>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[13px] text-gray-600 whitespace-pre-line leading-snug">
                {data.causalLinks.causalImpact}
              </p>
            )}
          </div>

          {/* ✅ Buttons */}
          {/* <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" className="px-6">
              Download DATA
            </Button> */}
            {/* <Button className="bg-blue-600 text-white px-6">
              SIMULATE IN SCENARIO PLANNER
            </Button> */}
          {/* </div> */}

          {/* ✅ CHAT HISTORY */}
          {messages.length > 0 && (
  <div className="space-y-3 mt-6">
    {messages.map((msg, i) => (
      <div
        key={i}
        className={`
          text-sm p-3 rounded-md max-w-xl 
          ${
            msg.from === "user"
              ? "bg-blue-50 text-blue-900 ml-auto"
              : "bg-gray-100 text-gray-700"
          }
        `}
      >
        {/* ✅ Markdown Wrapper — tight spacing, no gaps */}
        <div
          className="
            max-w-none
            text-[13px]
            leading-snug
            space-y-1
            [&>p]:m-0 [&>p]:mb-1
            [&>blockquote]:m-0 [&>blockquote]:mb-1
            [&>blockquote]:border-l-2 [&>blockquote]:border-gray-300 [&>blockquote]:pl-2
            [&>strong]:font-semibold
          "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
        </div>
      </div>
    ))}
  </div>

          )}
        </div>

        {/* ✅ FOOTER — Suggestions + Chatbox */}
        <div className="px-6 py-4 bg-white border-t">

          {/* ✅ Suggestions */}
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((text, idx) => (
              <div
                key={idx}
                onClick={() => handleSuggestionClick(text)}
                className="
                  flex items-center text-[12px] 
                  px-3 py-1 rounded-md bg-gray-50 
                  border border-gray-200 text-gray-700 
                  hover:bg-gray-100 cursor-pointer
                "
              >
                <CornerDownLeft className="h-3 w-3 mr-1 text-blue-600" />
                {text}
              </div>
            ))}
          </div>

          {/* ✅ Chatbox */}
          <div className="border border-gray-300 rounded-lg flex items-center p-2 gap-2">
            <Mic className="h-5 w-5 text-gray-500 cursor-pointer" />

            <Input
              placeholder="Want to dive deeper?"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="border-none shadow-none text-sm flex-1"
            />

            <Button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}