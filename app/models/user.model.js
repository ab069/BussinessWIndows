module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    firstName: {
      type: Sequelize.STRING
    },
    middleName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    nationalityId: {
      type: Sequelize.INTEGER
    },
    registrationPurposeId: {
      type: Sequelize.INTEGER
    },
    passportIdNumber: {
      type: Sequelize.STRING,
      unique: true, // Assuming identNo should be unique
    },
    professionId: {
      type: Sequelize.INTEGER
    },
    contactNumber: {
      type: Sequelize.STRING,
      unique: true, // Assuming identNo should be unique
    },
    countryName: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    stateProvince: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      unique: true, // Assuming identNo should be unique
    },
    genderId: {
      type: Sequelize.INTEGER
    },
    postalCode: {
      type: Sequelize.STRING
    },
    fullResidentialAddress: {
      type: Sequelize.TEXT
    },
    acceptTerms: {
      type: Sequelize.BOOLEAN
    },
    userTypeId: {
      type: Sequelize.INTEGER
    },
    password: {
      type: Sequelize.STRING
    },
    fileNo: {
      type: Sequelize.STRING,
      unique: true, // Assuming identNo should be unique
      allowNull: true // This can be adjusted based on your requirements
    },
    roleId: {
      type: Sequelize.INTEGER
    },
    statusId: {
      type: Sequelize.INTEGER
    },
    referenceNo: {
      type: Sequelize.STRING,
      unique: true, // Assuming identNo should be unique
      allowNull: true // This can be adjusted based on your requirements
    },
    identNo: {
      type: Sequelize.STRING,
      unique: true, // Assuming identNo should be unique
      allowNull: true // This can be adjusted based on your requirements
    },
    approval: {  // New column for approval
      type: Sequelize.INTEGER,
      defaultValue: 0  // Default to false (unapproved)
    }
  }, {
    // Automatically include createdAt and updatedAt timestamps
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return User;
};
