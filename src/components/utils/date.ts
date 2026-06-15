// utils/date.ts
export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  const intervals: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let count = seconds;
  let unit = "second";

  for (let i = 0; i < intervals.length; i++) {
    if (count < intervals[i][0]) {
      unit = intervals[i][1];
      break;
    }
    count = Math.floor(count / intervals[i][0]);
  }

  return `${count} ${unit}${count !== 1 ? "s" : ""} ago`;
}
