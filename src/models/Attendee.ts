import {
  Table,
  Model,
  Column,
  ForeignKey,
  DataType,
  AllowNull,
  Unique,
} from "sequelize-typescript";
import { FindOptions, Op, WhereOptions } from "sequelize";
import { getSort } from "../utils/model";
import { Event } from "./Event";

@Table({ tableName: "attendees" })
export class Attendee extends Model {

  @Unique({name: "unique_attendee_event_user", msg: ""})
  @AllowNull(false)
  @ForeignKey(() => Event)
  @Column(DataType.UUID)
  eventId: number;

  @Unique({name: "unique_attendee_event_user", msg: ""})
  @AllowNull(false)
  @Column(DataType.STRING(255))
  user: string;

  static listForApi(params: {
    limit: number;
    offset: number;
    sort: string;
    eventId?: string;
    user?: string;
    id?: string;
  }) {
    const { limit, offset, sort, id, ...otherParams } = params;
    const where: WhereOptions = {};

    Object.assign(where, otherParams);

    if (id != undefined) {
      Object.assign(where, { id: { [Op.in]: id.split(",") } });
    }

    const query: FindOptions = {
      offset: offset,
      limit: limit,
      order: getSort(sort),
      where,
    };

    return this.findAndCountAll(query);
  }
}
