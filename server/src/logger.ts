import * as winston from "winston";

export const Log = new winston.Logger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      json: true
    })
  ]
});