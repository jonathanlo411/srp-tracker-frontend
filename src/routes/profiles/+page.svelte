<script lang="ts">
  import { handleSearch } from '$lib/client/util';
  
  let searchQuery = '';
</script>

<svelte:head>
  <title>SRP Tracker | Racing Profile Search</title>
</svelte:head>

<div id='base'>
  <section id='main'>
    <div id='heading'>
      <h1>Racing Profile Search</h1>
      <p>Use the search bar to look up a driver in the database. It will return a Racing Profile which contains statistics and breakdowns of the driver. Do note that this is limited to players who have reached the Top 100 combined.</p>
    </div>
    <form on:submit|preventDefault={() => { handleSearch(searchQuery) }}>
      <div id='search-container'>
        <input type='text' bind:value={searchQuery} placeholder='Enter driver name...' />
        <button type='submit'>Search</button>
      </div>
    </form>
  </section>
</div>

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

  /* Search Bar Styling */
  #search-container {
    display: flex;
    margin: 3em auto 1rem;
    align-items: center;
    flex-direction: column;
    width: 50%;
    margin: 3rem auto 1rem;
  }
  input {
    flex: 1;
    padding: 0.7rem 1rem;
    border: 1px solid var(--border);
    border-radius: 5px;
    font-size: 1.1rem;
    background-color: var(--primary);
    outline: none;
    color: var(--font-color);
    width: 100%;
    transition: 0.3s;
    margin: 1rem 0;
  }
  input:focus {
    background-color: var(--secondary);
    border: 1px solid white;
    box-shadow: 0 0 10px 0 var(--highlight);
  }
  button {
    background-color: var(--highlight);
    color: var(--font-color);
    border: none;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
  }
  button:hover {
    opacity: 0.8;
  }

  /* Mobile Styling */
  @media screen and (max-width: 1080px) {
    #base { flex-direction: column; }
    #main {
      flex: auto;
      margin: 1rem !important;
    }

    #search-container {
      margin: 1rem auto;
      width: 100%;
    }
  }
</style>

