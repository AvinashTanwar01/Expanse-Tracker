import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomBarChart = ({ data = [], hideCategory }) => { // Added hideCategory prop
  const getBarColor = (index) => {
    return index % 2 === 0 ? "#875cf5" : "#cfbefb";
  };

  const CustomToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white shadow-md p-2 rounded-lg border border-gray-300'>
          {!hideCategory && payload[0].payload.category && (
            <p className='text-xs font-semibold text-purple-800 mb-1'>{`Category: ${payload[0].payload.category}`}</p>
          )}
          <p className='text-sm font-semibold text-gray-600'>Amount: <span className='text-sm font-medium text-gray-900'>${payload[0].payload.amount}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='bg-white mt-6'>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} stroke='none' /> {/* Use 'month' as the dataKey */}
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke='none' />
          <Tooltip content={<CustomToolTip />} />
          <Bar
            dataKey="amount"
            fill="#FF8042"
            radius={[10, 10, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;