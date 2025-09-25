import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MenuAttributes {
  id: number;
  restaurantId: number;
  name: string;
  description?: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MenuCreationAttributes extends Optional<MenuAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Menu extends Model<MenuAttributes, MenuCreationAttributes> implements MenuAttributes {
  public id!: number;
  public restaurantId!: number;
  public name!: string;
  public description?: string;
  public category!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Menu.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'restaurants',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'menus',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['category', 'restaurantId'],
        name: 'unique_category_restaurant'
      }
    ]
  }
);

export default Menu;
