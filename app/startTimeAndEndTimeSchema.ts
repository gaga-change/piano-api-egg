import { initHour } from './tools/dateTools';

export const startTimeAndEndTimeSchema = {
  startTime: {
    type: Date, required: true, validate: {
      validator(val: any) {
        if (!(val instanceof Date)) return true;
        return val.getSeconds() === 0 && val.getMilliseconds() === 0;
      },
      message: '秒和毫秒必须为0',
    },
  }, // 开始时间
  endTime: {
    type: Date, required: true, validate: {
      validator(this: {startTime: any; endTime: any}, val: any) {
        if (!(this.startTime instanceof Date) || !(this.endTime instanceof Date)) return true;
        return initHour(this.startTime).getTime() === initHour(this.endTime).getTime()
          && this.startTime <= this.endTime
          && val.getSeconds() === 0
          && val.getMilliseconds() === 0;
      },
      message: '开始时间必须小于等于结束时间，且必须同一天，秒和毫秒必须为0',
    },
  },
};

/**
 * 设置开始时间&结束时间 的秒和毫秒为0
 * @param startTime 开始时间
 * @param endTime 结束时间
 */
export const initStartTimeAndEndTimeSchema = (startTime: any, endTime: any) => {
  if (startTime instanceof Date) {
    startTime.setSeconds(0, 0);
  }
  if (endTime instanceof Date) {
    endTime.setSeconds(0, 0);
  }
};
