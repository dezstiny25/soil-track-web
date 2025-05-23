import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { MoistureReading, NutrientReading } from '../../store/usePlotStore';

interface WebSoilChartProps {
  moistureData: MoistureReading[];
  nutrientData: NutrientReading[];
}

const WebSoilChart: React.FC<WebSoilChartProps> = ({ moistureData, nutrientData }) => {
  const categories = moistureData.map((m) => m.read_time);
  const series = [
    {
      name: 'Moisture',
      data: moistureData.map((m) => m.soil_moisture),
    },
    {
      name: 'Nutrients',
      data: nutrientData.map((n) =>
        (n.readed_nitrogen + n.readed_phosphorus + n.readed_potassium) / 3
      ),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      type: 'area',
      toolbar: { show: false },
    },
    colors: ['#1E88E5', '#43A047'],
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
      y: { formatter: (val: number) => `${val}%` },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
  };

  return <ReactApexChart options={options} series={series} type="area" height={300} />;
};

export default WebSoilChart;
