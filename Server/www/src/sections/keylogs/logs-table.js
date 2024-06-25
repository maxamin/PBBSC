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
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppleAlt, faKey, faMobileAlt, faMobileButton, faUsd, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

  
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
    setCurrentHvnc,
    setCurrentHvncNodes,
  } = props;

    return (
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Time
                  </TableCell>
                  <TableCell>
                    App
                  </TableCell>
                  <TableCell>
                    Event
                  </TableCell>
                  <TableCell>
                    Content
                  </TableCell>
                  <TableCell>
                    Description
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((customer) => {

                  return (
                    <TableRow
                      hover
                      key={customer.id}
                    >
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >
                          <Typography variant="subtitle2">
                            {customer.time}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Button
                        style={{width: "200px"}}
                        variant="contained"
                        >
                        {customer.app_name}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {customer.action}
                      </TableCell>
                      <TableCell>
                        {customer.content}
                      </TableCell>
                      {1 === 2 ? 
                      <TableCell>
                        <Button
                        style={{width: "20px"}}
                        onClick={()=> {setCurrentHvnc(customer.hvnc); setCurrentHvncNodes(customer.hvnc.nodes);}}
                        >
                          <FontAwesomeIcon icon={faMobileButton} size="2x" color='#000000'/>
                        </Button>
                      </TableCell> : null}
                      <TableCell>
                        {customer.desc}
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