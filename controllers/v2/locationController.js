// const { ObjectId } = require("mongodb"); // or ObjectID
var mongoose = require("mongoose");
const User = require("../../models/userModel");

const Booth = require("../../models/boothModel");
const creatError = require("../../utils/appError");
const Ward = require("../../models/wardModel");
const Location = require("../../models/locationModel");
async function mobilenumber_details(username, lang) {
  const users = await User.aggregate([
    {
      $match: { mobile: username },
    },
    {
      $lookup: {
        from: "user_roles",
        localField: "role",
        foreignField: "id",
        as: "postData",
        pipeline: [
          {
            $project: {
              _id: 0,
              id: 1,
              role_en: 1,
              role: `$role_${lang}`,
              role_type: 1,
              level: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        father_name: 1,
        mobile: 1,
        role: 1,
        stateid: 1,
        loksabhaid: 1,
        vidhansabhaid: 1,
        blockid: 1,
        boothid: 1,
        jilaid: 1,
        wardid: 1,
        nikayid: 1,
        postData: 1,
      },
    },
    { $sort: { _id: -1 } },
    { $skip: 0 },
    { $limit: 1 },
  ]);
  return users;
}
exports.saveLocation = async (req, res, next) => {
  try {
    const { username, userid, lat, long, address } = req.body;

    if (!userid || lat === undefined || long === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    // 1. User ki sabse latest location database se find karein
    const lastLocation = await Location.findOne({ userId: userid }).sort({ timestamp: -1 });

    // 2. Check karein ki kya new coordinates exact last location jaise hi hain
    if (lastLocation && lastLocation.latitude === Number(lat) && lastLocation.longitude === Number(long)) {
      return res.status(200).json({
        success: true,
        message: 'Duplicate location ignored: User position has not changed.',
        data: lastLocation
      });
    }
    // 3. Agar coordinates alag hain, to new entry save karein
    const newLocation = new Location({
      userId: userid,
      username: username,
      latitude: Number(lat),
      longitude: Number(long),
      address: address || ''
    });

    await newLocation.save();

    return res.status(201).json({
      success: true,
      message: 'New Location tracked successfully',
      data: newLocation
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
exports.report = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { filter, date } = req.query; // filter = 'today' | 'yesterday' | 'custom'

    let startDate = new Date();
    let endDate = new Date();

    if (filter === 'today') {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (filter === 'yesterday') {
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
    } else if (filter === 'custom' && date) {
      startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Default: Last 24 hours
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    const trackingPoints = await Location.find({
      userId: userId,
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: 1 }); // Purani se nayi sequence (Polyline ke liye)

    return res.status(200).json({
      success: true,
      count: trackingPoints.length,
      data: trackingPoints
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
