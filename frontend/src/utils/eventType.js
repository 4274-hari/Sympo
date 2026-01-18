// utils/eventType.js
export const INDIVIDUAL_EVENTS = [
  "Query Clash",
  "Workshop"
];

export const isTeamEvent = (role) => {
  if (!role) return false;
  return !INDIVIDUAL_EVENTS.includes(role);
};