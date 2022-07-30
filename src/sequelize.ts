import {Sequelize} from 'sequelize-typescript';
import { DB_URI } from './constants';

export const sequelize = new Sequelize(DB_URI, {
    models: [__dirname + '/models']
});