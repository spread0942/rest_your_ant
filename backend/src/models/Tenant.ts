import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TenantAttributes {
    id: number;
    name: string;
    domain?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface AccountCreationAttributes extends Optional<TenantAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Tenant extends Model<TenantAttributes, AccountCreationAttributes> implements TenantAttributes {
  public id!: number;
  public name!: string;
  public domain?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Tenant.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        domain: {
            type: DataTypes.STRING(100),
            allowNull: true,
            // unique: true,
            validate: {
                isUrl: true,
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'tenants',
        timestamps: true,
    }
);

export default Tenant;