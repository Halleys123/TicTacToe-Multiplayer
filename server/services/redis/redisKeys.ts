const base = 'TICTACTOE';

export function matchQueueKey(): string {
  return `${base}::MATCH_QUEUE`;
}

export function gameIdKey(gameId: string): string {
  return `${base}::GAME::${gameId}`;
}

export function userIdKey(userId: string): string {
  return `${base}::USERID::${userId}`;
}

export function personalRoomKey(userId: string): string {
  return `${base}::PERSONAL_ROOM::${userId}`;
}
