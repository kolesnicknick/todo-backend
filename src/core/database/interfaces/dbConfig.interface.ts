import { SequelizeOptions } from 'sequelize-typescript/dist/sequelize/sequelize/sequelize-options';

export interface IDatabaseConfigAttributes {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  port?: number | string;
  dialect?: string;
  urlDatabase?: string;
  default?: boolean,
  native?: boolean,
  ssl?: boolean
}

export interface IDatabaseConfig {
  development: SequelizeOptions;
  test: SequelizeOptions;
  production: SequelizeOptions;
}
