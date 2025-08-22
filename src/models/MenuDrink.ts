import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MenuDrinkAttributes {
  id: number;
  menuId: number;
  drinkId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface MenuDrinkCreationAttributes extends Optional<MenuDrinkAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class MenuDrink extends Model<MenuDrinkAttributes, MenuDrinkCreationAttributes> implements MenuDrinkAttributes {
  public id!: number;
  public menuId!: number;
  public drinkId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MenuDrink.init(
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
    drinkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'drinks',
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
    tableName: 'menus_drinks',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['menuId', 'drinkId'],
      },
    ],
  }
);

export default MenuDrink;
