import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import { MoistureReading, NutrientReading } from '../../store/usePlotStore';

interface WebSoilChartProps {
  moistureData: MoistureReading[];
  nutrientData: NutrientReading[];
}

const WebSoilChart: React.FC<WebSoilChartProps> = ({ moistureData, nutrientData }) => {
  const latestMoistureDate = useMemo(() => {
    if (!moistureData.length) return null;
    return dayjs(moistureData[moistureData.length - 1].read_time).format('YYYY-MM-DD');
  }, [moistureData]);

  const filteredMoisture = useMemo(() => {
    return moistureData.filter(m =>
      dayjs(m.read_time).format('YYYY-MM-DD') === latestMoistureDate
    ).map(m => ({
      x: m.read_time,
      y: m.soil_moisture,
    }));
  }, [moistureData, latestMoistureDate]);

  const filteredNutrients = useMemo(() => {
    return nutrientData.filter(n =>
      dayjs(n.read_time).format('YYYY-MM-DD') === latestMoistureDate
    ).map(n => ({
      x: n.read_time,
      y: (n.readed_nitrogen + n.readed_phosphorus + n.readed_potassium) / 3,
    }));
  }, [nutrientData, latestMoistureDate]);

  const series = [
    {
      name: 'Moisture',
      data: filteredMoisture,
    },
    {
      name: 'Avg Nutrients',
      data: filteredNutrients,
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
      x: { format: 'dd MMM yyyy HH:mm' },
      y: { formatter: (val: number) => `${val.toFixed(2)}%` },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
  };

  return <ReactApexChart options={options} series={series} type="area" height={300} />;
};

export default WebSoilChart;
