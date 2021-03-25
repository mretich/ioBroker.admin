import { Component } from 'react';

import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

import withWidth from '@material-ui/core/withWidth';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

// colors
import blueGrey from '@material-ui/core/colors/blueGrey'

import Utils from '../../Utils';

// icons

//data
import countries from "../../assets/json/countries";

const styles = theme => ({
    tabPanel: 
    {
        width:      '100%',
        height:     '100% ',
        overflow:   'auto', 
        overflowX:   'hidden',
        padding:    15,
        //backgroundColor: blueGrey[ 50 ]
    } ,
    formControl: 
    {
        margin: theme.spacing(1),
        minWidth: "100%",
     },
    selectEmpty: 
    {
        marginTop: theme.spacing(2),
    },
    descrPanel:
    {
        width:"100%",
        // backgroundColor:"transparent",
        padding :16,
        // border:"none",
        display:'flex',
        alignItems:"center"
    },
});

class MainSettingsDialog extends Component 
{
    constructor(props)
    {
        super(props);
        this.state={
            values:[],
            data:{},
            zoom: 14
        }

    }
    componentDidMount()
    {
        // console.log("mount")

    }
    getSettings()
    {
        return [
            {
                id      : "language",
                title   : "System language:",       
                values  : [
                    {
                        id:"en",
                        title:"English"
                    },
                    {
                        id:"ge",
                        title:"Deutsch"
                    },
                    {
                        id:"ru",
                        title:"русский"
                    },
                    {
                        id:"po",
                        title:"Portugues"
                    },
                    {
                        id:"nd",
                        title:"Nederlands"
                    },
                    {
                        id:"fr",
                        title:"français"
                    },
                    {
                        id:"it",
                        title:"Italiano"
                    },
                    {
                        id:"sp",
                        title:"Espanol"
                    },
                    {
                        id:"pl",
                        title:"Polski"
                    },
                    {
                        id:"ch",
                        title:"简体中文"
                    }
                ]      
            },
            {
                id:"tempUnit",
                title:"Temperature units",
                values: [
                    {
                        id:"°C",
                        title:"°C"
                    },
                    {
                        id:"°F",
                        title:"°F"
                    }
                ]
            },
            {
                id:"currency",
                title:"Currency sign",
                values: [
                    {
                        id:"€",
                        title:"€"
                    },
                    {
                        id:"$",
                        title:"$"
                    },
                    {
                        id:"₽",
                        title:"₽"
                    },
                    {
                        id:"₤",
                        title:"₤"
                    }
                ]
            },
            {
                id:"dateFormat",
                title:"Date format",
                values: [
                    {
                        id:"DD.MM.YYYY",
                        title:"DD.MM.YYYY"
                    },
                    {
                        id:"DD.MM.YY",
                        title:"DD.MM.YY"
                    },
                    {
                        id:"DD/MM/YYYY",
                        title:"DD/MM/YYYY"
                    }
                ]
            },
            {
                id:"isFloatComma",
                title:"Date Float comma sign",
                values: [
                    {
                        id:true,
                        title:"comma"
                    },
                    {
                        id:false,
                        title:"point"
                    }
                ]
            },
            {
                id:"defaultHistory",
                title:"Default History",
                values: [
                   
                ]
            },
            {
                id:"activeRepo",
                title:"Default Repository",
                values: Utils.objectMap(this.props.data2.native.repositories, (repo, name) => {
                    return {
                        id: name,
                        title: name
                    }
                })
            }
        ]
    }
    render()
    { 
        // console.log(this.props);
        const {classes} = this.props;        
        const selectors = this.getSettings().map((e,i) =>
        {
            return this.getSelect( e, i )
        }) 
        const center = [
            this.props.data.common.latitude   ? this.props.data.common.latitude : 50,
            this.props.data.common.longitude  ? this.props.data.common.longitude : 10
        ]
        const { zoom } = this.props.data.common;
        return <div className={ classes.tabPanel }>
            <Grid container spacing={6}>
                <Grid item lg={6} md={12}> 
                    <Grid container spacing={3}>
                        {selectors}
                    </Grid>
                </Grid>
                <Grid item lg={6} md={12} style={{width:"100%"}}>
                    <LeafletMap
                        center={center}
                        zoom={ zoom }
                        maxZoom={18}
                        attributionControl={true}
                        zoomControl={true}
                        doubleClickZoom={true}
                        scrollWheelZoom={true}
                        dragging={true}
                        animate={true}
                        easeLinearity={0.35}
                        whenCreated={this.onMap} 
                    >
                        <TileLayer
                            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                        />
                        
                    </LeafletMap>
                </Grid>
                
            </Grid>
            <Grid container spacing={6}>
                <Grid item  md={3} sm={6} xs={12}>
                    {this.getCounters()}
                </Grid>
                <Grid item md={3} sm={6} xs={12}> 
                    <FormControl className={classes.formControl}>
                        <InputLabel shrink id={ "city-label"}>
                            { this.props.t("City:")}
                        </InputLabel>
                        <TextField
                            id="city"
                            label={ this.props.t("City:")}
                            value={ this.props.data.common.city }
                            InputLabelProps={{
                                readOnly: false,
                                shrink: true,
                            }}
                            onChange={evt => this.onChangeCity( evt ) }
                        />
                    </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}> 
                    <FormControl className={classes.formControl}>
                        <InputLabel shrink id={ "latitude-label"}>
                            { this.props.t("Latitude:")}
                        </InputLabel>
                        <TextField
                            id="latitude"
                            label= { this.props.t("Latitude:")}
                            value={ this.props.data.common.latitude }
                            InputLabelProps={{
                                readOnly: false,
                                shrink: true,
                            }}
                            onChange={evt => this.onChangeText(evt, "latitude") }
                        />
                    </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}> 
                    <FormControl className={classes.formControl}>
                        <InputLabel shrink id={ "longitude-label"}>
                            { this.props.t("Longitude:")}
                        </InputLabel>
                        <TextField
                            id="longitude" 
                            label={ this.props.t("Longitude:")}
                            value={ this.props.data.common.longitude }
                            InputLabelProps={{
                                readOnly: false,
                                shrink: true,
                            }}
                            onChange={evt => this.onChangeText(evt, "longitude") }
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </div>

    }
    onMap = map =>
    {
        this.map = map;
        //console.log(map);
        //console.log(window.L);
        const center = [
            this.props.data.common.latitude   ? this.props.data.common.latitude : 50,
            this.props.data.common.longitude  ? this.props.data.common.longitude : 10
        ]
        var marker = window.L.marker(
            center, 
            {
                draggable:true,
                title:"Resource location",
                alt:"Resource Location",
                riseOnHover:true
           }
        )
            .addTo(map)
                .bindPopup(" Popup for any custom information.")
                    .on({
                         dragend: evt => this.onMarkerDragend(evt)
                    });
        this.marker = marker;                
        map.on({  click: evt => console.log(evt.latlng.lat)  }); 
    }
    getSelect( e, i )
    {
        const {classes} = this.props;
        const value = this.props.data.common[this.getSettings()[i].id];
        //console.log( this.getSettings()[i].id, value );
        const items = this.getSettings()[i].values.map((elem, index)=>
        {
             return <MenuItem value={elem.id} key={index}>
                 { this.props.t(elem.title) }
             </MenuItem>   
        } )
        return  <Grid item sm={6} xs={12} key={i} >
             <FormControl className={classes.formControl}>
                <InputLabel shrink id={e.id + "-label"}>
                    { this.props.t(this.getSettings()[i].title)}
                </InputLabel>
                <Select
                    className={classes.formControl}
                    id={e.id}
                    value={ value }
                    onChange={ evt => this.handleChange(evt, i) }
                    displayEmpty 
                    inputProps={{ 'aria-label': 'Without label' }}
                > 
                    {items}
                </Select> 
            </FormControl> 
        </Grid >

    }
    getCounters = () =>
    {
        const {classes} = this.props;
        const items = countries.map((elem, index) =>
        {
            return <MenuItem value={elem.name} key={index}>
                { this.props.t(elem.name)  }
            </MenuItem> 
        })
        return <FormControl className={classes.formControl}>
            <InputLabel shrink id={"country-label"}>
                { this.props.t("Country:")}
            </InputLabel>
            <Select
                className={classes.formControl}
                id={"country"}
                value={ this.props.data.common.country }
                onChange={ this.handleChangeCountry }
                displayEmpty 
                inputProps={{ 'aria-label': 'Without label' }}
            > 
                {items}
            </Select> 
        </FormControl> 
    }
    handleChangeCountry = evt  =>
    {
        const value = evt.target.value; 
        const id = "country";
        this.doChange( id, value);
    }

    onChangeText = (evt, id) => {
        const value = evt.target.value; 
        this.onChangeInput(value, id);     
    }
    onChangeInput = (value, id) =>
    {
        this.doChange( id, value);
    }

    onChangeCity = (evt) => { 
        this.onChangeText(evt, "city");
        // console.log (evt.target.value );
        const provider = new OpenStreetMapProvider();
        provider.search({ query: evt.target.value })
            .then( results => {
                // console.log (results[0] );
                if( results[0] )
                {
                    setTimeout( () => {
                        this.onChangeInput(results[0].y, "latitude");
                        this.onChangeInput(results[0].x, "longitude"); 
                        this.onChangeInput(23, "zoom"); 
                        this.map.flyTo(
                            [results[0].y, results[0].x] 
                        );
                        this. marker.setLatLng([results[0].y, results[0].x]);
                    }, 1200);
                    
                }
                
            });       
    }

    handleChange = (evt, selectId) => {
        const value = evt.target.value; 
        const id = this.getSettings()[selectId].id;
        this.doChange( id, value);
    }

    doChange = (name, value) => {
        let newData = JSON.parse(JSON.stringify(this.props.data))
        newData.common[name] = value;
        this.props.onChange(newData);
    }

    onMarkerDragend = evt => {
        const ll = evt.target._latlng;
        //console.log(ll)
        this.doChange( "latitude",  ll.lat);
        this.doChange( "longitude", ll.lng);

    }
}


export default withWidth()
(
    withStyles(styles)(
        MainSettingsDialog
    )
);
