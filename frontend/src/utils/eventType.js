// utils/eventType.js
export const INDIVIDUAL_EVENTS = [
  "query_clash",
  "workshop"
];

export const isTeamEvent = (role) => {
  if (!role) return false;
  return !INDIVIDUAL_EVENTS.includes(role);
};