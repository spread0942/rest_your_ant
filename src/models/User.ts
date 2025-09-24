import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
  accountId: number;
  tenantId: number;
  role: 'owner' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public accountId!: number;
  public tenantId!: number;
  public role!: 'owner' | 'user';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    accountId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'accounts',
        key: 'id',
      },
    },
    tenantId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'tenants',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.ENUM('owner', 'user'),
      allowNull: false,
      defaultValue: 'user',
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
    tableName: 'users',
    timestamps: true,
  }
);

export default User;