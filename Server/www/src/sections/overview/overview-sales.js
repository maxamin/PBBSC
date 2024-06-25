import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  SvgIcon
} from '@mui/material';
import { Chart } from 'src/components/chart';
import { blue } from '@mui/material/colors';



export const OverviewSales = (props) => {
  const { chartSeries, sx, data, labels } = props;
  
  
  const series = [
    {
      name: "Bots",
      data: data,
    },
  ];

  const options = {
    stroke: {
      curve: 'smooth',
    },
    chart: {
      id: "basic-line",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [blue[500]],
    xaxis: {
      categories: labels,
      labels: {
        style: {
        },
      },
    },
    yaxis: {
      labels: {
        style: {
        },
      },
    },
    tooltip: {
      theme: "dark",
    },
  };
  

  

  return (
    <Card sx={sx}>
      <CardHeader
        title="New Bots"
      />
      <CardContent>
        <Chart 
        options={options}
        series={series}
        type="line"
        height={350}
        width="100%" />
      </CardContent>
      <Divider />
    </Card>
  );
};

OverviewSales.protoTypes = {
  chartSeries: PropTypes.array.isRequired,
  sx: PropTypes.object
};
