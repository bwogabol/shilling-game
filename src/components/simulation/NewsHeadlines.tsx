import React from 'react';
import { Newspaper } from 'lucide-react';
import { Headline } from '../../types/game';

interface NewsHeadlinesProps {
  headlines: Headline[];
  year: number;
}

export const NewsHeadlines: React.FC<NewsHeadlinesProps> = ({ headlines, year }) => {
  return (
    <div className="tactical-panel rounded-xl p-5 border border-gray-800">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white font-display uppercase tracking-wide">
            National Press & Gazette Dispatches
          </h3>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
          Year {year} Coverage
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {headlines.map((item) => {
          let borderAccent = 'border-l-4 border-l-gray-600';
          let tagColor = 'bg-gray-800 text-gray-300';
          if (item.type === 'positive') {
            borderAccent = 'border-l-4 border-l-emerald-500';
            tagColor = 'bg-emerald-950 text-emerald-300 border border-emerald-800/80';
          } else if (item.type === 'negative') {
            borderAccent = 'border-l-4 border-l-rose-500';
            tagColor = 'bg-rose-950 text-rose-300 border border-rose-800/80';
          } else {
            borderAccent = 'border-l-4 border-l-amber-500';
            tagColor = 'bg-amber-950 text-amber-300 border border-amber-800/80';
          }

          return (
            <div
              key={item.id}
              className={`bg-[#0e141d] p-4 rounded-r-lg border-y border-r border-gray-800/90 ${borderAccent} flex flex-col justify-between hover:bg-[#121924] transition`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-2">
                  <span className="font-semibold text-gray-300">{item.source}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${tagColor}`}>
                    {item.tag}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-gray-100 font-display leading-snug">
                  "{item.title}"
                </h4>

                <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-800/60 flex justify-between items-center text-[10px] font-mono text-gray-400">
                <span>Bureau Dispatch</span>
                <span>Verified by National Monitoring</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
