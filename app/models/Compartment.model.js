module.exports = (sequelize, Sequelize) => {
  const Compartment = sequelize.define("Compartment", {
    dateTime: {
      type: Sequelize.DATE,
      allowNull: false // Date and time are required
    },
    referenceNo: {
      type: Sequelize.STRING,
      allowNull: true // Reference number is optional
    },
    fileNo: {
      type: Sequelize.STRING,
      allowNull: true // File number is optional
    },
    compartmentName: {
      type: Sequelize.STRING,
      allowNull: true // Compartment name is optional
    },
    allocatedCompartmentOwner: {
      type: Sequelize.STRING,
      allowNull: true // Allocated owner of the compartment
    },
    allocatedLineNo: {
      type: Sequelize.STRING,
      allowNull: true // Line number assigned to the compartment
    },
    compartmentLocation: {
      type: Sequelize.STRING,
      allowNull: true // Location of the compartment
    },
    purposeOfCloser: {
      type: Sequelize.TEXT,
      allowNull: true // Purpose of closing the compartment
    },
    creationReason: {
      type: Sequelize.TEXT,
      allowNull: true // Reason for creating the compartment
    },
    allocatedCountry: {
      type: Sequelize.STRING,
      allowNull: true // Allocated country
    },
    allocatedState: {
      type: Sequelize.STRING,
      allowNull: true // Allocated state
    },
    allocatedCity: {
      type: Sequelize.STRING,
      allowNull: true // Allocated city
    },
    createdByName: {
      type: Sequelize.STRING,
      allowNull: true // Name of the person who created the compartment
    },
    createdById: {
      type: Sequelize.INTEGER,
      allowNull: true // ID of the person who created the compartment
    },
    vehicleBrandName: {
      type: Sequelize.STRING,
      allowNull: true // Brand name of the vehicle associated
    },
    vehicleType: {
      type: Sequelize.STRING,
      allowNull: true // Type of the vehicle
    },
    vehicleModelName: {
      type: Sequelize.STRING,
      allowNull: true // Model name of the vehicle
    },
    driverName: {
      type: Sequelize.STRING,
      allowNull: true // Driver name associated with the compartment
    },
    procurement: {
      type: Sequelize.STRING,
      allowNull: true // Procurement details
    },
    approvedByName: {
      type: Sequelize.STRING,
      allowNull: true // Name of the person who approved the compartment
    },
    approvedById: {
      type: Sequelize.INTEGER,
      allowNull: true // ID of the person who approved the compartment
    },
    approvedWithSpecialRemarks: {
      type: Sequelize.TEXT,
      allowNull: true // Special remarks for approval
    },
    professor: {
      type: Sequelize.STRING,
      allowNull: true // Associated professor name (if applicable)
    },
    department: {
      type: Sequelize.STRING,
      allowNull: true // Department information
    },
    approvedDateTime: {
      type: Sequelize.DATE,
      allowNull: true // Date and time of approval
    },
    validTill: {
      type: Sequelize.DATE,
      allowNull: true // Validity date
    },
    specialInstructions: {
      type: Sequelize.TEXT,
      allowNull: true // Any special instructions related to the compartment
    },
    specialRemarks: {
      type: Sequelize.TEXT,
      allowNull: true // Any additional special remarks
    }
  }, {
    // Automatically include createdAt and updatedAt timestamps
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    tableName: 'compartments' // Explicitly setting the table name
  });

  return Compartment;
};
