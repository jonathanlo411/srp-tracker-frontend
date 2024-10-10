<script lang='ts'>
  import { onMount } from 'svelte';
  import LineChart from "$lib/client/lineChart.svelte";
  import { fetchTrackerData } from '$lib/client/util';

  let trackerData: Record<string, LeaderboardSnapshot[]> = {};
  let isLoaded: boolean = false;
  let leaderboards = [
    'Combined',
    'Clawies Selection Carpack',
    'Default',
    'Traffic',
    'TrafficSlow'
  ]

  onMount(async () => {
    for (let leaderboard of leaderboards) {
      const leaderboardData = await fetchTrackerData(leaderboard as LeaderboardOption);
      trackerData[leaderboard] = (leaderboardData)
    }

    // Update UI once loaded
    isLoaded = true
  });
</script>

<svelte:head>
  <title>SRP Tracker | Charts</title>
</svelte:head>

{#if isLoaded}
  <div id='base' class={isLoaded ? 'fade-in' : ''}>
    <section id='main'>
      <div id='heading'>
        <h1>Charts</h1>
        <p>This page lists out charts of all of the leaderboards. Note that the data being tracked are the points earned per leaderboard (with "Combined" being all of the individual ones added up). Only the top 10 players per leaderboard are listed currently.</p>
      </div>

      {#each leaderboards as leaderboard}
      <div class='chart-section'>
        <h2>{leaderboard} Chart</h2>
        <LineChart leaderboardData={trackerData[leaderboard]}/>
      </div>
      {/each}
      
    </section>
  </div>
{:else}
  <div id='loading'>
    <div class="loader"></div>
    <p>Revving up engines...</p>
  </div>
{/if}

<style>

  /* General Page Layout */
  #base { 
    width: min(95%, 1500px);
    display: flex;
    flex-direction: row;
    margin: auto;
  }

  #main { 
    flex: 7;
    background-color: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 5px;
    margin: 2rem;
    padding: 1.5rem 2rem;
  }

  a, a:visited { color: var(--highlight); }

  /* Main Styling */
  #main #heading * {
    margin: 0.5rem 0;
  }
  #main #heading h1 {
    font-size: 2.5rem;
    font-weight: bold;
  }
  #main #heading p {
    font-size: 1.2rem;
  }

  .chart-section { margin: 2.5rem 0; }
  .chart-section h2 {
    font-weight: bold;
    font-size: 1.6rem;
    margin: 1rem 0;
  }
  
  /* Loading */
  #loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 40vh;
  }
  .loader {
    border: 0.25rem solid var(--secondary); 
    border-top: 0.25rem solid var(--highlight); 
    border-radius: 50%;
    width: 5rem;
    height: 5rem;
    animation: spin 1.5s ease-in-out infinite;
    margin: 1.6vh auto;
    outline: white;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  #loading p {
    font-size: 1.2rem;
    padding-bottom: 5rem;
  }
  .fade-in {
    opacity: 0; 
    animation: fadeIn 0.5s forwards; 
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }


  /* Mobile Styling */
  @media screen and (max-width: 1080px) {
    #base { flex-direction: column; }
    #main {
      flex: auto;
      margin: 1rem !important;
    }
    #side {
      width: 100%;
      flex: auto;
      margin: 0 1rem !important;
    }
  }

</style>