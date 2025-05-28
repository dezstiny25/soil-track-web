import React, { useState, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

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
}

const TIME_RANGES = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
};

const COLOR_MAP: Record<string, string> = {
  moisture: '#1E88E5',    // blue
  nitrogen: '#FFEB3B',    // yellow
  phosphorus: '#9C27B0',  // purple
  potassium: '#E91E63',   // pink
};

const WebDetailedChart: React.FC<WebDetailedChartProps> = ({ readings, dataKey, title, unit = '' }) => {
  const [selectedRange, setSelectedRange] = useState<'1D' | '1W' | '1M' | '3M'>('1D');
  const [currentStartDate, setCurrentStartDate] = useState(dayjs());

  // Determine color based on dataKey
  const color = (() => {
    const key = dataKey.toLowerCase();
    if (key.includes('moisture')) return COLOR_MAP.moisture;
    if (key.includes('nitrogen')) return COLOR_MAP.nitrogen;
    if (key.includes('phosphorus')) return COLOR_MAP.phosphorus;
    if (key.includes('potassium')) return COLOR_MAP.potassium;
    return '#134F14'; // default green
  })();

  const days = TIME_RANGES[selectedRange];

  // Calculate the window of time shown based on currentStartDate and selectedRange
  const windowStart = currentStartDate.startOf('day');
  const windowEnd = windowStart.add(days - 1, 'day').endOf('day');

  // Filter readings for the selected time window
  const filteredReadings = useMemo(() => {
    return readings.filter((r) => {
      const time = dayjs(r.read_time);
      return time.isSameOrAfter(windowStart) && time.isSameOrBefore(windowEnd);
    });
  }, [readings, windowStart, windowEnd]);

  const categories = filteredReadings.map(r => r.read_time);
  const dataValues = filteredReadings.map(r => r[dataKey]);

  // Determine if Back and Forward buttons should be disabled
  const earliestReading = dayjs(readings.reduce((min, r) => (dayjs(r.read_time).isBefore(min) ? r.read_time : min), readings[0]?.read_time));
  const latestReading = dayjs(readings.reduce((max, r) => (dayjs(r.read_time).isAfter(max) ? r.read_time : max), readings[0]?.read_time));

  const canGoBack = windowStart.isAfter(earliestReading.startOf('day'));
  const canGoForward = windowEnd.isBefore(latestReading.endOf('day'));

  const goBack = () => {
    if (!canGoBack) return;
    setCurrentStartDate(windowStart.subtract(days, 'day'));
  };

  const goForward = () => {
    if (!canGoForward) return;
    setCurrentStartDate(windowStart.add(days, 'day'));
  };

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
      labels: {
        style: { colors: '#666', fontSize: '12px' },
      },
    },
    tooltip: {
      x: { format: 'dd MMM yyyy' },
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
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold text-gray-700">{title}</h3>
        <div className="flex space-x-2 text-sm">
          {Object.keys(TIME_RANGES).map((range) => (
            <button
              key={range}
              onClick={() => {
                setSelectedRange(range as keyof typeof TIME_RANGES);
                setCurrentStartDate(dayjs()); // reset to today when changing range
              }}
              className={`px-2 py-1 rounded ${
                selectedRange === range ? 'bg-green-900 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className={`px-3 py-1 rounded ${
            canGoBack ? 'bg-green-900 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Back
        </button>
        <div className="text-sm text-gray-600">
          {windowStart.format('DD MMM YYYY')} - {windowEnd.format('DD MMM YYYY')}
        </div>
        <button
          onClick={goForward}
          disabled={!canGoForward}
          className={`px-3 py-1 rounded ${
            canGoForward ? 'bg-green-900 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Forward
        </button>
      </div>

      <ReactApexChart options={options} series={series} type="area" height={300} />
    </div>
  );
};

export default WebDetailedChart;
