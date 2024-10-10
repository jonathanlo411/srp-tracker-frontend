// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	
  type Player = {
    name: string;
    rank: number;
    points: number;
  };

  type LeaderboardSnapshot = {
    data: Player[];
    datetime: string;
    leaderboard: string;
  };

  type LeaderboardOption = 
    'Combined' |
    'Clawies Selection Pack' |
    'Default' |
    'Traffic' |
    'TrafficSlow'

  type PositionChange = {
    name: string;
    originalPosition: number;
    newPosition: number;
  };
}

export {};
