import { resolve } from "path";
import log4js from "log4js";

log4js.configure({
  appenders: {
    dateFile: {
      type: "dateFile",
      filename: resolve(__dirname, "../logs/run.log"),
      pattern: "yyyy-MM-dd", // 按日期分割
      keepFileExt: true, // 保留文件扩展名
      alwaysIncludePattern: true, // 确保pattern始终被包含在文件名中
      encoding: "utf-8", // 日志文件的编码
    },
    console: { type: "console" },
  },
  categories: {
    default: { appenders: ["dateFile", "console"], level: "info" },
  },
});

export const logger = log4js.getLogger();
