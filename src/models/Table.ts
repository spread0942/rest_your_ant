import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TableAttributes {
  id: number;
  restaurantId: number;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
}

interface TableCreationAttributes extends Optional<TableAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Table extends Model<TableAttributes, TableCreationAttributes> implements TableAttributes {
  public id!: number;
  public restaurantId!: number;
  public number!: number;
  public capacity!: number;
  public status!: 'available' | 'occupied' | 'reserved' | 'maintenance';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Table.init(
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
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'reserved', 'maintenance'),
      allowNull: false,
      defaultValue: 'available',
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
    tableName: 'tables',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['restaurantId', 'number'],
      },
    ],
  }
);

export default Table;
