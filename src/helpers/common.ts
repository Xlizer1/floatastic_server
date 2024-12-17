export function formatCurrency(num: number): string {
    const formatted = (num / 100).toFixed(2);
    return `$${formatted}`;
}