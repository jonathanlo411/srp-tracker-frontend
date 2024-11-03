<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart } from 'chart.js/auto';
  import namePool from '$lib/playerNameMappings.json'

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

  // Function to get canonical name based on name pool
  function getCanonicalName(name: string): string | null {
    for (const [canonical, names] of Object.entries(namePool)) {
      if (names.includes(name)) {
        return canonical;
      }
    }
    return null;
  }

  function processLeaderboardData(data: LeaderboardEntry[]) {
    if (!Array.isArray(data) || data.length === 0) {
      console.error('Data is not an array or is empty:', data);
      return [];
    }

    // Track the most recent names for each canonical player
    const recentDisplayNames: Record<string, string> = {};

    // Get the most recent top 10 players with mapped names
    const recentTop10Names = data[data.length - 1].data.slice(0, 10).map(player => {
      const canonicalName = getCanonicalName(player.name) || player.name;
      recentDisplayNames[canonicalName] = player.name;  // Use the latest name for display
      return canonicalName;
    });

    return data.map(entry => ({
      datetime: entry.datetime,
      // Map each player to their canonical name and use the latest display name
      top10: entry.data
        .filter(player => recentTop10Names.includes(getCanonicalName(player.name) || player.name))
        .map(player => ({
          ...player,
          name: recentDisplayNames[getCanonicalName(player.name) || player.name]  // Use recent display name
        })),
    }));
  }

  function createChartData(data: ReturnType<typeof processLeaderboardData>) {
    if (data.length === 0) return { labels: [], datasets: [] };

    const labels = data.map(entry => {
      const date = new Date(entry.datetime);
      return date.toLocaleDateString(); // Format to show only the date
    });

    // Use the most recent top 10 players for the datasets
    const recentTop10 = data[data.length - 1].top10;

    const datasets = recentTop10.map((player, index) => ({
      label: player.name,
      data: data.map(entry => {
        const playerData = entry.top10.find(p => p.name === player.name);
        return playerData ? playerData.points : 0;
      }),
      borderColor: `hsl(${(index / 10) * 360}, 70%, 50%)`,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      fill: false,
    }));

    return { labels, datasets };
  }

  onMount(() => {
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
          maintainAspectRatio: window.innerWidth > 1000,
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

<div>
  <canvas bind:this={chartRef}></canvas>
</div>

<style>
  /* Mobile Styling */
  div {
    display: flex;
    justify-content: space-evenly;
  }
  @media screen and (max-width: 1080px) {
    div {
      position: relative;
      height: 400px;
    }
  }
</style>
