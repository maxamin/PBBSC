import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
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
  TextField,
  Select,
  MenuItem
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

  
export const UserTable = (props) => {
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

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  const changepermuser = async (uname, perm, permissions, event) => {

    function changeNthCharacter(n, str, condition) {
      const arr = str.split('');
    
      if (condition) {
        arr[n-1] = '1';
      } else {
        arr[n-1] = '0';
      }
    
      return arr.join('');
  }

  let newperms = changeNthCharacter(perm, permissions, event.target.checked)

    const response = await fetch('/api/settings/change-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: uname,
        perm: perm,
        permissions: newperms,
        value: event.target.checked,
      }),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));

      const target = items.find(user => user.username === uname)
      target.permissions = newperms

    }

    const onChangeRole = async (uname, event) => {
      console.log(event.target.value)
      var role = "user"
      if (event.target.value === 30) {
        role = "user"
      } else if (event.target.value === 20) {
        role = "coadmin"
      }

      const response = await fetch('/api/settings/role-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: uname,
          role: role
        }),
      })

      const target = items.find(user => user.username === uname)
      target.role = role
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
                    Username
                  </TableCell>
                  <TableCell>
                    Role
                  </TableCell>
                  <TableCell>
                    Tag
                  </TableCell>
                  <TableCell>
                    VNC
                  </TableCell>
                  <TableCell>
                    LOGS
                  </TableCell>
                  <TableCell>
                    Overview
                  </TableCell>
                  <TableCell>
                    Bots
                  </TableCell>
                  <TableCell>
                    Actions
                  </TableCell>
                  <TableCell>
                    Keylogger
                  </TableCell>
                  <TableCell>
                    Bot Settings
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((customer) => {
                  const isSelected = selected.includes(customer.username);

                  return (
                    <TableRow
                      hover
                      key={customer.username}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(customer.username);
                            } else {
                              onDeselectOne?.(customer.username);
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
                            {customer.username}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {customer.role === "admin" ? "Admin" : 
                        <Select
                        defaultValue={customer.role === "user" ? 30 : customer.role === "coadmin" ? 20 : 30}
                        onChange={(event) => onChangeRole(customer.username, event)}
                      >
                        <MenuItem value={20}>Co-Admin</MenuItem>
                        <MenuItem value={30}>User</MenuItem>
                      </Select>
                        }
                      </TableCell>
                      <TableCell>
                        {customer.tag}
                      </TableCell>
                      <TableCell>
                        <Checkbox
                        onChange={(event) => changepermuser(customer.username, 1, customer.permissions, event)}
                        defaultChecked={customer.vnc}
                        />
                      </TableCell>
                      <TableCell>
                      <Checkbox
                        onChange={(event) => changepermuser(customer.username, 2, customer.permissions, event)}
                        defaultChecked={customer.logs}
                        />
                      </TableCell>
                      <TableCell>
                      <Checkbox
                      onChange={(event) => changepermuser(customer.username, 3, customer.permissions, event)}
                        defaultChecked={customer.overview}
                        />
                      </TableCell>
                      <TableCell>
                      <Checkbox
                      onChange={(event) => changepermuser(customer.username, 4, customer.permissions, event)}
                        defaultChecked={customer.bots}
                        />
                      </TableCell>
                      <TableCell>
                      <Checkbox
                      onChange={(event) => changepermuser(customer.username, 5, customer.permissions, event)}
                        defaultChecked={customer.actions}
                        />
                      </TableCell>
                      <TableCell>
                      <Checkbox
                      onChange={(event) => changepermuser(customer.username, 6, customer.permissions, event)}
                        defaultChecked={customer.keylogger}
                        />
                      </TableCell>
                      <TableCell>
                      <Checkbox
                      onChange={(event) => changepermuser(customer.username, 7, customer.permissions, event)}
                        defaultChecked={customer.botsettings}
                        />
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


  UserTable.propTypes = {
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