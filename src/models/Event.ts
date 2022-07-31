import {
  Table,
  Model,
  Column,
  HasMany,
  DataType,
  Max,
  Min,
  Default,
  AllowNull,
  PrimaryKey,
} from "sequelize-typescript";
import { FindOptions, Op, Sequelize, WhereOptions } from "sequelize";
import { getSort } from "../utils/model";
import { Attendee } from "./Attendee";

@Table({ tableName: "events" })
export class Event extends Model {
  @AllowNull(false)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string

  @AllowNull(false)
  @Column(DataType.STRING)
  creator: string;

  @Column(DataType.STRING(255))
  userName: string;

  @Column(DataType.STRING(255))
  estateName: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name: string;

  @Column(DataType.STRING(255))
  image: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  schedules: JSON;

  @Column(DataType.STRING(255))
  contact: string;

  @Column(DataType.TEXT)
  details: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  approved: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  rejected: boolean;

  @Column(DataType.TEXT)
  reason: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  attendeesCount: number;

  @HasMany(() => Attendee)
  attendees: Attendee[];

  @Column(DataType.ARRAY(DataType.STRING(255)))
  categories: Array<string>;

  @AllowNull(false)
  @Max(150)
  @Min(-150)
  @Column(DataType.INTEGER)
  x: number;

  @AllowNull(false)
  @Max(150)
  @Min(-150)
  @Column(DataType.INTEGER)
  y: number;

  @Column(DataType.INTEGER)
  estateId: number;

  @Column(DataType.BOOLEAN)
  trending: boolean;

  @Column(DataType.BOOLEAN)
  highlighted: boolean;

  static listForApi(params: {
    limit: number;
    offset: number;
    sort: string;
    creator?: string;
    trending?: boolean;
    highlighted?: boolean;
    approved?: boolean;
    search?: string;
    id?: string;
    category?: string;
  }) {
    const { limit, offset, sort, search, id, category, ...otherParams } =
      params;
    const where: WhereOptions = {};

    Object.assign(where, otherParams);

    if (search != undefined) {
      Object.assign(where, {
        name: {
          [Op.match]: Sequelize.fn("to_tsquery", search),
        },
      });
    }

    if (id != undefined) {
      Object.assign(where, { id: { [Op.in]: id.split(",") } });
    }

    if (category != undefined) {
      Object.assign(where, {
        categories: { [Op.contains]: category.split(",") },
      });
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
