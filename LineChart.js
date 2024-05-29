import React, { useState, useEffect } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { colors } from '@mui/material';

Chart.register(...registerables);

const LineChart = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

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

  // Prepare the data for the Line chart
  const data = {
    labels: chartData
      .sort((a, b) => b.atl - a.atl) // Sort the coins by atl (all-time-low) in descending order
      .slice(0, 5) // Take the top 5 coins
      .map((coin) => coin.name), // Map the coin names to labels
    datasets: [
      {
        label: 'All-Time-Low',
        fontColor: colors.common.white,
        data: chartData
          .sort((a, b) => b.atl - a.atl) // Sort the coins by atl (all-time-low) in descending order
          .slice(0, 5) // Take the top 5 coins
          .map((coin) => coin.ath), // Map the coin all-time-highs (ath) to data
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderWidth: 2,
      },
    ],
  };

  // Configuration options for the Line chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: isMd ? true : false,
        color:
          theme.palette.mode === 'dark'
            ? theme.palette.text.primary
            : theme.palette.text.secondary,
        align: 'top',
        labels: {
          title: {
            font: {
              weight: 'bold',
              size: 13,
            },
            padding: 10,
          },
        },
        formatter: (value) => numeral(value).format('$0,0.00'),
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.primary,
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.primary,
          padding: 10,
          callback: (value) => numeral(value).format('$0,0.00'),
        },
        display: true,
        borderDash: [5, 5],
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader
        title='Top 5 Cryptocurrencies By All-Time-Low'
        subheader='Top 5 Cryptocurrencies Measured By Their All-Time-Low (ATL)'
      />
      <Divider />
      <CardContent>
        <Box sx={{ height: 400, position: 'relative' }}>
          <Line data={data} options={options} plugins={[ChartDataLabels]} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default LineChart;
