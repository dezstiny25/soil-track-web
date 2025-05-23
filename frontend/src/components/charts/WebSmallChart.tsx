import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface WebSmallChartProps {
  label: string;
  data: number[];
}

const WebSmallChart: React.FC<WebSmallChartProps> = ({ label, data }) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 60,
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    colors: ['#F5A623'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.7,
        stops: [10, 90, 100],
      },
    },
    xaxis: {
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

  const series = [{ name: label, data }];

  return <ReactApexChart options={options} series={series} type="area" height={60} width="100%" />;
};

export default WebSmallChart;
