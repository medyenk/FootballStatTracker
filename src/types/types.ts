export interface Match {
  id: number;
  date: string;
  winner: string;
  teamA: number[];
  teamB: number[];
  teamAScore: number;
  teamBScore: number;
  potmId: number;
  gotmId: number;
}

export interface Player {
  id: number;
  name: string;
  attended: number;
  win: number;
  loss: number;
  draw: number;
  motm: number;
  gotm: number;
  cleansheet: number;
  goal_difference: number;
}
