import React, { useState, useEffect } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import { colors } from '@mui/material';

Chart.register(...registerables);

const CryptoByVolumePieChart = () => {
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

  // Prepare the data for the Pie chart
  const data = {
    labels: chartData
      .sort((a, b) => b.total_volume - a.total_volume) // Sort the coins by total_volume in descending order
      .slice(0, 3) // Take the top 3 coins
      .map((coin) => coin.name), // Map the coin names to labels
    datasets: [
      {
        data: chartData
          .sort((a, b) => b.total_volume - a.total_volume) // Sort the coins by total_volume in descending order
          .slice(0, 3) // Take the top 3 coins
          .map((coin) => coin.total_volume), // Map the coin total volumes to data
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.error.dark,
          theme.palette.customYellow.dark,
        ],
        borderWidth: 1,
        borderColor: colors.common.white,
      },
    ],
  };

  // Configuration options for the Pie chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
    },
    plugins: {
      legend: {
        display: true,
        padding: 30,
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: 14,
          },
        },
      },
      datalabels: {
        display: true,
        color: colors.common.white,
        align: 'center',
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
        title='Top 3 Cryptocurrencies By Volume'
        subheader='Top 3 Cryptocurrencies Measured By Their Total Volume'
      />
      <Divider />
      <CardContent>
        <Box sx={{ height: 400, position: 'relative' }}>
          <Pie data={data} options={options} plugins={[ChartDataLabels]} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CryptoByVolumePieChart;
