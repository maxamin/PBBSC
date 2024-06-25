import PropTypes from 'prop-types';
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  Tooltip,
  Typography
} from '@mui/material';
import SettingsContext from '../../settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

export const OverviewTasksProgress = (props) => {
  const { sx } = props;
  var now = new Date()

  const today = new Date();

  const difference = SettingsContext.LicenseEnd.getTime() - today.getTime();
  const daysUntil = Math.ceil(difference / (1000 * 3600 * 24));

  const monthsUntil = SettingsContext.LicenseEnd.getMonth() - today.getMonth() + (12 * (SettingsContext.LicenseEnd.getFullYear() - today.getFullYear()));

  const hoursUntil = Math.ceil(difference / (1000 * 3600));

  const weeksUntil = Math.ceil(daysUntil / 7);

  let timeUnit = '';
  let timeValue = 0;

  if (daysUntil <= 7) {
    timeUnit = 'day';
    timeValue = daysUntil;
    if (timeValue > 1){
      timeUnit = timeUnit + 's'
    }
  } else if (weeksUntil <= 4) {
    timeUnit = 'week';
    timeValue = weeksUntil;
    if (timeValue > 1){
      timeUnit = timeUnit + 's'
    }
  } else if (monthsUntil <= 12) {
    timeUnit = 'month';
    timeValue = monthsUntil;
    if (timeValue > 1){
      timeUnit = timeUnit + 's'
    }
  } else {
    timeUnit = 'year';
    timeValue = SettingsContext.LicenseEnd.getFullYear() - today.getFullYear();
    if (timeValue > 1){
      timeUnit = timeUnit + 's'
    }
  }

  var totalTime = SettingsContext.LicenseEnd.getTime() - SettingsContext.LicenseStart.getTime();
  var timeElapsed = now.getTime() - SettingsContext.LicenseStart.getTime();
  var percentage = ((timeElapsed / totalTime) * 100).toFixed(2)

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              gutterBottom
              variant="overline"
            >
              License
            </Typography>
            <Typography variant="h4">
              {timeValue} {timeUnit} Left
            </Typography>
          </Stack>
          <Tooltip title={"License End: " + SettingsContext.LicenseEnd.toLocaleDateString()}>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <FontAwesomeIcon icon={faCalendarDays}/>
            </SvgIcon>
          </Avatar>
          </Tooltip>
        </Stack>
        <Box sx={{ mt: 3 }}>
          <LinearProgress
            value={parseFloat(percentage)}
            variant="determinate"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

OverviewTasksProgress.propTypes = {
  sx: PropTypes.object
};
