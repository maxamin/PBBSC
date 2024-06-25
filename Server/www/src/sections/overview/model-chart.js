import React from 'react';
import Chart from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
import { Card, CardHeader, CardContent, Stack } from '@mui/material';



const HorizontalBarChart = (props) => {
  const { vals, labels } = props;

  const dataSet = {
    labels: labels,
    datasets: [
      {
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: vals,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  
  return (
    <Card>
      <CardHeader title="Models" />
      <Bar options={options} data={dataSet} />
      <CardContent>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
      </Stack>
      </CardContent>
    </Card>
  );
};

export default HorizontalBarChart;
