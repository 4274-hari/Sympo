// utils/eventType.js
export const INDIVIDUAL_EVENTS = [
  "query_clash",
  "workshop"
];

export const isTeamEvent = (role) => {
  return !INDIVIDUAL_EVENTS.includes(role);
};