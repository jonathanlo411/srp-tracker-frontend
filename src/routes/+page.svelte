<script lang='ts'>
  import { onMount } from 'svelte';
  import LineChart from "$lib/client/lineChart.svelte";
  import {
    fetchTrackerData,
    calculatePositionChanges,
    handleSearch
  } from '$lib/client/util'

  let trackerData: LeaderboardSnapshot[] = [];
  let trafficTrackerData: LeaderboardSnapshot[] = [];
  let isLoaded: boolean = false;

  onMount(async () => {
    trackerData = await fetchTrackerData('Combined');
    trafficTrackerData = await fetchTrackerData('Traffic');
    isLoaded = true
  });

  // Get the calculated changes after data is loaded
  $: positionChanges = isLoaded ? calculatePositionChanges(trackerData) : [];
</script>

<svelte:head>
  <title>SRP Tracker</title>
</svelte:head>

{#if trackerData.length > 0 && trafficTrackerData.length > 0}
  <div id='base' class={isLoaded ? 'fade-in' : ''}>
    <section id='main'>
      <div id='heading'>
        <h1>SRP Tracker</h1>
        <p>SRP Tracker is a webapp used to track various data on the official <a href='https://hub.shutokorevivalproject.com/timing' target="_blank" rel='norefferrer'>SRP timing leaderboards</a>. Currently, it is tracking point leaderboard changes. If you are interested in using the API, view <a href="https://api.srp-tracker.lojot.com" target="_blank" rel='norefferrer'>the docs</a>.</p>
      </div>

      <div class='chart-section'>
        <h2>Combined Chart</h2>
        <LineChart leaderboardData={trackerData}/>
      </div>
      
      <div class='chart-section'>
        <h2>Traffic Chart</h2>
        <LineChart leaderboardData={trafficTrackerData}/>
      </div>
      
    </section>
    <section id='side'>
      <div class='leaderboard'>
        <h3>Top Drivers</h3>
        <div class='leaderboard-list'>
          {#each trackerData.slice(-1)[0]?.data.slice(0, 10) as item}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class='leaderboard-item top-drivers'
              on:click={() => {handleSearch(item.name)}}
              on:keydown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  handleSearch(item.name);
                }
              }}
              aria-label={`Search for ${item.name}`}
            >
              <h5 class='lb-1'>{item.rank}.</h5> 
              <h5 class='lb-2'>{item.name}</h5>
              <h5 class='lb-3'>{item.points} pts</h5>
            </div>
          {/each}
        </div>
      </div>
      
      <div class='leaderboard'>
        <h3>Position Changes</h3>
        <div class='leaderboard-list'>
          {#if positionChanges.length > 0}
            {#each positionChanges.slice(0, 10) as change}
              <!-- svelte-ignore missing-declaration -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div class='leaderboard-item position-changes'
                on:click={() => {handleSearch(change.name)}}
                on:keydown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    handleSearch(change.name);
                  }
                }}
                aria-label={`Search for ${change.name}`}
              >
                <h5 class='lb-1'>{change.name}</h5> 
                <h5 class='lb-2'>{change.originalPosition === 101 ? '100+' : change.originalPosition} → {change.newPosition}</h5>
              </div>
            {/each}
          {:else}
            <div class='leaderboard-item position-changes'>
              <h5 class='lb-1'>No changes to display</h5>
            </div>
          {/if}
        </div>
      </div>
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
    margin-right: 1rem !important;
    background-color: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 5px;
    margin: 2rem;
    padding: 1.5rem 2rem;
  }
  #side {
    flex: 3;
    margin-left: 0.5rem !important;
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

  /* Side Styling */
  #side .leaderboard {
    border: 1px solid var(--border);
    background-color: var(--secondary);
    border-radius: 5px;
    margin: 2rem 2rem 2rem 0;
    padding: 1rem;
  }
  .leaderboard h3 {
    font-weight: 600;
    font-size: 1.7rem;
  }
  .leaderboard-list {
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
  }
  .leaderboard-item {
    display: flex;
    flex-direction: row;
    background-color: var(--primary);
    margin: 0.25rem 0;
    padding: 0.7rem;
    border-radius: 5px;
    border: 1px solid var(--secondary);
    transition: 0.15s;
  }
  .leaderboard-item:hover {
    border: 1px solid var(--highlight);
    cursor: pointer;
  }
  .leaderboard-item .lb-1 { flex: 1; }
  .top-drivers .lb-2 { flex: 9; }
  
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