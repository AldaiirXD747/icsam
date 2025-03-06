
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

interface StatisticsChartProps {
  data: Array<{name: string; value: number; [key: string]: any}>;
  dataKey: string;
  fill?: string;
  colors?: string[];
  name: string;
  valueFormatter?: (value: number) => string;
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ 
  data, 
  dataKey, 
  fill = "#1a237e", 
  colors, 
  name, 
  valueFormatter = (value) => value.toString() 
}) => {
  // Default colors for bars if not provided
  const defaultColors = ["#1a237e", "#283593", "#303f9f", "#3949ab", "#3f51b5", "#5c6bc0"];
  const barColors = colors || defaultColors;
  
  const formatTooltipValue = (value: any) => {
    if (typeof value === 'number') {
      return valueFormatter(value);
    }
    return value;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#333', fontSize: 12 }}
            tickLine={{ stroke: '#ccc' }}
            axisLine={{ stroke: '#ccc' }}
          />
          <YAxis 
            tick={{ fill: '#333', fontSize: 12 }}
            tickLine={{ stroke: '#ccc' }}
            axisLine={{ stroke: '#ccc' }}
            tickFormatter={valueFormatter}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}
            formatter={formatTooltipValue}
          />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <Bar 
            dataKey={dataKey} 
            name={name}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors ? barColors[index % barColors.length] : fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatisticsChart;
