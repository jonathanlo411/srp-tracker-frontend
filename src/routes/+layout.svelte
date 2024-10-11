<script lang='ts'>
  import Analytics from "$lib/client/analytics.svelte";
</script>

<Analytics></Analytics>

<div id='centering'>
  <nav>
    <a class='nav-item' href='/'>Dashboard</a>
    <a class='nav-item' href='/charts'>Charts</a>
    <a class='nav-item' href='/top-drivers'>Top Drivers</a>
    <a class='nav-item' href='/positions'>Position Changes</a>
    <a class='nav-item' href='/profiles'>Racing Profile</a>
  </nav>
</div>
<div id="base">
  <slot></slot>
</div>

<style>
  /* General Styling */
  @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
  :global(*) {
    box-sizing: border-box;
    margin: 0;
  }
  :global(body) {
    /* General Styling */
    font-family: 'Montserrat';
    color: var(--font-color);
    background-color: var(--primary);
    overflow-x: hidden;

    /* Color vars */
    --primary: #2a2729;
    --secondary: #302c2e;
    --border: rgb(55,52,59);
    --highlight: rgb(163, 90, 132);
    --fastest: rgb(174, 62, 201);
    --font-color: white;
    --subdued: rgb(101, 93, 98);
  }

  /* Site wide scrollbars */
  :global(::-webkit-scrollbar) {
    height: 0.3rem;
    width: 0.3rem;
  }
  :global(::-webkit-scrollbar-track) {
    background: none;
  }

  /* Handle */
  :global(::-webkit-scrollbar-thumb) {
    border-radius: 100px;
    background-color: #ccc;
    transition: 0.2s;
  }

  /* Handle on hover */
  :global(::-webkit-scrollbar-thumb:hover) {
    background: #b4b4b4;
  }

  /* Nav Bar */
  #centering {
    width: 100vw;
    background-color: var(--secondary);
  }
  nav {
    width: calc(min(95%, 1500px) - 3.5rem);
    height: 56px;
    border-bottom: 1px solid var(--border);
    display: flex;
    margin: 0 auto;
  }

  nav .nav-item, nav .nav-item:visited {
    color: var(--font-color);
    text-decoration: none;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    font-size: 1.1rem;
    border: 2px solid transparent;
    transition: 0.2s;
  }
  nav .nav-item:hover {
    border-bottom: 2px solid var(--highlight);
  }

  
  /* Mobile Styling */
  @media screen and (max-width: 1080px) {
    nav {
      display: none;
    }
  }
</style>