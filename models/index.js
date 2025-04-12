const Notification = require("./notification")(sequelize);
const NotificationUser = require("./notificationUser")(sequelize);

NotificationUser.belongsTo(Notification, { foreignKey: "notificationId" });
NotificationUser.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  Notification,
  NotificationUser,
};
