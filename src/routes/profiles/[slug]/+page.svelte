<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  let isLoaded = true;
</script>

<svelte:head>
  <title>SRP Tracker | {data.profile}'s Racing Profile</title>
</svelte:head>

{#if isLoaded}
  <div id='base' class={isLoaded ? 'fade-in' : ''}>
    <section id='main'>
      <div id='heading'>
        <h1>{data.profile}</h1>
        <p>Racing Profile is currently WIP.</p>
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


  /* Side Styling */
  .leaderboard {
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