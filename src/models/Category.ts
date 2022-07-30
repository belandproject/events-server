import { Table, Model, Column, PrimaryKey, DataType, AllowNull, Default } from "sequelize-typescript";

@Table({tableName: "categories"})
export class Category extends Model {
  @PrimaryKey
  @Column(DataType.STRING(50))
  id: string

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isActive: boolean;
}
