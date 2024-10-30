import { DataTypes, Model } from "sequelize";
import { sequelize } from "./database";

interface personAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    gender: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class person extends Model<personAttributes> implements personAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: string;
    public gender!: string;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}

person.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
        gender: { type: DataTypes.STRING, allowNull: false },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: 'person',
        tableName: 'persons',
    }
);

export { person };