import {
  Table,
  Model,
  Column,
  ForeignKey,
  DataType,
  AllowNull,
} from "sequelize-typescript";
import { FindOptions, WhereOptions } from "sequelize/types";
import { getSort } from "../utils/model";
import { Event } from "./Event";

@Table({ tableName: "attendees" })
export class Attendee extends Model {
  @AllowNull(false)
  @ForeignKey(() => Event)
  @Column(DataType.INTEGER)
  eventId: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  user: string;

  static listForApi(params: {
    limit: number;
    offset: number;
    sort: string;
    eventId?: string;
    user?: string;
  }) {
    const { limit, offset, sort, ...otherParams } = params;
    const where: WhereOptions = {};

    Object.assign(where, otherParams);

    const query: FindOptions = {
      offset: offset,
      limit: limit,
      order: getSort(sort),
    };

    return Promise.all([
      this.unscoped().count(query),
      this.findAll(query),
    ]).then(([count, rows]) => ({ count, rows }));
  }
}
