module.exports = (sequelize, DataTypes) => {
  const Flavor = sequelize.define(
    'Flavor',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      vendorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.Vendor,
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true
      },
      density: {
        type: DataTypes.DECIMAL,
        allowNull: true
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'flavor',
      createdAt: false,
      updatedAt: false
    }
  );

  Flavor.associate = function(models) {
    this.belongsTo(models.Vendor, { foreignKey: 'vendorId' });
    this.hasOne(models.FlavorIdentifier, { foreignKey: 'flavorId' });
    this.hasMany(models.RecipesFlavors, { foreignKey: 'flavorId' });
    this.hasMany(models.UsersFlavors, { foreignKey: 'flavorId' });
  };

  return Flavor;
};
