import React, { useState } from 'react';
import { SimulationResult } from '../../types/game';

interface TrajectoryChartProps {
  result: SimulationResult;
  selectedYear: 1 | 5 | 10;
  onSelectYear: (year: 1 | 5 | 10) => void;
}

type MetricKey = 'gdpGrowth' | 'debtToGdp' | 'foodSecurity' | 'hdi' | 'publicApproval' | 'infrastructureIndex';

interface MetricMeta {
  key: MetricKey;
  label: string;
  unit: string;
  baseline: number;
  color: string;
  min: number;
  max: number;
}

const METRIC_CONFIGS: MetricMeta[] = [
  { key: 'gdpGrowth', label: 'GDP Growth', unit: '%', baseline: 5.2, color: '#10b981', min: 0, max: 12 },
  { key: 'debtToGdp', label: 'Public Debt-to-GDP', unit: '%', baseline: 68.0, color: '#f43f5e', min: 35, max: 110 },
  { key: 'foodSecurity', label: 'Food Security Index', unit: '/100', baseline: 52.0, color: '#f59e0b', min: 10, max: 100 },
  { key: 'hdi', label: 'Human Development (HDI)', unit: '/100', baseline: 58.0, color: '#6366f1', min: 20, max: 100 },
  { key: 'publicApproval', label: 'Public Approval', unit: '%', baseline: 50.0, color: '#06b6d4', min: 0, max: 100 },
  { key: 'infrastructureIndex', label: 'Infrastructure & Energy', unit: '/100', baseline: 55.0, color: '#eab308', min: 20, max: 100 }
];

export const TrajectoryChart: React.FC<TrajectoryChartProps> = ({
  result,
  selectedYear,
  onSelectYear
}) => {
  const [activeMetricKey, setActiveMetricKey] = useState<MetricKey>('gdpGrowth');

  const activeMeta = METRIC_CONFIGS.find(m => m.key === activeMetricKey)!;

  // 4 timeline points: Year 0 (baseline), Year 1, Year 5, Year 10
  const points = [
    { year: 0, label: 'Year 0 (Start)', val: activeMeta.baseline },
    { year: 1, label: 'Year 1', val: result.years[1].metrics[activeMetricKey] },
    { year: 5, label: 'Year 5', val: result.years[5].metrics[activeMetricKey] },
    { year: 10, label: 'Year 10', val: result.years[10].metrics[activeMetricKey] }
  ];

  // Chart layout dimensions
  const width = 640;
  const height = 220;
  const padding = { top: 25, right: 35, bottom: 35, left: 55 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // X coords for 4 steps: 0, 1, 5, 10
  const getX = (idx: number) => padding.left + (idx / (points.length - 1)) * chartW;

  // Y coord based on min/max
  const getY = (val: number) => {
    const clamped = Math.max(activeMeta.min, Math.min(activeMeta.max, val));
    const ratio = (clamped - activeMeta.min) / (activeMeta.max - activeMeta.min);
    return padding.top + chartH - ratio * chartH;
  };

  const pathD = points.reduce((acc, p, idx) => {
    const x = getX(idx);
    const y = getY(p.val);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const areaD = `${pathD} L ${getX(points.length - 1)} ${padding.top + chartH} L ${getX(0)} ${padding.top + chartH} Z`;

  // Gridlines
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map(ratio => {
    const val = activeMeta.min + ratio * (activeMeta.max - activeMeta.min);
    const y = padding.top + chartH - ratio * chartH;
    return { val: Math.round(val * 10) / 10, y };
  });

  return (
    <div className="tactical-panel rounded-xl p-5 border border-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <span>Decade Trajectory Projection</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
              0y → 1y → 5y → 10y
            </span>
          </h3>
          <p className="text-xs text-gray-400 font-mono">
            Track multi-horizon evolution across key macroeconomic and human indices
          </p>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {METRIC_CONFIGS.map((m) => (
            <button
              key={m.key}
              onClick={() => setActiveMetricKey(m.key)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                activeMetricKey === m.key
                  ? 'bg-gray-700 text-white font-bold border border-gray-500'
                  : 'bg-[#121822] text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-56 select-none">
          <defs>
            <linearGradient id={`grad-${activeMetricKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeMeta.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={activeMeta.color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((t, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={t.y}
                x2={width - padding.right}
                y2={t.y}
                stroke="#1f2937"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 8}
                y={t.y + 4}
                fill="#6b7280"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {t.val}{activeMeta.unit}
              </text>
            </g>
          ))}

          {/* Baseline reference line */}
          <line
            x1={padding.left}
            y1={getY(activeMeta.baseline)}
            x2={width - padding.right}
            y2={getY(activeMeta.baseline)}
            stroke="#4b5563"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Gradient area */}
          <path d={areaD} fill={`url(#grad-${activeMetricKey})`} />

          {/* Main Trajectory Line */}
          <path
            d={pathD}
            fill="none"
            stroke={activeMeta.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => {
            const cx = getX(idx);
            const cy = getY(p.val);
            const isSelected = p.year === selectedYear;

            return (
              <g
                key={idx}
                className="cursor-pointer group"
                onClick={() => {
                  if (p.year > 0) onSelectYear(p.year as 1 | 5 | 10);
                }}
              >
                {/* Highlight circle if selected horizon */}
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="10"
                    fill={activeMeta.color}
                    fillOpacity="0.25"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? "6" : "4.5"}
                  fill="#0b0f15"
                  stroke={activeMeta.color}
                  strokeWidth={isSelected ? "3" : "2"}
                />

                {/* Value Label */}
                <text
                  x={cx}
                  y={cy - 10}
                  fill="#f3f4f6"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {p.val}{activeMeta.unit}
                </text>

                {/* X-axis tick label */}
                <text
                  x={cx}
                  y={padding.top + chartH + 18}
                  fill={isSelected ? activeMeta.color : "#9ca3af"}
                  fontSize="11"
                  fontWeight={isSelected ? "bold" : "normal"}
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-2 text-right text-[11px] font-mono text-gray-400">
        * Click any data point to switch to that horizon report
      </div>
    </div>
  );
};
