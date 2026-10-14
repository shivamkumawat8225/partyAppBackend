const mongoose = require("mongoose");
const serveyVoter = require("./surveyvoterModel");

const ElectionDayLive = {
  async getTotalVoterVid(vidhansabhaid, blockid, zoneid, sectorid, boothid) {
    const query = {};
    if (vidhansabhaid) query.vidhansabhaid = vidhansabhaid;
    if (blockid) query.blockid = blockid;
    if (zoneid) query.zoneid = zoneid;
    if (sectorid) query.sectorid = sectorid;
    if (boothid) query.boothid = boothid;


    // query.karyakarta = 0; // New condition
    // query.dead_voter = 0; // New condition

    return await serveyVoter.aggregate([
      { $match: query },
      { $count: "count" },
    ]);
  },

  async getElectionResultByRemark(vidhansabhaid, blockid, zoneid, sectorid, boothid, opinion) {
    const query = {};
    if (vidhansabhaid) query.vidhansabhaid = vidhansabhaid;
    if (blockid) query.blockid = blockid;
    if (zoneid) query.zoneid = zoneid;
    if (sectorid) query.sectorid = sectorid;
    if (boothid) query.boothid = boothid;

    query.vote = 1;
    // query.dead_voter = { $ne: 1 };

    // query.remark = opinion;

    return await serveyVoter.aggregate([
      { $match: query },
      { $count: "count" },
    ]);
  },

  async getNotVoteElectionResultByRemark(vidhansabhaid, blockid, zoneid, sectorid, boothid, opinion) {
    const query = {};
    if (vidhansabhaid) query.vidhansabhaid = vidhansabhaid;
    if (blockid) query.blockid = blockid;
    if (zoneid) query.zoneid = zoneid;
    if (sectorid) query.sectorid = sectorid;
    if (boothid) query.boothid = boothid;

    query.vote = 0;

    // query.dead_voter = { $ne: 1 };
    // query.remark = opinion;

    return await serveyVoter.aggregate([
      { $match: query },
      { $count: "count" },
    ]);
  },
};

module.exports = ElectionDayLive;
