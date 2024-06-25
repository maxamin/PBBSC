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
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt, faRectangleList, faArrowsRotate, faTrashCan, faPaperPlane, faLink, faTowerCell, faUnlock, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { borderRadius } from '@mui/system';

import TextField from '@mui/material/TextField';

import Notification from '../Notification/Notification';


export default function Help(props) {

    const { openPopup, setOpenPopup, idbot} = props;
    const [data, setdata] = useState('');


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
                          <FontAwesomeIcon icon={faQuestion}/>
                        </SvgIcon>
                        <Typography ml={1} variant='h6' color="primary.contrastText" >Help</Typography>
                        
                    </Box>

                    <Button
                        onClick={()=>{setOpenPopup(false)}}>
                        <FontAwesomeIcon icon={faXmarkSquare} size="2x"/>
                    </Button>
                    </div>
                    <Typography mt={3} variant="h5" component="div">
                      Left Click
                    </Typography>
                    <Typography variant="body2">
                      Swipe
                    </Typography>
                    <Typography mt={2} variant="h5" component="div">
                      Right Click
                    </Typography>
                    <Typography variant="body2">
                      Click
                    </Typography>
                    <Typography mt={2} variant="h5" component="div">
                      Double Click
                    </Typography>
                    <Typography variant="body2">
                      Select
                    </Typography>
                    
                  
            </DialogContent>
        </Dialog>
    )
}
