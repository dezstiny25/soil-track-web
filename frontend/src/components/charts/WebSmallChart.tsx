import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(utc);
dayjs.extend(timezone);
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
  isMini?: boolean;
}

const TARGET_TIMEZONE = 'Asia/Shanghai';

const COLOR_MAP: Record<string, string> = {
  moisture: '#1E88E5',
  nitrogen: '#FFEB3B',
  phosphorus: '#9C27B0',
  potassium: '#E91E63',
};

const TIME_RANGES: Record<'1D' | '1W' | '1M' | '3M', number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
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
  const filteredReadings = useMemo(() => {
  const now = dayjs().tz(TARGET_TIMEZONE);
  let startDate = currentStartDate;

  if (selectedRange !== 'custom') {
    const daysBack = TIME_RANGES[selectedRange];
    startDate = now.subtract(daysBack, 'day');
  }

  return readings
    .filter(r => {
      const readTime = dayjs(r.read_time).tz(TARGET_TIMEZONE);
      return (
        r[dataKey] !== null &&
        r[dataKey] !== undefined &&
        readTime.isSameOrAfter(startDate) &&
        readTime.isSameOrBefore(now)
      );
    })
    .sort(
      (a, b) =>
        dayjs(a.read_time).tz(TARGET_TIMEZONE).valueOf() -
        dayjs(b.read_time).tz(TARGET_TIMEZONE).valueOf()
    );
}, [readings, dataKey, selectedRange, currentStartDate]);


  const categories = filteredReadings.map(r =>
    dayjs.utc(r.read_time).tz(TARGET_TIMEZONE).format()
  );

  const dataValues = filteredReadings.map(r => r[dataKey]);

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
      sparkline: { enabled: isMini },
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
      x: {
        formatter: (val: string | number) =>
          dayjs(val).tz(TARGET_TIMEZONE).format('DD MMM YYYY h:mm A'),
      },
      y: {
        formatter: (val: number) => `${val} mg/L`,
      },
    },
    legend: { show: false },
    grid: { show: !isMini },
  };

  const series = [
    {
      name: title,
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
