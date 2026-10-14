const admin = require("../../../firebaseConfig");
// const mongoose = require("mongoose");
// const User = require("../../../models/userModel");
exports.generalnewspush = async (id, type) => {
  // const userss = await User.aggregate([
  //   {
  //     $match: {},
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       tokens: {
  //         $push: "$gcmtoken",
  //       },
  //     },
  //   },
  //   { $skip: 0 },
  //   { $limit: 10 },
  // ]);
  // const registrationTokens =
  //   "deLujU8lS2ODlSDRNlM21u:APA91bGZouHKgm0iFU_gS1EdUX0BgcD4QoByTcsdHbrJ-qoKb-xAitZzzrvWH0z-l6-1mI1P25ciSsyN7PwPHrxBSITvB2aIIbStkrnUyxTYwkPJm9HNw1w";
  //  const messagess = {
  //   message: {
  //     topic: "testing",
  //     notification: {
  //       title: "Portugal vs. Denmark",
  //       body: "great match!",
  //     },
  //     token: registrationTokens,
  //   },
  // };
  // await admin
  //   .messaging()
  //   .send(messagess)
  //   .then((response) => {
  //     // Response is a message ID string.
  //     console.log("Successfully sent message:", response);
  //   })
  //   .catch((error) => {
  //     console.log("Error sending message:", error);
  //   });
  // messaging()
  //   .sendMulticast(message)
  //   .then((response) => {
  //     console.log(response.successCount + " messages were sent successfully");
  //   });
};
