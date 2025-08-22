import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PlateAttributes {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PlateCreationAttributes extends Optional<PlateAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Plate extends Model<PlateAttributes, PlateCreationAttributes> implements PlateAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public price!: number;
  public category?: string;
  public isAvailable!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Plate.init(
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
    tableName: 'plates',
    timestamps: true,
  }
);

export default Plate;
