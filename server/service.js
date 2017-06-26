'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

require('dotenv').config({path: '../.env'});

service.get('/service/:location', (req, res, next) => {
    console.log(process.env.SERVICE_ADDRESS_URL);
    console.log("Test");
    request.get(process.env.SERVICE_ADDRESS_URL + '=' + req.params.location + '&key=' +  process.env.SERVICE_ADDRESS_KEY, (err, response) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }

        const location = response.body.results[0].geometry.location;
        const timestamp = +moment().format('X');

        request.get(process.env.SERVICE_LOCATION_URL + '=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + '&key=' + process.env.SERVICE_LOCATION_KEY, (err, response) => {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            
            const result = response.body;

            const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');
        
            res.json({result: timeString});
        });
    });

});

module.exports = service;