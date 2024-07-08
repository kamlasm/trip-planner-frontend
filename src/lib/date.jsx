export function formatDateTime(date) {
    if (date.length > 10) {
        return new Date(date).toLocaleString("en-GB", {dateStyle: "short", timeStyle: "short"}).replace(",", " at")
    } else { 
        return new Date(date).toLocaleString("en-GB", {dateStyle: "short"})
    }
}