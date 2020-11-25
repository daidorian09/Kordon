import winston from 'winston';

const enumerateErrorFormat: winston.Logform.FormatWrap = winston.format((info: any) => {
    if (info instanceof Error) {
      Object.assign(info, { message: info.stack });
    }
    return info;
  });

const logger: winston.Logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      enumerateErrorFormat(),
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.printf(({ level, message }) => `${level}: ${message}`)
    ),
    transports: [
      new winston.transports.Console({
        stderrLevels: ['error']
      })
    ]
  });

export default logger;