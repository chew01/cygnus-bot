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
