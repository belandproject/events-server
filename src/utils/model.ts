import { Sequelize } from "sequelize-typescript";
import { OrderItem } from "sequelize/types";

function buildDirectionAndField(value: string) {
  let field: string;
  let direction: "ASC" | "DESC";

  if (value.substring(0, 1) === "-") {
    direction = "DESC";
    field = value.substring(1);
  } else {
    direction = "ASC";
    field = value;
  }

  return { direction, field };
}

export function getSort(
  value: string,
  lastSort: OrderItem = ["id", "ASC"]
): OrderItem[] {
  const { direction, field } = buildDirectionAndField(value);

  let finalField: string | ReturnType<typeof Sequelize.col>;

  if (field.toLowerCase() === "match") {
    // Search
    finalField = Sequelize.col("similarity");
  } else {
    finalField = field;
  }

  return [[finalField, direction], lastSort];
}
