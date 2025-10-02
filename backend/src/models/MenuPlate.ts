import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MenuPlateAttributes {
  menuId: number;
  plateId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface MenuPlateCreationAttributes extends Optional<MenuPlateAttributes,  'createdAt' | 'updatedAt'> {}

class MenuPlate extends Model<MenuPlateAttributes, MenuPlateCreationAttributes> implements MenuPlateAttributes {
  public menuId!: number;
  public plateId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MenuPlate.init(
  {
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'menus',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    plateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'plates',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
  }
);

export default MenuPlate;
