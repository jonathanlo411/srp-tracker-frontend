import { PUBLIC_SRP_TRACKER_API_URL } from '$env/static/public';
import { goto } from '$app/navigation';
import namePool from '$lib/playerNameMappings.json';

export async function fetchTrackerData(
  leaderboard: LeaderboardOption
): Promise<LeaderboardSnapshot[]> {
  try {
    const rawTrackerData = await fetch(
      `${PUBLIC_SRP_TRACKER_API_URL}/leaderboard?leaderboard=${leaderboard}`
    )
    const trackerData = await rawTrackerData.json();

    return trackerData;
  } catch (error) {
    console.error('Error fetching tracker data:', error);
    return [];
  }
}

// Helper function to get the canonical name from namePool
function getCanonicalName(name: string): string {
  for (const [canonical, names] of Object.entries(namePool)) {
    if (names.includes(name)) {
      return canonical;
    }
  }
  return name; // Return the original name if no match is found
}

export function calculatePositionChanges(
  data: LeaderboardSnapshot[]
): { name: string; originalPosition: number; newPosition: number }[] {
  if (data.length < 2) {
    return [];
  }

  const secondLast = data[data.length - 2]?.data;
  const last = data[data.length - 1]?.data;

  if (!secondLast || !last) {
    return [];
  }

  const changes = last.reduce((acc, player) => {
    // Get the canonical name for the current player
    const canonicalName = getCanonicalName(player.name);

    // Find the previous entry for the canonical name
    const previousEntry = secondLast.find(
      p => getCanonicalName(p.name) === canonicalName
    );

    if (
      (previousEntry && previousEntry.rank > player.rank) ||
      (!previousEntry && player.rank <= 100)
    ) {
      acc.push({
        name: player.name, // Use the most recent name for display
        originalPosition: previousEntry ? previousEntry.rank : 101,
        newPosition: player.rank,
      });
    }
    return acc;
  }, [] as { name: string; originalPosition: number; newPosition: number }[]);

  return changes.sort((a, b) => a.newPosition - b.newPosition);
}

export function handleSearch(searchQuery: string): void {
  if (searchQuery.trim()) {
    goto(`/profiles/${encodeURIComponent(searchQuery.trim())}`);
  }
}
