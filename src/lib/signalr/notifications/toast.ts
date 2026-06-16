type ToastInput = {
    title: string;
    message: string;
    type?: string;
    senderUrl?: string;
    senderAvatar: string | null;
    targetUrl?: string | null;
    targetPayload?: string | null;
};

type ToastListener = (t: ToastInput) => void;

let listeners: ToastListener[] = [];

export function subscribeToast(listener: ToastListener) {
    listeners.push(listener);

    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
}

export function toast(data: ToastInput) {
    listeners.forEach((l) => l(data));
}