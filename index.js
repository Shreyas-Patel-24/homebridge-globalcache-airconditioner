var Service, Characteristic;
var process = require("./ircode_process.js");
var ac_swt =[];
var ac_temp = [];
var ac_fan = [];
var min_temp = [];
var max_temp = [];
var fan_step = [];
module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerPlatform("homebridge-globalcache-ac", "GC-AC", AC);
}
function AC(log, config) 
{
  this.log = log;
  this.ip = config["ip"];
  this.device = config["device"];
}
AC.prototype.accessories = function(callback){
   var results = [];
	for(var i=0;i<this.device.length;i++){
	results.push(new AirConditioner_WithoutSwing(this,this.device[i].port,this.ip,this.device[i].ir_path,ac_temp.length));
	ac_swg.push(2);	
	ac_swt.push(0);
	ac_fan.push(Math.round(100/this.device[i].fan_step));
	ac_temp.push(22);
	min_temp.push(this.device[i].min_temp);
	max_temp.push(this.device[i].max_temp);
	fan_step.push(Math.round(100/this.device[i].fan_step));	
	}
	callback(results);
	}
	
class AirConditioner_WithoutSwing{
	constructor(platform,port,ip,ir_db,index){
      this.platform = platform;
	  this.port = port;
	  this.ip = ip;
	  this.ir_path = ir_db;
	  this.index  = index;	  
	  this.name = "AC-"+this.index;	  
	  this.AirConditioner_WithoutSwing = new Service.HeaterCooler(this.name);	  
	}
	set_ac_switch(stt,callback){
	    ac_swt[this.index] = stt;
        process.setircode(stt,ac_fan[this.index],ac_swg[this.index],this.ir_path,this.ip,this.port);
	    callback(null)
	}
	get_ac_switchstatus(callback){
	 callback(null, ac_swt[this.index]);
	}
	
	set_ac_mode(stt,callback){        
        process.setircode(stt,ac_fan[this.index],ac_swg[this.index],this.ir_path,this.ip,this.port);       
	    callback(null)
  	}	
	get_ac_mode(callback){
	  callback(null, 2);
	}
	get_ac_fanspeed(callback){
	  callback(null, ac_fan[this.index]);
	}
	set_ac_fanspeed(stt,callback){
	 ac_fan[this.index] = stt;	
     process.setircode(ac_temp[this.index],stt,ac_swg[this.index],this.ir_path,this.ip,this.port);       		
	 callback(null);
	}	
	get_ac_currentmode(callback){
    callback(null, ac_swt[this.index]);
	}
	
	get_ac_temp(callback){
    callback(null, ac_temp[this.index]);
	}	
	set_ac_temp(stt,callback){
		ac_temp[this.index] = stt;	
        process.setircode(stt,ac_fan[this.index],ac_swg[this.index],this.ir_path,this.ip,this.port);            
	    callback(null);
	}
				
	 getServices(){
 
    var infoService = new Service.AccessoryInformation();
        infoService
         .setCharacteristic(Characteristic.Manufacturer, "Chipbucket Solutions Pvt. Ltd.")
         .setCharacteristic(Characteristic.Model, "Daikin")
         .setCharacteristic(Characteristic.SerialNumber, "CBTAC-"+this.i);
    this.AirConditioner_WithoutSwing
         .getCharacteristic(Characteristic.Active).on('get', this.get_ac_switchstatus.bind(this)).on('set', this.set_ac_switch.bind(this)); 
	this.AirConditioner_WithoutSwing
         .getCharacteristic(Characteristic.CurrentHeaterCoolerState).on('get', this.get_ac_currentmode.bind(this))
    this.AirConditioner_WithoutSwing
         .getCharacteristic(Characteristic.TargetHeaterCoolerState).on('get', this.get_ac_mode.bind(this)).on('set', this.set_ac_mode.bind(this)) 
         .setProps({
             minValue: 2,
             maxValue: 2,
             minStep: 1
           });
   this.AirConditioner_WithoutSwing
         .getCharacteristic(Characteristic.CurrentTemperature).on('get', this.get_ac_temp.bind(this)) 
	     .setProps({
             minValue: min_temp[this.index],
             maxValue: max_temp[this.index],
             minStep: 1
           });
	this.AirConditioner_WithoutSwing
         .getCharacteristic(Characteristic.RotationSpeed).on('get', this.get_ac_fanspeed.bind(this)).on('set', this.set_ac_fanspeed.bind(this))
	     .setProps({
             minValue: 0,
             maxValue: 100,
             minStep: fan_step[this.index]
           });
	this.AirConditioner_WithoutSwing
         .getCharacteristic(Characteristic.CoolingThresholdTemperature).on('get', this.get_ac_temp.bind(this)).on('set', this.set_ac_temp.bind(this)) 
	     .setProps({
             minValue: min_temp[this.index],
             maxValue: max_temp[this.index],
             minStep: 1
           });
    	return [infoService,this.AirConditioner_WithoutSwing];
    }
}