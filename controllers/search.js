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
      console.log(OrCond);
      var comp = await TotalData.findAll({
        where: {
          [Op.or]: [OrCond],
          // Firmnavn:Firmnavn
        }
      });
    //   client.HSET('foo', (err, reply) => {
    //     if (err){
    //       console.log("err",err)
    //     }
    //     console.log(';reply',reply);
    // });
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
      });
      res
        .status(200)
        .send({comp});
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
      res
        .status(200)
        .send({ind});
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
      res
        .status(200)
        .send({employee});
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
      res
        .status(200)
        .send({region});
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
      res
        .status(200)
        .send({muncipality});
  } catch (err) {
    return res
    .status(err.status || 500)
    .send(err.message || "Something went wrong...");
  }
},
initialdata: async (req,res)=>{
  try {
    const initialdata = await TotalData.findAll({ order: Sequelize.literal('rand()'), limit: 9  });
      res
        .status(200)
        .send({initialdata});
  } catch (err) {
    console.log(err);
    return res
    .status(err.status || 500)
    .send(err.message || "Something went wrong...");
  }
}
};
