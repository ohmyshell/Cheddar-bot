import { join } from 'path';
import { pino } from 'pino';
import PinoPretty from 'pino-pretty';

export const GeneralLogger = pino(
  {
    name: 'Cheddar',
    level: (process.env.LOG_LEVEL || 'info').toLowerCase(),
  },
  PinoPretty({
    colorize: true,
    include: 'name,level,time',
    translateTime: 'dd-mm-yyyy HH:MM:ss <o>',
  })
);

export const ShardLogger = pino(
  {
    name: 'Cheddar (Shard)',
    level: (process.env.LOG_LEVEL || 'info').toLowerCase(),
  },
  PinoPretty({
    colorize: true,
    include: 'name,level,time',
    translateTime: 'dd-mm-yyyy HH:MM:ss <o>',
    colorizeObjects: true,
    messageKey: 'msg',
    errorProps: 'type,message,stack',
    messageFormat: (log, messageKey, levelLabel, { colors }) => {
      return colors.yellowBright(log[messageKey] as string);
    },
  })
);

export const ApiLogger = pino(
  {
    name: 'Cheddar (API)',
    level: (process.env.LOG_LEVEL || 'info').toLowerCase(),
  },
  PinoPretty({
    colorize: true,
    include: 'name,level,time',
    translateTime: 'dd-mm-yyyy HH:MM:ss <o>',
    colorizeObjects: true,
    messageFormat: (log, levelLabel, messageKey, { colors }) =>
      colors.bgMagenta(log.msg as string),
  })
);

const fileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: join(__dirname, 'app.log') },
});

export const FileLogger = pino(
  {
    name: 'Cheddar (File)',
    level: (process.env.FILE_LOG_LEVEL || 'info').toLowerCase(),
  },
  fileTransport
);
