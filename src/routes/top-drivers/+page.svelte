<script lang='ts'>
  import { onMount } from 'svelte';
  import { fetchTrackerData, handleSearch } from '$lib/client/util';

  let trackerData: Record<string, LeaderboardSnapshot[]> = {};
  let isLoaded: boolean = false;
  let leaderboards = [
    'Combined',
    'Clawies Selection Carpack',
    'Default',
    'Traffic',
    'TrafficSlow'
  ];
  let selectedLeaderboards: Record<string, boolean> = {};
  let itemsToShow: number = 20;

  // Initialize selectedLeaderboards
  leaderboards.forEach(lb => {
  if (lb === 'Clawies Selection Carpack' || lb === 'Default') {
    selectedLeaderboards[lb] = false; // Set to unchecked by default
  } else {
    selectedLeaderboards[lb] = true;
  }
});

  onMount(async () => {
    for (let leaderboard of leaderboards) {
      const leaderboardData = await fetchTrackerData(leaderboard as LeaderboardOption);
      trackerData[leaderboard] = (leaderboardData)
    }

    // Update UI once loaded
    isLoaded = true
  });

  function handleItemsToShowChange() {
    itemsToShow = Math.min(Math.max(1, itemsToShow), 100);
  }

  $: visibleLeaderboards = leaderboards.filter(lb => selectedLeaderboards[lb]);
</script>

<svelte:head>
  <title>SRP Tracker | Top Drivers</title>
</svelte:head>

{#if isLoaded}
  <div id='base' class={isLoaded ? 'fade-in' : ''}>

    <section id='main'>
      <div id='heading'>
        <h1>Top Drivers</h1>
        <p>This page contains all of the top drivers in each leaderboard (with "Combined" being all of the individual ones added up). The data shown is currently the most up to date version and reflects the <a href='https://hub.shutokorevivalproject.com/timing/points' target='_blank' rel='norefferrer'>main points leaderboard</a>. Use the controls below to compare leaderboards side by side.</p>
      </div>
      
      <div id='controls'>
        <div id='leaderboard-checkboxes'>
          <h3>Select Leaderboards:</h3>
          {#each leaderboards as leaderboard}
            <label>
              <input type="checkbox" bind:checked={selectedLeaderboards[leaderboard]}>
              {leaderboard}
            </label>
          {/each}
        </div>
        
        <div id='items-control'>
          <label for="itemsToShow">Number of items to show (max 100):</label>
          <input type="number" id="itemsToShow" bind:value={itemsToShow} on:change={handleItemsToShowChange} min="1" max="100">
        </div>
      </div>
    </section>

    <section id='lb-section'>
      {#each visibleLeaderboards as leaderboard}
        <div class='leaderboard'>
          <h3>{leaderboard === 'Clawies Selection Carpack' ? 'Clawies' : leaderboard}</h3>
          <div class='leaderboard-list'>
            {#each trackerData[leaderboard].slice(-1)[0]?.data.slice(0, itemsToShow) as item}
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
    flex-direction: column;
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

  /* Controls */
  #controls {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    padding: 1rem;
    background-color: var(--primary);
    border-radius: 5px;
  }
  #leaderboard-checkboxes {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  #leaderboard-checkboxes h3 {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  #leaderboard-checkboxes label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  #items-control {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  #items-control input {
    width: 60px;
    padding: 0.25rem;
  }

  /* Leaderboard Section */
  #lb-section {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .leaderboard {
    flex: 1;
    border: 1px solid var(--border);
    background-color: var(--secondary);
    border-radius: 5px;
    margin: 0.5rem;
    padding: 0.5rem;
  }
  .leaderboard h3 {
    font-weight: 600;
    font-size: 1.7rem;
    margin: 1rem 0;
    text-align: center;
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
    margin: 0.5rem 0;
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
    #main {
      flex: auto;
      margin: 1rem !important;
    }
    #lb-section {
      flex-direction: column;
    }

    .leaderboard {
      width: 90%;
    }
  }

</style>