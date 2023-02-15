"use strict";
module.exports = (sequelize, DataTypes) =>{
  const Signup = sequelize.define("sign_up", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstname:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      email:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      password:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      googleId:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      linkedInid:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      picture:{
        defaultValue:"profile.png",
        type: DataTypes.STRING,
        allowNull: true,
      }
    
  },{
    tableName: 'sign_up',
    timestamps: false
    }   
 );

  return Signup;
}






