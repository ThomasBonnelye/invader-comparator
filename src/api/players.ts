const playersRaw = import.meta.env.VITE_PLAYERS || "";
export const players: { value: string }[] = playersRaw
  .split(",")
  .map((value: string) => ({ value }));