export default function MissingAvatar({
    username,
    width,
    height,
}: { username: string; width: number; height: number }) {
    return (
        <div
            className="flex items-center justify-center bg-brand-gold text-black font-medium rounded-full"
            style={{ width, height, fontSize: Math.floor(height / 2) }}
        >
            {username?.[0]?.toUpperCase()}
        </div>
    );
}
