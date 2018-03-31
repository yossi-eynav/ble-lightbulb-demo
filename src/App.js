import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import RaisedButton from 'material-ui/RaisedButton';


export default class App extends Component {

    characteristic;

    constructor() {
        super();
        this.BLEConnect = this.BLEConnect.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    onChangeHandler(value) {
        
        const r = Number(value.rgb.r).toString(16);
        const g = Number(value.rgb.g).toString(16);
        const b = Number(value.rgb.b).toString(16);
        const a = Number(value.rgb.a).toString(16);

        this.setBulbColor(r, g, b, a);
    }

    setBulbColor(red, green, blue, alpha) {
        console.info("color: ", red, green, blue);
        const data =  new Uint8Array([`0x${red}`,`0x${green}`, `0x${blue}`, `0x${alpha}`]);
        return this.characteristic.writeValue(data);
    };

    BLEConnect(){
        return navigator.bluetooth.requestDevice({filters: [{services: [0xFFB0]}]})
            .then(device => {
                return device.gatt.connect();
            })
            .then(server => {
                return server.getPrimaryService(0xFFB0)
            })
            .then(service => {
                return service.getCharacteristic(0xFFB5)
            })
            .then(character => {
                this.characteristic = character;
            })
            .catch(e => console.error(e));
    }
    
  render() {

    return( <div>
                <RaisedButton label="Connect!" style={{marginTop:'30px',marginBottom:'10px',width: '100%'}} primary={true} onClick={this.BLEConnect}/>
                <SketchPicker type="sketch" onChange={this.onChangeHandler} />
            </div> );
  }
}