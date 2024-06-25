import React, { useState, useEffect, useRef } from 'react';
import SettingsContext from 'src/settings';
import NextLink from 'next/link';
import { Dialog, Box, Switch, Tooltip, DialogTitle, SvgIcon, DialogContent, Typography, Button, Grid, Item, Paper, List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import UserIcon from '@heroicons/react/24/solid/UserCircleIcon';
import Globe from '@heroicons/react/24/solid/GlobeEuropeAfricaIcon';
import Battery from '@heroicons/react/24/solid/Battery100Icon';
import { func } from 'prop-types';
import axios from "axios";
import $ from 'jquery';
import { Svg } from "react-svg";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt } from '@fortawesome/free-solid-svg-icons';
import countryData from './countrydata.json';


export default function Popup(props) {


    const { customer, title, children, openPopup, setOpenPopup, onClose} = props;
    const [data, setData] = useState([]);
    const countRef = useRef(0);
    
    const buttoncolor = 'primary.main'

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

      const Logininfo = ({ data }) => {
        return (
            <Box display="flex" flexDirection="column">
            {Object.entries(data).map(([key, value], index) => (
                <Box
                bgcolor={buttoncolor}
                mt={2}
                color="primary.contrastText"
                p={2}
                borderRadius={1}
                marginRight={2}
                alignItems="center"
                display="flex"
                height={45}
                key={index}
                sx={{ p: 1 }}
                >
                    <div>{key}: {value}</div> 
                </Box>
            ))}
            </Box>
        );
      };

      var logins = customer.logs
    
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
                        <Typography ml={0.5}>{customer.idbot}</Typography>
                        
                    </Box>
                    <Button
                        onClick={()=>{setOpenPopup(false)}}>
                        <FontAwesomeIcon icon={faXmarkSquare} size="2x" color={buttoncolor}/>
                    </Button>
                    </div>

                    <Logininfo data={logins} />

            </DialogContent>
        </Dialog>
    )
}
