const Net = require('net');
const fs = require('fs');
const csv = require('csv-parser');
var connected_ip = [];
var client;
var last_timestamp = timestamp();
function setircode(temp,fan,swing,ir_file_path,ip,port){
console.log(temp,fan,swing,ir_file_path,ip,port);	
   gc_connect(ip);   
  fs.createReadStream(ir_file_path)
   .pipe(csv())
   .on('data', (row) => {
	 if(Number(temp) > 1){
	 if(String(row.temperature) == String(temp) && String(row.fanspeed) == String(fan)){ 
	             var code = row.code.replace(":1",":"+port);
				 console.log( timestamp()-last_timestamp);
				 if(connected_ip.indexOf(ip) != -1  && timestamp()-last_timestamp > 500){   
				       client.write(code+"\r");   
					   last_timestamp = timestamp();
					   }
	 }
	 }
	 else{
		if(String(row.temperature).toLowerCase() == String(Boolean(Number(temp)))){ 
	             var code = row.code.replace(":1",":"+port);
                 console.log( timestamp()-last_timestamp);
				 if(connected_ip.indexOf(ip) != -1  && timestamp()-last_timestamp > 500){   
				       client.write(code+"\r");   
					   last_timestamp = timestamp();
					   }	 } 
	 }
   })
   .on('end', () => {
    console.log('CSV file successfully processed');
   });

}

function gc_connect(ip){
	
	if(connected_ip.indexOf(ip) == -1){
     client.connect(4998,ip ,function() {
	  connected_ip.push(ip);	 
	 console.log("Connection Successful-",ip);
   });
   client.on('data', function(rec){        
    console.log(rec.toString());
   });
   client.on('timeout', () => {
	   console.log("Globalcache is Offline");
	   client.destroy();
   });  
   client.on('error', (err) => {
       console.log("Connection Error");
	   connected_ip.splice(connected_ip.indexOf(ip),1);
	   client.destroy();
   });
   client.on('close', function() {
	console.log('Connection closed');
	connected_ip.splice(connected_ip.indexOf(ip),1);
	client.destroy();
   });
}
}

function timestamp(){
	var d = new Date();
	return d.getTime();
}
module.exports = { setircode }