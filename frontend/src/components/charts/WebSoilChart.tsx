import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import { MoistureReading, NutrientReading } from '../../store/usePlotStore';

interface WebSoilChartProps {
  moistureData: MoistureReading[];
  nutrientData: NutrientReading[];
  filterType: '1D' | '1W' | '1M' | '3M' | 'custom';
  selectedDate: Date;
}

const WebSoilChart: React.FC<WebSoilChartProps> = ({
  moistureData,
  nutrientData,
  filterType,
  selectedDate
}) => {
  const startDate = useMemo(() => {
    const base = dayjs(selectedDate);
    switch (filterType) {
      case '1D':
        return base.startOf('day');
      case '1W':
        return base.subtract(7, 'day');
      case '1M':
        return base.subtract(1, 'month');
      case '3M':
        return base.subtract(3, 'month');
      case 'custom':
      default:
        return base.startOf('day');
    }
  }, [filterType, selectedDate]);

  const endDate = useMemo(() => dayjs(selectedDate).endOf('day'), [selectedDate]);

  const filteredMoisture = useMemo(() => {
    return moistureData
      .filter((m) => {
        const readTime = dayjs(m.read_time);
        return readTime.isAfter(startDate) && readTime.isBefore(endDate);
      })
      .map((m) => ({
        x: m.read_time,
        y: m.soil_moisture,
      }));
  }, [moistureData, startDate, endDate]);

  const filteredNutrients = useMemo(() => {
    return nutrientData
      .filter((n) => {
        const readTime = dayjs(n.read_time);
        return readTime.isAfter(startDate) && readTime.isBefore(endDate);
      })
      .map((n) => ({
        x: n.read_time,
        y: (n.readed_nitrogen + n.readed_phosphorus + n.readed_potassium) / 3,
      }));
  }, [nutrientData, startDate, endDate]);

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
