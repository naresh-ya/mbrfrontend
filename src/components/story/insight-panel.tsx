import type { StoryData } from '@/app/lib/story-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

type InsightPanelProps = {
  data: StoryData;
};

export function InsightPanel({ data }: InsightPanelProps) {
  return (
    <Card className="h-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Newspaper className="h-5 w-5 text-primary" />
          <span>{data.headline}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-foreground/90">
        <div className="space-y-4 text-base leading-relaxed">
          {data.insights.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <ul className="space-y-2">
          {data.bulletPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
