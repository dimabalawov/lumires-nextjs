type LoaderProps = {
  message?: string;
  size?: number;
};

export default function Loader({ message = "Loading...", size = 48 }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div
        className="animate-spin rounded-full border-t-2 border-b-2 border-blue-500"
        style={{ width: size, height: size }}
      ></div>
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  );
}
