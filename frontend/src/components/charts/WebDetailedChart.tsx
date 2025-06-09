import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import PercentageChange from './PercentageChange';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface Reading {
  read_time: string;
  [key: string]: any;
}

interface WebDetailedChartProps {
  readings: Reading[];
  dataKey: string;
  title: string;
  unit?: string;
  selectedRange: '1D' | '1W' | '1M' | '3M' | 'custom';
  currentStartDate: Dayjs;
  currentEndDate?: Dayjs;
}

const TIME_RANGES: Record<'1D' | '1W' | '1M' | '3M', number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
};

const COLOR_MAP: Record<string, string> = {
  moisture: '#1E88E5',
  nitrogen: '#FFEB3B',
  phosphorus: '#9C27B0',
  potassium: '#E91E63',
};

const WebDetailedChart: React.FC<WebDetailedChartProps> = ({
  readings,
  dataKey,
  title,
  unit = '',
  selectedRange,
  currentStartDate,
  currentEndDate,
}) => {
  // We no longer need windowStart/windowEnd for '1D' as per new logic
  // But you can keep or modify this part for other ranges if needed

 const filteredReadings = useMemo(() => {
  const now = dayjs().tz('Asia/Shanghai');
  let startDate = currentStartDate;

  if (selectedRange !== 'custom') {
    const daysBack = TIME_RANGES[selectedRange];
    startDate = now.subtract(daysBack, 'day');
  }

  return readings
    .filter(r => {
      const readTime = dayjs(r.read_time).tz('Asia/Shanghai');
      return (
        r[dataKey] !== null &&
        r[dataKey] !== undefined &&
        readTime.isSameOrAfter(startDate) &&
        readTime.isSameOrBefore(now)
      );
    })
    .sort((a, b) =>
      dayjs(a.read_time).tz('Asia/Shanghai').valueOf() -
      dayjs(b.read_time).tz('Asia/Shanghai').valueOf()
    );
}, [readings, dataKey, selectedRange, currentStartDate]);


  const categories = filteredReadings.map(r => r.read_time);
  const dataValues = filteredReadings.map(r => r[dataKey]);

  // Compute latest and previous for % change
const latest = filteredReadings.at(-1)?.[dataKey] ?? null;
const previous = filteredReadings.at(0)?.[dataKey] ?? null;


  const color = (() => {
    const key = dataKey.toLowerCase();
    if (key.includes('moisture')) return COLOR_MAP.moisture;
    if (key.includes('nitrogen')) return COLOR_MAP.nitrogen;
    if (key.includes('phosphorus')) return COLOR_MAP.phosphorus;
    if (key.includes('potassium')) return COLOR_MAP.potassium;
    return '#134F14'; // default
  })();

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 300,
      type: 'area',
      toolbar: { show: false },
    },
    colors: [color],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: 'datetime',
      categories,
      labels: {
        style: { colors: '#666', fontSize: '12px' },
      },
    },
    yaxis: {
      min: 0,
      max: 200,
      tickAmount: 4,
      labels: {
        style: { colors: '#666', fontSize: '12px' },
      },
    },
    tooltip: {
      x: {
        formatter: (val: string | number) => {
          // val is usually the timestamp in milliseconds or ISO string
          return dayjs(val).tz('Asia/Shanghai').format('DD MMM YYYY h:mm A');
        },
      },
      y: {
        formatter: (val: number) => `${val}${unit}`,
      },
    },

    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: title,
      data: dataValues,
    },
  ];

  return (
    <div className="p-4 bg-white">
      <div className="px-4 mb-2 flex items-center justify-between">
        <h3 className="text-md font-semibold text-gray-700">{title}</h3>
        <PercentageChange current={latest} previous={previous} />
      </div>
      <ReactApexChart options={options} series={series} type="area" height={300} />
    </div>
  );
};

export default WebDetailedChart;
