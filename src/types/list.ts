export const LIST_DETAIL_SORTS = [
  { value: "order", label: "List Order" },
  { value: "recent", label: "Most Recent" },
  { value: "title", label: "Title A–Z" },
  { value: "rating", label: "Highest Rated" },
] as const;

export type ListDetailSortValue = (typeof LIST_DETAIL_SORTS)[number]["value"];