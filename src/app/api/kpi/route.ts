import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

function loadKPIData() {
  const filePath = join(process.cwd(), "data", "kpi-data.json");
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function GET() {
  return NextResponse.json(loadKPIData());
}


