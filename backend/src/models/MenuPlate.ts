import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MenuPlateAttributes {
  id: number;
  menuId: number;
  plateId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface MenuPlateCreationAttributes extends Optional<MenuPlateAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class MenuPlate extends Model<MenuPlateAttributes, MenuPlateCreationAttributes> implements MenuPlateAttributes {
  public id!: number;
  public menuId!: number;
  public plateId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MenuPlate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'menus',
        key: 'id',
      },
    },
    plateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'plates',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'menus_plates',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['menuId', 'plateId'],
      },
    ],
  }
);

export default MenuPlate;
