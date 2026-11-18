import { evidenceRegistry } from "../../public/structured-lessons.js";

function calendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? date.getTime()
    : undefined;
}

export function validateBusinessRules(order) {
  const errors = [];
  const start = calendarDate(order.startDate);
  const end = calendarDate(order.endDate);
  if (start === undefined || end === undefined)
    errors.push("Provide valid calendar dates.");
  else if (end < start)
    errors.push("End date must follow or equal the start date.");
  if (!Number.isInteger(order.quantity) || order.quantity <= 0)
    errors.push("Quantity must be a positive integer.");
  if (
    !order.evidenceIds.length ||
    !order.evidenceIds.every((id) => Object.hasOwn(evidenceRegistry, id))
  )
    errors.push(
      "Evidence IDs must exist in the application's verified fixture registry.",
    );
  return { accepted: errors.length === 0, errors };
}
