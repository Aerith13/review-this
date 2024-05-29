import React, { useState, useEffect } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Chart, registerables } from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { deepPurple } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import { colors } from '@mui/material';

Chart.register(...registerables);

const PolarAreaChart = () => {
  const theme = useTheme();

  const [chartData, setChartData] = useState([]);

  // Function to fetch the top coins data from Coingecko API
  const fetchTopCoins = () => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=250&page=1&sparkline=false',
        {
          headers: {
            Accept: 'application/json',
          },
        }
      )
      .then((response) => {
        setChartData(response.data);
      })
      .catch((error) => console.log(error));
  };

  // Call the fetchTopCoins function when the component mounts
  useEffect(() => {
    fetchTopCoins();
  }, []);

  // Prepare the data for the Polar Area chart
  const data = {
    labels: chartData
      .sort((a, b) => b.market_cap - a.market_cap) // Sort the coins by market_cap in descending order
      .slice(0, 3) // Take the top 3 coins
      .map((coin) => coin.name), // Map the coin names to labels
    datasets: [
      {
        data: chartData
          .sort((a, b) => b.market_cap - a.market_cap) // Sort the coins by market_cap in descending order
          .slice(0, 3) // Take the top 3 coins
          .map((coin) => coin.market_cap), // Map the coin market_caps to data
        backgroundColor: [
          deepPurple[600],
          theme.palette.success.dark,
          theme.palette.error.dark,
        ],
        borderWidth: 1,
        borderColor: colors.common.white,
      },
    ],
  };

  // Configuration options for the Polar Area chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    borderWidth: 1,
    backgroundColor: colors.common.white,
    plugins: {
      legend: {
        display: true,
        padding: 20,
        labels: {
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.text.primary
              : theme.palette.text.secondary,
          font: {
            size: 14,
          },
        },
      },
      datalabels: {
        display: true,
        color:
          theme.palette.mode === 'dark'
            ? theme.palette.text.primary
            : theme.palette.text.secondary,
        anchor: 'end',
        align: 'top',
        labels: {
          title: {
            font: {
              weight: 'bold',
              size: 13,
            },
          },
        },
        formatter: (value) => numeral(value).format('$0,0.00'),
      },
    },
  };

  return (
    <Card>
      <CardHeader
        title='Top 3 Cryptocurrencies By Market Cap'
        subheader='Top 3 Cryptocurrencies Measured By Their Market Cap'
      />
      <Divider />
      <CardContent>
        <Box sx={{ height: 400, position: 'relative' }}>
          <PolarArea data={data} options={options} plugins={[ChartDataLabels]} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default PolarAreaChart;
