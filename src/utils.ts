export function getDay() {
  const date = new Date();
  const nowDay = date.getDay();
  return nowDay === 0 ? 7 : nowDay;
}
