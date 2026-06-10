type ToastInput = {
    title: string;
    message: string;
    senderUrl?: string;
    targetUrl?: string | null;
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
    console.log(data);
    console.log("[toast] listeners count:", listeners.length, data);
    listeners.forEach((l) => l(data));
}