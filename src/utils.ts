type Season = 0 | 1 | 3 | 4;

/**
 * 获取当前星期几星期一到五(1-5),星期天(7)
 */
export function getDay() {
  const date = new Date();
  const nowDay = date.getDay();
  return nowDay === 0 ? 7 : nowDay;
}

/** 获取当前季度 */
function getSeason(): Season {
  const date = new Date();
  const m = date.getMonth();

  if (m >= 1 && m < 4) {
    return 0;
  } else if (m >= 4 && m < 7) {
    return 1;
  } else if (m >= 7 && m < 10) {
    return 3;
  } else {
    return 4;
  }
}

/**
 * 获取包含年份的当前季度开始的第一月 202401, 202404
 */
export function getSeasonStartMonth() {
  const date = new Date();
  const values = ["01", "04", "07", "10"];
  const y = date.getFullYear();

  return `${y}${values[getSeason()]}`;
}

/** 获取当前季度名称 */
export function getSeasonName() {
  const values = ["WINTER", "SPRING", "SUMMER", "FALL"];
  return values[getSeason()];
}
