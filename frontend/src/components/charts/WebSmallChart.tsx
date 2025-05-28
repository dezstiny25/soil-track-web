import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';

interface Reading {
  read_time: string;
  [key: string]: any;
}

interface WebSmallChartProps {
  label: 'Nitrogen' | 'Phosphorus' | 'Potassium';
  readings: Reading[];
}

const labelColors: Record<string, string> = {
  Nitrogen: '#F5A623',     // yellow-orange
  Phosphorus: '#9C27B0',   // purple
  Potassium: '#EC407A',    // pink
};

const labelKeys: Record<string, string> = {
  Nitrogen: 'readed_nitrogen',
  Phosphorus: 'readed_phosphorus',
  Potassium: 'readed_potassium',
};

const WebSmallChart: React.FC<WebSmallChartProps> = ({ label, readings }) => {
  const color = labelColors[label];
  const dataKey = labelKeys[label];

  const sameDayData = useMemo(() => {
    if (readings.length === 0) return [];

    const latestDate = dayjs(readings[readings.length - 1].read_time).format('YYYY-MM-DD');

    return readings
      .filter(r => dayjs(r.read_time).format('YYYY-MM-DD') === latestDate)
      .map(r => ({
        x: r.read_time,
        y: r[dataKey]
      }));
  }, [readings, dataKey]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 60,
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    colors: [color],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: 'datetime',
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    grid: { show: false },
    tooltip: { enabled: false },
    legend: { show: false },
  };

  const series = [{ name: label, data: sameDayData }];

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="area" height={60} width="100%" />
    </div>
  );
};

export default WebSmallChart;
