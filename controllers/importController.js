const csv = require("csvtojson");
const booth = require("../models/boothModel");
const Booth = require("../models/boothModel");
const User = require("../models/userModel");
const Block = require("../models/blockModel");
const Sector = require("../models/sectorModel");
const Zone = require("../models/zoneModel");
const Surveyfamily = require("../models/surveyfamilyModel");
const Surveyvoter = require("../models/surveyvoterModel");
const importuser = async (req, res) => {
  // console.log(req)
  try {
    if (req.body.level === "booth") {

      const response = await csv().fromFile(req.file.path);

      const userdata = response
        .map(item => ({
          id: item.boothid,
          booth_en: item.booth_hindi,
          booth_hi: item.booth_hindi,

          booth_kramank: item.boothkramank,
          block_id: item.blockid,
          zone_id: item.zoneid,
          sector_id: item.sectorid,
          vidhansabha_id: item.vidhansabhaid,
          loksabha_id: item.loksabhaid,
          jila_id: 0,
          stateid: item.stateid,
          booth_kn: item.booth_hindi,
          booth_mr: item.booth_hindi,
          booth_gu: item.booth_hindi,
          booth_ml: item.booth_hindi,
          booth_pu: item.booth_hindi,
          booth_bn: item.booth_hindi,
          booth_te: item.booth_hindi,
          booth_ta: item.booth_hindi,
          booth_or: item.booth_hindi,
          booth_lus: item.booth_hindi,
          booth_as: item.booth_hindi,
          booth_doi: item.booth_hindi,
        }));

      if (userdata.length > 0) {
        const result = await Booth.insertMany(userdata);
        console.log(result);
        res.status(200).json({ message: 'Data imported successfully', data: result });
      } else {
        res.status(400).json({ message: 'No valid data to import' });
      }
    }
    else if (req.body.level === "sector") {

      const response = await csv().fromFile(req.file.path);

      const userdata = response
        .map(item => ({
          id: item.sectorid,
          sector_en: item.sector_hindi,
          sector_hi: item.sector_hindi,

          sector_kramank: item.sectorkramank,
          block_id: item.blockid,
          zone_id: item.zoneid,
          // sector_id: item.sectorid,
          vidhansabha_id: item.vidhansabhaid,
          loksabha_id: item.loksabhaid,
          jila_id: 0,
          stateid: item.stateid,
          sector_kn: item.sector_hindi,
          sector_mr: item.sector_hindi,
          sector_gu: item.sector_hindi,
          sector_ml: item.sector_hindi,
          sector_pu: item.sector_hindi,
          sector_bn: item.sector_hindi,
          sector_te: item.sector_hindi,
          sector_ta: item.sector_hindi,
          sector_or: item.sector_hindi,
          sector_lus: item.sector_hindi,
          sector_as: item.sector_hindi,
          sector_doi: item.sector_hindi,
        }));

      if (userdata.length > 0) {
        const result = await Sector.insertMany(userdata);
        console.log(result);
        res.status(200).json({ message: 'Data imported successfully', data: result });
      } else {
        res.status(400).json({ message: 'No valid data to import' });
      }
    }
    else if (req.body.level === "zone") {

      const response = await csv().fromFile(req.file.path);

      const userdata = response
        .map(item => ({
          id: item.zoneid,
          zone_en: item.zone_hindi,
          zone_hi: item.zone_hindi,

          zone_kramank: item.zonekramank,
          block_id: item.blockid,
          zone_id: item.zoneid,
          // zone_id: item.zoneid,
          vidhansabha_id: item.vidhansabhaid,
          loksabha_id: item.loksabhaid,
          jila_id: 0,
          stateid: item.stateid,
          zone_kn: item.zone_hindi,
          zone_mr: item.zone_hindi,
          zone_gu: item.zone_hindi,
          zone_ml: item.zone_hindi,
          zone_pu: item.zone_hindi,
          zone_bn: item.zone_hindi,
          zone_te: item.zone_hindi,
          zone_ta: item.zone_hindi,
          zone_or: item.zone_hindi,
          zone_lus: item.zone_hindi,
          zone_as: item.zone_hindi,
          zone_doi: item.zone_hindi,
        }));

      if (userdata.length > 0) {
        const result = await Zone.insertMany(userdata);
        console.log(result);
        res.status(200).json({ message: 'Data imported successfully', data: result });
      } else {
        res.status(400).json({ message: 'No valid data to import' });
      }
    }
    else if (req.body.level === "block") {
      const response = await csv().fromFile(req.file.path);

      const userdata = response
        .map(item => ({
          id: item.blockid,
          block_en: item.block_hindi,
          block_hi: item.block_hindi,

          block_kramank: item.blockkramank,
          // block_id: item.blockid,
          // zone_id: item.zoneid,
          // sector_id: item.sectorid,
          vidhansabha_id: item.vidhansabhaid,
          loksabha_id: item.loksabhaid,
          jila_id: 0,
          stateid: item.stateid,
          block_kn: item.block_hindi,
          block_mr: item.block_hindi,
          block_gu: item.block_hindi,
          block_ml: item.block_hindi,
          block_pu: item.block_hindi,
          block_bn: item.block_hindi,
          block_te: item.block_hindi,
          block_ta: item.block_hindi,
          block_or: item.block_hindi,
          block_lus: item.block_hindi,
          block_as: item.block_hindi,
          block_doi: item.block_hindi,
        }));

      if (userdata.length > 0) {
        const result = await Block.insertMany(userdata);
        console.log(result);
        res.status(200).json({ message: 'Data imported successfully', data: result });
      } else {
        res.status(400).json({ message: 'No valid data to import' });
      }

    }

    res.send({ status: 200, success: true, msg: "done" });
  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
};
const importkaryakarta = async (req, res) => {
  try {
    const response = await csv().fromFile(req.file.path);

    const userdata = response
      .filter(item => item.name && item.karyakarta === "1")
      .map(item => ({
        oldid: item.id,
        name: item.name,
        role: 1,
        oldrole: item.post,
        father_name: item.father_name,
        mobile: item.mobile_number1,
        gender: item.gender,
        address: item.address,
        stateid: item.stateid,
        boothid: item.boothid,
        zoneid: item.zoneid,
        sectorid: item.sectorid,
        blockid: item.blockid,
        vidhansabhaid: item.vidhansabhaid,
        loksabhaid: item.loksabhaid,
      }));

    if (userdata.length > 0) {
      const result = await User.insertMany(userdata);
      console.log(result);
      res.status(200).json({ message: 'Data imported successfully', data: result });
    } else {
      res.status(400).json({ message: 'No valid data to import' });
    }
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ message: 'Error importing data', error });
  }
};
const importFamily = async (req, res) => {
  try {
    const response = await csv().fromFile(req.file.path);

    const userdata = await Promise.all(response
      .filter(item => item.name && item.head === "1")
      .map(async (item) => {
        // userId karyakartaid
        const userss = await User.findOne({ oldid: item.karyakartaid });
        // console.log(userss._id.toString())
        return {
          userId: userss._id.toString(),
          familyid: item.familyid,
          house_no: item.house_no,
          religionid: item.religion_id,
          categoryid: item.categori_id,
          castename: item.caste,
          // oldid: item.id,
          // name: item.name,
          // role: 1,
          // oldrole: item.post,
          // father_name: item.father_name,
          // mobile: item.mobile_number1,
          // gender: item.gender,
          // address: item.address,
          stateid: item.stateid,
          boothid: item.boothid,
          zoneid: item.zoneid,
          sectorid: item.sectorid,
          blockid: item.blockid,
          vidhansabhaid: item.vidhansabhaid,
          loksabhaid: 30,
        }
      }));

    if (userdata.length > 0) {
      // console.log(userdata)
      const result = await Surveyfamily.insertMany(userdata);
      // console.log(result);
      res.status(200).json({ message: 'Data imported successfully', data: result });
      // res.status(200).json({ message: 'Data imported successfully', });
    } else {
      res.status(400).json({ message: 'No valid data to import' });
    }
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ message: 'Error importing data', error });
  }
};
const importFamilyvoter = async (req, res) => {
  try {
    const response = await csv().fromFile(req.file.path);
    const userdata = await Promise.all(response
      .filter(item => item.name)
      .map(async (item) => ({
        familyid: item.familyid,
        name: item.name,
        rel_name: item.rel_name,
        mobile: item.mobile_number1,
        whatsapp: item.whatsapp,
        educationid: item.education_id,
        religionid: item.religion_id,
        professionid: item.profession_id,
        // dob: item.dob,
        // doa: item.doa,
        current_address: item.address,
        partyid: item.party,
        voterId: item.voter_id,
        gender: item.gender,
        disable_voter: item.disabled_voter,
        age: item.age,
        head: item.head,
        // entrydatetime: item.entrydatetime,
        stateid: item.stateid,
        boothid: item.boothid,
        zoneid: item.zoneid,
        sectorid: item.sectorid,
        blockid: item.blockid,
        vidhansabhaid: item.vidhansabhaid,
        loksabhaid: 30,

      })));

    if (userdata.length > 0) {
      // console.log(userdata)
      const result = await Surveyvoter.insertMany(userdata);
      // console.log(result);
      res.status(200).json({ message: 'Voetr Data imported successfully' });
      // res.status(200).json({ message: 'Data imported successfully', });
    } else {
      res.status(400).json({ message: 'No valid data to import' });
    }
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ message: 'Error importing data', error });
  }
};
const importCaste = async (req, res) => {
  try {
    const response = await csv().fromFile(req.file.path);

    const userdata = await Promise.all(response
      .map(async (item) => {
        // userId karyakartaid
        // const userss = await User.findOne({ oldid: item.karyakartaid });
        const newuserdata = {
          casteid: item.id,
        };
        const query = { castename: item.caste_hi };
        const update = { $set: newuserdata };
        const options = {};
        newUser = await Surveyfamily.updateMany(query, update, options);

        return {
          id: item.id,

        }
      }));

    if (userdata.length > 0) {
      // console.log(userdata)
      // const result = await Surveyfamily.insertMany(userdata);
      // console.log(result);
      res.status(200).json({ message: 'Data imported successfully', data: userdata });
      // res.status(200).json({ message: 'Data imported successfully', });
    } else {
      res.status(400).json({ message: 'No valid data to import' });
    }
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ message: 'Error importing data', error });
  }
};
module.exports = {
  importuser,
  importkaryakarta,
  importFamily,
  importFamilyvoter,
  importCaste
};
