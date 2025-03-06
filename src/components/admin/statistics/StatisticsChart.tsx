
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface StatisticsChartProps {
  data: Array<{name: string; [key: string]: any}>;
  dataKey: string;
  fill: string;
  name: string;
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ data, dataKey, fill, name }) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={fill} name={name} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatisticsChart;
