import {
  Table,
  Model,
  Column,
  PrimaryKey,
  DataType,
  AllowNull,
  Default,
} from "sequelize-typescript";
import { FindOptions, Op, WhereOptions } from "sequelize";
import { getSort } from "../utils/model";

@Table({ tableName: "categories" })
export class Category extends Model {
  @PrimaryKey
  @Column(DataType.STRING(50))
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  static listForApi(params: {
    limit: number;
    offset: number;
    sort: string;
    isActive?: boolean;
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
