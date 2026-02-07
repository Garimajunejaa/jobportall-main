// Global error handler to prevent duplicate toast messages
const errorMessages = new Set();
const TOAST_CLEAR_TIME = 5000; // Clear error messages after 5 seconds

export const showErrorOnce = (message, toastFn) => {
    if (!message || errorMessages.has(message)) {
        return;
    }
    
    errorMessages.add(message);
    toastFn(message);
    
    // Remove message from set after timeout
    setTimeout(() => {
        errorMessages.delete(message);
    }, TOAST_CLEAR_TIME);
};

export const clearAllErrors = () => {
    errorMessages.clear();
};
