<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart } from 'chart.js/auto';

  Chart.defaults.color = 'white';
  const gridColor = '#ccc';

  interface PlayerData {
    name: string;
    rank: number;
    points: number;
  }

  interface LeaderboardEntry {
    data: PlayerData[];
    datetime: string;
    leaderboard: string;
  }

  export let leaderboardData: LeaderboardEntry[];

  let chartInstance: Chart | null = null;
  let chartRef: HTMLCanvasElement;

  function processLeaderboardData(data: LeaderboardEntry[]) {
    if (!Array.isArray(data)) {
      console.error('Data is not an array:', data);
      return [];
    }

    return data.map(entry => ({
      datetime: entry.datetime,
      top10: entry.data.slice(0, 10),
    }));
  }

  function createChartData(data: ReturnType<typeof processLeaderboardData>) {
    if (data.length === 0) return { labels: [], datasets: [] };

    const labels = data.map(entry => {
      const date = new Date(entry.datetime);
      return date.toLocaleDateString(); // Format to show only the date
    });

    const datasets = data[0].top10.map((player, index) => ({
      label: player.name,
      data: data.map(entry => entry.top10[index]?.points || 0),
      borderColor: `hsl(${(index / 10) * 360}, 70%, 50%)`,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      fill: false,
    }));

    return { labels, datasets };
  }

  onMount(() => {
    console.log(leaderboardData)
    const processedData = processLeaderboardData(leaderboardData);
    const chartData = createChartData(processedData);

    const ctx = chartRef.getContext('2d');

    if (ctx) {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: chartData.datasets,
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: '',
              },
              grid: {
                color: gridColor
              }
            },
            y: {
              title: {
                display: true,
                text: 'Points',
              },
              grid: {
                color: gridColor
              }
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
            }
          }
        },
      });
    }

    return () => {
      chartInstance?.destroy();
    };
  });
</script>

<canvas bind:this={chartRef}></canvas>

<style>
</style>
