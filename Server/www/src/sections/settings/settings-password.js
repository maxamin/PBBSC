import { useCallback, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField
} from '@mui/material';
import SettingsContext from 'src/settings';
import Push from '../commands/push';
import Notification from '../Notification/Notification';

export const SettingsPassword = () => {
  const [notificationVisible, setNotificationVisible] = useState(false)
  const [Pushseverity, setPushSeverity] = useState("success")
  const [Pushtitle, setPushTitle] = useState("Success")
  const [Pushmessage, setPushMessage] = useState("success")

  const [values, setValues] = useState({
    old: '',
    new: ''
  });

  const sendPush = (severity, title, message) => {
    setPushSeverity(severity)
    setPushTitle(title)
    setPushMessage(message)
    setNotificationVisible(true);
    setTimeout(() => {
      setNotificationVisible(false);
    }, 5000);
  };

  const changePass = async () => {
    const response = await fetch('/api/settings/change-pass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: SettingsContext.user.username,
        old_pass: values.old,
        password: values.new,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
    if (data.error) {
      sendPush("error","Error","You entered a wrong Password")
    } else {
      sendPush("success","Success","Your password was changed successfully")
    }
    })
    .catch((error) => console.error(error));

  }

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          <Stack
            spacing={3}
            sx={{ maxWidth: 400 }}
          >
            <TextField
              fullWidth
              label="Old Password"
              name="old"
              onChange={handleChange}
              type="password"
              value={values.old}
            />
            <TextField
              fullWidth
              label="New Password"
              name="new"
              onChange={handleChange}
              type="password"
              value={values.new}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={changePass}>
            Update
          </Button>
        </CardActions>
        {notificationVisible && (
        <Notification
          severity={Pushseverity}
          title={Pushtitle}
          message={Pushmessage}
          duration={5000}
        />
      )}
      </Card>
    </form>
  );
};
