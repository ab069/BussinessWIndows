module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically increment the id
      allowNull: false // Ensure the id cannot be null
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false, // Ensure the name cannot be null
      unique: true, // Ensure the name is unique
      validate: {
        len: {
          args: [1, 50], // Limit the name length to between 1 and 50 characters
          msg: "Name must be between 1 and 50 characters."
        }
      }
    }
  }, {
    // Automatically include createdAt and updatedAt timestamps
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return Role;
};
