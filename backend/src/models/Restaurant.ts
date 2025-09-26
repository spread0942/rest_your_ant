import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface RestaurantAttributes {
  id: number;
  name: string;
  description?: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  tenantId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface RestaurantCreationAttributes extends Optional<RestaurantAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Restaurant extends Model<RestaurantAttributes, RestaurantCreationAttributes> implements RestaurantAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public address!: string;
  public phone!: string;
  public email?: string;
  public website?: string;
  public tenantId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Restaurant.init(
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
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    website: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'tenants', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
    tableName: 'restaurants',
    timestamps: true,
  }
);

export default Restaurant;
