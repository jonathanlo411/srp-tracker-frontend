import { PUBLIC_SRP_TRACKER_API_URL } from '$env/static/public';
import { goto } from '$app/navigation';

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

export function calculatePositionChanges(
  data: LeaderboardSnapshot[]
): { name: string, originalPosition: number, newPosition: number }[] {

  if (data.length < 2) {
    return []; 
  }

  const secondLast = data[data.length - 2]?.data;
  const last = data[data.length - 1]?.data;

  if (!secondLast || !last) {
    return []; 
  }

  const changes = last.reduce((acc, player) => {
    const previousEntry = secondLast.find(p => p.name === player.name);

    if (
      (previousEntry && previousEntry.rank > player.rank) ||
      (!previousEntry && player.rank <= 100) 
    ) {
      acc.push({
        name: player.name,
        originalPosition: previousEntry ? previousEntry.rank : 101,
        newPosition: player.rank,
      });
    }
    return acc;
  }, [] as { name: string, originalPosition: number, newPosition: number }[]);

  return changes.sort((a, b) => a.newPosition - b.newPosition);
}

export function handleSearch(searchQuery: string): void {
  if (searchQuery.trim()) {
    goto(`/profiles/${encodeURIComponent(searchQuery.trim())}`);
  }
}
