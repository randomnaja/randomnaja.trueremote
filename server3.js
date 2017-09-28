'use strict'
 
const Hapi = require('hapi');
const Request = require('request');
const Vision = require('vision');
const Handlebars = require('handlebars');
const LodashFilter = require('lodash.filter');
const LodashTake = require('lodash.take');
const Inert = require('inert');
 
const server = new Hapi.Server();

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', {
  baudRate: 9600
});
 
server.connection({
    host: '0.0.0.0',
    port: 10003
});

server.register(Inert, () => {});
 
// Register vision for our views
server.register(Vision, (err) => {
    server.views({
        engines: {
            html: Handlebars
        },
        relativeTo: __dirname,
        path: './views',
    });
});
 
server.start((err) => {
    if (err) {
        throw err;
    }
 
    console.log(`Server running at: ${server.info.uri}`);
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index', {});
        /*Request.get('http://api.football-data.org/v1/competitions/438/leagueTable', function (error, response, body) {
            if (error) {
                throw error;
            }
 
            const data = JSON.parse(body);
            reply.view('index', { result: data });
        });*/
    }
});

server.route({
	method : 'GET',
	path : '/{button}',
   handler: function (request, reply) {
      port.write(request.params.button, function(err) {
      if (err) {
      	return console.log('Error on write: ', err.message);
      }
      	console.log('message written');
      });
      port.on('readable', function () {
         console.log('Data:', port.read());
      });
     
		reply("Done" + encodeURIComponent(request.params.button))
	}
});
 
// A simple helper function that extracts team ID from team URL
Handlebars.registerHelper('teamID', function (teamUrl) {
    return teamUrl.slice(38);
});

server.route({
    method: 'GET',
    path: '/js/{param*}',
    handler: {
        directory: {
            path: 'js'
        }
    }
});
