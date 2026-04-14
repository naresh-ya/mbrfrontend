import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Default to port 8000 (uvicorn default). Override with FASTAPI_URL env var.
const BACKEND_URL = process.env.FASTAPI_URL ?? "http://127.0.0.1:8000/kpi";

// In production (Azure) there is no FastAPI process — skip the network call entirely.
const USE_MOCK = process.env.NODE_ENV === "production" || process.env.USE_MOCK_DATA === "true";

function loadMockData() {
  const filePath = join(process.cwd(), "backend", "kpi-data.json");
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function GET() {
  if (USE_MOCK) {
    return NextResponse.json(loadMockData());
  }

  try {
    const res = await fetch(BACKEND_URL, { cache: "no-store" });

    if (!res.ok) {
      console.warn(`[KPI] Backend returned ${res.status} — falling back to mock data.`);
      return NextResponse.json(loadMockData());
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      console.warn("[KPI] Backend returned non-JSON response — falling back to mock data.");
      return NextResponse.json(loadMockData());
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.warn("[KPI] Backend unreachable — falling back to mock data.", err);
    return NextResponse.json(loadMockData());
  }
}


