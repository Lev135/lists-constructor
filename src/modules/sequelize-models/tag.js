module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tagType: {
      type: DataTypes.ENUM,
      values: ['theme', 'method', 'source']
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Tag.hasMany(Tag, {onDelete: "cascade"});
  return Tag;
};
