import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface DrinkAttributes {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  isAlcoholic: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DrinkCreationAttributes extends Optional<DrinkAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Drink extends Model<DrinkAttributes, DrinkCreationAttributes> implements DrinkAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public price!: number;
  public category?: string;
  public isAlcoholic!: boolean;
  public isAvailable!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Drink.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    isAlcoholic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isAvailable: {
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
    tableName: 'drinks',
    timestamps: true,
  }
);

export default Drink;
