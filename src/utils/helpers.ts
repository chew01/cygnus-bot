export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export function formatBigint(x: bigint): string {
  if (x >= 100000000000000) {
    return `${(Number(x) / 1000000000000).toFixed(1)}T`;
  }
  if (x >= 1000000000000) {
    return `${(Number(x) / 1000000000000).toFixed(2)}T`;
  }
  if (x >= 1000000000) {
    return `${(Number(x) / 1000000000).toFixed(2)}B`;
  }
  if (x >= 1000000) {
    return `${(Number(x) / 1000000).toFixed(2)}M`;
  }
  if (x >= 1000) {
    return `${(Number(x) / 1000).toFixed(2)}K`;
  }
  return x.toString();
}

export function serverToEmoji(server: string) {
  switch (server) {
    case 'Reboot (NA)':
      return '<:Reboot:827355041412415508>';
    case 'Bera':
      return '<:Bera:827355041319878677>';
    case 'Scania':
      return '<:Scania:827355041366933554>';
    case 'Aurora':
      return '<:Aurora:827355041505607731>';
    case 'Elysium':
      return '<:Elysium:827355041417265182>';
    default:
      return '';
  }
}

export function rankToEmoji(rank: number) {
  switch (rank) {
    case 1:
      return ':first_place:';
    case 2:
      return ':second_place:';
    case 3:
      return ':third_place:';
    default:
      return `${rank}.`;
  }
}
