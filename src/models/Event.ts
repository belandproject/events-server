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
  Index,
} from "sequelize-typescript";
import { FindOptions, Op, Sequelize, WhereOptions } from "sequelize";
import { getSort } from "../utils/model";
import { Attendee } from "./Attendee";


export interface Schedule {
  start: Date,
  end: Date,
  content?: string
}


export enum EventStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type EventListParams = {
  limit: number;
  offset: number;
  sort: string;
  creator?: string;
  trending?: boolean;
  highlighted?: boolean;
  status?: EventStatus;
  search?: string;
  id?: string;
  category?: string;
  isActive?: boolean;
};

@Table({ tableName: "events" })
export class Event extends Model {
  @AllowNull(false)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Index
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

  @Index
  @AllowNull(false)
  @Column(DataType.DATE)
  startDate: Date;

  @Index
  @AllowNull(false)
  @Column(DataType.DATE)
  endDate: Date;

  @Index
  @AllowNull(false)
  @Column(DataType.DATE)
  finishDate: Date;

  @Column(DataType.STRING(255))
  contact: string;
  
  @Column(DataType.TEXT)
  details: string;

  @Index
  @AllowNull(false)
  @Default(EventStatus.PENDING)
  @Column(DataType.ENUM({ values: Object.keys(EventStatus) }))
  status: EventStatus;

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

  @Index
  @AllowNull(false)
  @Max(150)
  @Min(-150)
  @Column(DataType.INTEGER)
  x: number;

  @Index
  @AllowNull(false)
  @Max(150)
  @Min(-150)
  @Column(DataType.INTEGER)
  y: number;

  @Index
  @Column(DataType.INTEGER)
  estateId: number;

  @AllowNull(false)
  @Index
  @Default(false)
  @Column(DataType.BOOLEAN)
  trending: boolean;

  @AllowNull(false)
  @Index
  @Default(false)
  @Column(DataType.BOOLEAN)
  highlighted: boolean;

  static listForApi(params: EventListParams) {
    const {
      limit,
      offset,
      sort,
      search,
      id,
      category,
      isActive,
      ...otherParams
    } = params;
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

    if (isActive != undefined) {
      Object.assign(where, {
        endDate: { [Op.gt]: new Date() },
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
