import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface Reading {
  read_time: string;
  [key: string]: any;
}

interface WebSmallChartProps {
  readings: Reading[];
  dataKey: string;
  title: string;
  unit?: string;
  selectedRange: '1D' | '1W' | '1M' | '3M' | 'custom';
  currentStartDate: Dayjs;
  currentEndDate?: Dayjs;
  isMini? : boolean;
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

const WebSmallChart: React.FC<WebSmallChartProps> = ({
  readings,
  dataKey,
  title,
  unit = 'mg/L',
  selectedRange,
  currentStartDate,
  currentEndDate,
  isMini = false,
}) => {
  const [windowStart, windowEnd] = useMemo(() => {
    if (selectedRange === 'custom' && currentEndDate) {
      return [currentStartDate.startOf('day'), currentEndDate.endOf('day')];
    }
    const days = TIME_RANGES[selectedRange as keyof typeof TIME_RANGES];
    return [
      currentStartDate.startOf('day'),
      currentStartDate.add(days - 1, 'day').endOf('day'),
    ];
  }, [selectedRange, currentStartDate, currentEndDate]);

  const filteredReadings = useMemo(() => {
    return readings.filter((r) => {
      const time = dayjs(r.read_time);
      return time.isSameOrAfter(windowStart) && time.isSameOrBefore(windowEnd);
    });
  }, [readings, windowStart, windowEnd]);

  const categories = filteredReadings.map((r) => r.read_time);
  const dataValues = filteredReadings.map((r) => r[dataKey]);

  const color = (() => {
    const key = dataKey.toLowerCase();
    if (key.includes('moisture')) return COLOR_MAP.moisture;
    if (key.includes('nitrogen')) return COLOR_MAP.nitrogen;
    if (key.includes('phosphorus')) return COLOR_MAP.phosphorus;
    if (key.includes('potassium')) return COLOR_MAP.potassium;
    return '#134F14';
  })();

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: isMini }, // enables tiny chart mode
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
      labels: { show: !isMini },
      axisBorder: { show: !isMini },
      axisTicks: { show: !isMini },
    },
    yaxis: {
      labels: { show: !isMini },
    },
    tooltip: {
      enabled: true,
      x: { format: 'dd MMM yyyy h:mm A' },
      y: {
        formatter: (val: number) => `${val} mg/L`,
      },
    },
    legend: { show: false },
    grid: { show: !isMini },
  };

  const series = [
    {
      name: '',
      data: dataValues,
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={isMini ? 50 : 200}
      width="100%"
    />
  );
};

export default WebSmallChart;