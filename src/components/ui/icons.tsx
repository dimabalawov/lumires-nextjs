/** Shared inline SVG icons used across the reviews / discussion UI. */

export function HeartIcon({
  filled = false,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M7.00019 12.25C7.00019 12.25 2.91686 9.62499 1.45852 6.99999C0.994395 6.26512 0.841201 5.37597 1.03264 4.52815C1.22409 3.68033 1.74449 2.94328 2.47936 2.47915C3.21423 2.01502 4.10337 1.86183 4.9512 2.05327C5.79902 2.24472 6.53606 2.76512 7.00019 3.49999C7.46432 2.76512 8.20136 2.24472 9.04918 2.05327C9.89701 1.86183 10.7862 2.01502 11.521 2.47915C12.2559 2.94328 12.7763 3.68033 12.9677 4.52815C13.1592 5.37597 13.006 6.26512 12.5419 6.99999C11.0835 9.62499 7.00019 12.25 7.00019 12.25Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="0.816667"
      />
    </svg>
  );
}

export function ReplyIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M12.25 8.75C12.25 9.36884 12.0042 9.96233 11.5666 10.3999C11.129 10.8375 10.5355 11.0833 9.91667 11.0833H4.66667L1.75 13.4167V4.08333C1.75 3.46449 1.99583 2.871 2.43342 2.43342C2.871 1.99583 3.46449 1.75 4.08333 1.75H9.91667C10.5355 1.75 11.129 1.99583 11.5666 2.43342C12.0042 2.871 12.25 3.46449 12.25 4.08333V8.75Z"
        stroke="currentColor"
        strokeWidth="0.816667"
      />
    </svg>
  );
}
