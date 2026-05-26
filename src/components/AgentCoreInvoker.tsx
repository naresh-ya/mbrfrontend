/**
 * AgentCore Invoker Component
 *
 * Example component showing how to use the useAgentCore hook
 */

'use client';

import React, { useState } from 'react';
import { useAgentCore } from '@/hooks/use-agentcore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = ['2024', '2025', '2026'];
const COUNTRIES = ['India'];

export function AgentCoreInvoker() {
  const { invoke, loading, error, results, progress } = useAgentCore();

  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('December');
  const [selectedCountry, setSelectedCountry] = useState('India');

  const handleInvoke = async () => {
    await invoke({
      year: selectedYear,
      month: selectedMonth,
      country: selectedCountry,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>AgentCore Insights Generator</CardTitle>
        <CardDescription>
          Generate comprehensive business insights using the AgentCore-wrapped multi-agent system
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Selection Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Month</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleInvoke}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Insights...
            </>
          ) : (
            'Generate Insights'
          )}
        </Button>

        {/* Progress Indicator */}
        {progress && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>{progress}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && !progress && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Running multi-agent workflow (5-15 minutes)...
              <ul className="mt-2 ml-4 text-xs space-y-1">
                <li>• DataLoaderAgent: Loading data from S3</li>
                <li>• MetricsAgent: Computing Act 1-4 metrics</li>
                <li>• WikiAgent: Building knowledge base</li>
                <li>• RiskAnalysisAgent: Identifying risks</li>
                <li>• ActionPlanAgent: Generating action plans</li>
                <li>• NarrativeAgent: Creating narrative</li>
                <li>• OutputAgent: Formatting results</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Success State with Results */}
        {results && results.status === 'success' && !loading && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-green-800">
                  Insights generated successfully!
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-2xl font-bold text-green-600">
                      {results.metadata?.metrics_count || 0}
                    </div>
                    <div className="text-xs text-gray-600">Acts Analyzed</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-2xl font-bold text-orange-600">
                      {results.metadata?.risks_count || 0}
                    </div>
                    <div className="text-xs text-gray-600">Risks Identified</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-2xl font-bold text-blue-600">
                      {results.metadata?.actions_count || 0}
                    </div>
                    <div className="text-xs text-gray-600">Actions Generated</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((results.metadata?.narrative_length || 0) / 1000)}k
                    </div>
                    <div className="text-xs text-gray-600">Narrative Chars</div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Period: {results.period?.month} {results.period?.year} ({results.period?.country})
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Usage Note */}
        <div className="text-xs text-gray-500 border-t pt-4">
          <p><strong>Note:</strong> This workflow typically takes 5-15 minutes to complete.</p>
          <p className="mt-1">It processes data through 7 specialized agents to generate comprehensive insights.</p>
        </div>
      </CardContent>
    </Card>
  );
}
