var mongoose = require("mongoose");
const Booth = require("../../../models/boothModel");
const Block = require("../../../models/blockModel");
const Vidhansabha = require("../../../models/vidhansabhaModel");
const Jila = require("../../../models/jilaModel");
const Loksabha = require("../../../models/loksabhaModel");
const State = require("../../../models/stateModel");
const Nikay = require("../../../models/nikayModel");
const Ward = require("../../../models/wardModel");
const Zone = require("../../../models/zoneModel");
const Sector = require("../../../models/sectorModel");
const Familysurvey = require("../../../models/surveyfamilyModel");
const Generalnews = require("../../../models/generalnewsModel");
const Suggestion = require("../../../models/suggestionModel");

const creatError = require("../../../utils/appError");
const Surveyfamily = require("../../../models/surveyfamilyModel");
const Surveyvoter = require("../../../models/surveyvoterModel");
const Education = require("../../../models/educationModel");
const Profession = require("../../../models/professionModel");
const Party = require("../../../models/party");
const Gender = require("../../../models/genderModel");
const User_role = require("../../../models/UserroleModel");
const User = require("../../../models/userModel");
const Surveyproblem = require("../../../models/surveyproblemsModel");
const Surveyboothvoter = require("../../../models/surveyboothvoterModel");
const VehiclesOwner = require("../../../models/vehicleownerModel");
const Vehicles = require("../../../models/vehiclesModel");
const Feedback = require("../../../models/feedbackModel");
const vehiclealloteModel = require("../../../models/vehiclealloteModel");

exports.addvehiclesurvey = async (req, res, next) => {
  try {
    // Find user
    const user = await User.find({ mobile: req.body.username });
    // console.log("user", user);
    if (!user || user.length === 0) {
      return next(new creatError("User not Found!", 404));
    }
    // Prepare owner data
    const ownerData = {
      userId: user[0]._id,
      ownername: req.body.ownername,
      addhar_no: req.body.addhar_no,
      mobile: req.body.mobile,
      no_of_vehicles: req.body.no_of_vehicles,
      image: req.body.image,
      address: req.body.address,
      entrydatetime: new Date(),
    };
    // console.log("ownerData is", ownerData);
    let newSurvey = [];
    if (req.body.datatype == "update") {
      const query = { _id: req.body.webId };
      const update = { $set: ownerData };
      newSurvey = await VehiclesOwner.updateOne(query, update, {});
    } else {
      newSurvey = await VehiclesOwner.create(ownerData);
    }

    // Prepare vehicles array with drivers
    const vehicles = req.body.vehiclesDtos.map((vehicle) => ({
      vehicle_name: vehicle.name,
      vehicle_color: vehicle.color,
      vehicle_number: vehicle.number,
      model: vehicle.model,
      vehicles_images: vehicle.image,
      drivername: vehicle.driver_name,
      license_no: vehicle.driver_license_no,
      mobile: vehicle.driver_mobile,
      address: vehicle.driver_address,
      aadhar_card: vehicle.aadhar_card,
      // Add more vehicle fields as needed
    }));
    console.log("vehicles datas is ", vehicles);
    // Save vehicles with drivers
    for (const vehicle of vehicles) {
      const vehicleDoc = await Vehicles.create({
        ownerId: newSurvey._id || req.body.webId,
        ...vehicle,
        entrydatetime: new Date(),
      });

      // Optionally, you can push vehicleDoc._id to VehiclesOwner if you want to reference vehicles from owner
    }
    // Handle questions if needed (as in your original code)
    // ...
    res.status(201).json({
      success: true,
      status: "success",
      message: "Vehicle owner, vehicles, and drivers saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllVehiclesWithOwner = async (req, res, next) => {
  try {
    const { search } = req.query; // Get search string from query params

    // Build match conditions for search
    let matchStage = {};
    if (search && search.trim() !== "") {
      const regex = new RegExp(search, "i");
      matchStage = {
        $or: [
          { vehicle_number: { $regex: regex } },
          { vehicle_name: { $regex: regex } },
          { drivername: { $regex: regex } },
          { mobile: { $regex: regex } }, // driver's mobile
        ],
      };
    }
    const vehicles = await Vehicles.aggregate([
      // Search in Vehicles collection
      ...(search && search.trim() !== "" ? [{ $match: matchStage }] : []),
      // Lookup owner info
      {
        $lookup: {
          from: "vehicleowners", // collection name in MongoDB (should be lowercase and plural)
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerInfo",
        },
      },
      {
        $unwind: "$ownerInfo",
      },

      // Search in owner fields if search is present
      ...(search && search.trim() !== ""
        ? [
            {
              $match: {
                $or: [
                  {
                    "ownerInfo.ownername": { $regex: new RegExp(search, "i") },
                  },
                  { "ownerInfo.mobile": { $regex: new RegExp(search, "i") } },
                ],
              },
            },
          ]
        : []),
      {
        $project: {
          _id: 1,
          vehicle_name: 1,
          vehicle_color: 1,
          vehicle_number: 1,
          model: 1,
          vehicles_images: 1,
          entrydatetime: 1,
          drivername: 1,
          mobile: 1, // driver's mobile
          ownername: "$ownerInfo.ownername",
          owner_mobile: "$ownerInfo.mobile",
          owner_image: "$ownerInfo.image",
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};
exports.getAllVehiclesWithSearch = async (req, res, next) => {
  try {
    const { search } = req.query; // Get search string from query params
    // Build match conditions for search
    let matchStage = {};
    if (search && search.trim() !== "") {
      const regex = new RegExp(search, "i");
      matchStage = {
        $or: [
          { vehicle_number: { $regex: regex } },
          { vehicle_name: { $regex: regex } },
          { drivername: { $regex: regex } },
        ],
      };
    }
    const vehicles = await Vehicles.aggregate([
      // Search in Vehicles collection
      ...(search && search.trim() !== "" ? [{ $match: matchStage }] : []),
      // Lookup owner info
      {
        $project: {
          _id: 1,
          vehicle_name: 1,
          vehicle_color: 1,
          vehicle_number: 1,
          model: 1,
          vehicles_images: 1,
          entrydatetime: 1,
          drivername: 1,
          allote: 1,
          mobile: 1, // driver's mobile
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};
const parseDate = (dateStr) => {
  // Expects DD/MM/YYYY
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
};
exports.vehicleallotment = async (req, res, next) => {
  try {
    // Find user
    const user = await User.find({ mobile: req.body.username });
    // console.log("user", user);
    if (!user || user.length === 0) {
      return next(new creatError("User not Found!", 404));
    }
    // Prepare owner
    // console.log("users ",user)
    const allotmentData = {
      createrId: user[0]._id,
      userId: req.body.userId,
      allotedate: req.body.allotedate
        ? parseDate(req.body.allotedate)
        : undefined,
      returndate: req.body.returndate
        ? parseDate(req.body.returndate)
        : undefined,
      vehicleId: req.body.vehicleId,
    };
    // console.log("allotmentData is", allotmentData);
    let newSurvey = [];

    newSurvey = await vehiclealloteModel.create(allotmentData);
    const vehiclesUpdate = await Vehicles.updateOne(
      { _id: req.body.vehicleId },
      {
        allote: true,
      }
    );
    res.status(201).json({
      success: true,
      status: "success",
      message: "Vehicle Allotment successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.vehicleallotmentlist = async (req, res, next) => {
  try {
    const { userId, teamId, roleId, username, lang } = req.body;
    const user = await User.find({ mobile: username });
    if (!user || user.length === 0) {
      return next(new creatError("User not Found!", 404));
    }
    let matchStage = {};
    let createrId = user[0]._id;
    // const feedbackData = await vehiclealloteModel.find({
    //   createrId: user[0]._id,
    //   // userId: userId,
    // });
    const VehiclesData = await vehiclealloteModel.aggregate([
      {
        $lookup: {
          from: "users", // collection name in MongoDB (should be lowercase and plural)
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
          pipeline: [
            {
              $project: {
                name: `$name_${lang}`, // Assuming lang is 'hi' or 'en'
                name_en: 1,
                name_default: `$name`,
                mobile: 1,
                _id: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "vehicles", // collection name in MongoDB (should be lowercase and plural)
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicleInfo",
        },
      },
      {
        $project: {
          _id: 1,
          timestamps: 1,
          vehicleInfo: 1, // driver's + vehicle details
          allotedate: 1,
          return: 1, // Assuming you want to include the return status
          returndate: 1,
          userInfo: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: VehiclesData,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateVehicleAllomentStatus = async (req, res, next) => {
  try {
    const { allotmentId, returnStatus, username, lang } = req.body;
    const user = await User.find({ mobile: username });
    if (!user || user.length === 0) {
      return next(new creatError("User not Found!", 404));
    }
    // Find the allotment by ID
    const allotment = await vehiclealloteModel.findById(allotmentId);
    if (!allotment) {
      return next(new creatError("Allotment not found!", 404));
    }

    // Update the return status
    allotment.return = returnStatus;
    allotment.updateuserId = user[0]._id;
    await allotment.save();

    const vehiclesUpdate = await Vehicles.updateOne(
      { _id: allotment.vehicleId },
      {
        allote: false, // Set allote to false when returning the vehicle
      }
    );

    res.status(200).json({
      success: true,
      message: "Vehicle allotment status updated successfully",
      data: allotment,
    });
  } catch (error) {
    next(error);
  }
};
