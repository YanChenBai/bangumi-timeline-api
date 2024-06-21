/**
 * 获取当前星期几星期一到五(1-5),星期天(7)
 */
export function getDay() {
  const date = new Date();
  const nowDay = date.getDay();
  return nowDay === 0 ? 7 : nowDay;
}

/**
 * 返回当前新番季例如 202401, 202404
 */
export function getQuarter() {
  const date = new Date();
  const m = date.getMonth();
  const y = date.getFullYear();
  let quarter = "";
  if (m >= 1 && m < 4) {
    quarter = "01";
  } else if (m >= 4 && m < 7) {
    quarter = "04";
  } else if (m >= 7 && m < 10) {
    quarter = "07";
  } else if (m >= 10) {
    quarter = "10";
  }
  return `${y}${quarter}`;
}
