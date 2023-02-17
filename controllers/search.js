const { TotalData } = require("../models/index");
const { Sequelize, Op, json } = require("sequelize");
const { NUMBER } = require("sequelize");
const { LogoScrape } = require('logo-scrape');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient();
client.connect()
module.exports = {
  data: async (req, res) => {
    try {
      const {
        Firmnavn, 
        virksomhedsform,
        branchebetegnelse_primær,
        ansatte_interval,
        antalPenheder,
        yearly_result,
        p_kommunenavn,
        p_region,
      } = req.body;
      const whereClause = {};
      if (Firmnavn) {
        whereClause.Firmnavn = { [Op.or]: [] };
        const searchTerms = Firmnavn.split(" ");
        for (let searchTerm of searchTerms) {
          whereClause.Firmnavn[Op.or].push({
            [Op.like]: `%${searchTerm}%`,
          });
        }
      }
      const rq = {
        ...whereClause,
        virksomhedsform,
        branchebetegnelse_primær,
        ansatte_interval,
        antalPenheder,
        yearly_result,
        p_kommunenavn,
        p_region,
      };
      const OrCond = [];
      for (var k in rq) {
        if (rq.hasOwnProperty(k)) {
          if (rq[k]) OrCond.push({ [k]: rq[k] });
        }
      }
      var comp = await TotalData.findAll({
        where: {
          [Op.or]: OrCond,
        }
      });
    client.set(Firmnavn,JSON.stringify(comp) ,redis.print);
    return res.json({comp})

      // res
      //   .status(200)
      //   .send({
      //     message: "Data has been sent successfully",
      //     comp:comp
      //   });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .send(err.message || "Something went wrong...");
    }
  },
  Type: async (req, res) => {
    try {
      const comp = await TotalData.findAll({
        attributes: [
          [
            Sequelize.fn("DISTINCT", Sequelize.col("virksomhedsform")),
            "virksomhedsform",
          ],
        ],
      })
       client.set("virksomhedsform",JSON.stringify(comp) ,redis.print);
    return res.json({comp})
    } catch (err) {
      return res
        .status(err.status || 500)
        .send(err.message || "Something went wrong...");
    }
  },
Industry: async (req,res)=>{
  try {
    const ind = await TotalData.findAll({
        attributes: [
          [
            Sequelize.fn("DISTINCT", Sequelize.col("branchebetegnelse_primær")),
            "branchebetegnelse_primær",
          ]
        ],
        order: [["branchebetegnelse_primær", "ASC"]]
      });
      client.set("branchebetegnelse_primær",JSON.stringify(ind) ,redis.print);
      return res.json({ind})
  } catch (err) {
    return res
    .status(err.status || 500)
    .send(err.message || "Something went wrong...");
  }
},
IntervalEmployee: async (req,res)=>{
  try {
    const employee = await TotalData.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("ansatte_interval")),
          "ansatte_interval",
        ],
      ],
    });
    client.set("ansatte_interval",JSON.stringify(employee) ,redis.print);
    return res.json({employee})
  } catch (err) {
    return res
    .status(err.status || 500)
    .send(err.message || "Something went wrong...");
  }
},
Region: async (req,res)=>{
  try {
    const region = await TotalData.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("p_region")),
          "p_region",
        ],
      ],
    });
    client.set("p_region",JSON.stringify(region) ,redis.print);
    return res.json({region})
  } catch (err) {
    return res
    .status(err.status || 500)
    .send(err.message || "Something went wrong...");
  }
},
Muncipality: async (req,res)=>{
  try {
    const muncipality = await TotalData.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("p_kommunenavn")),
          "p_kommunenavn",
        ],
      ],
    });
    client.set("p_kommunenavn",JSON.stringify(muncipality) ,redis.print);
    return res.json({muncipality})
  } catch (err) {
    return res
    .status(err.status || 500)
    .send(err.message || "Something went wrong...");
  }
},
initialdata: async (req,res)=>{
  try {
    const initialdata = await TotalData.findAll({ order: Sequelize.literal('rand()'), limit: 9  });
    client.set("initialdata",JSON.stringify(initialdata) ,redis.print);
      return res.json({initialdata})
  } catch (err) {
    console.log(err);
    return res
    .status(err.status || 500)
    .send(err.message || "Something went wrong...");
  }
}
};
