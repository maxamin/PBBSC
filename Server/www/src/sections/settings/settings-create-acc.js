import { useCallback, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';

export const SettingsCreateUser = () => {
  const [values, setValues] = useState({
    username: '',
    password: '',
    role: '',
    tag: ''
  });

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const createUser = async () => {
    const response = await fetch('/api/settings/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
        role: values.role,
        tag: values.tag,
      }),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
      window.location.reload();
}

  const handleSubmit = () => {
    console.log(values)
    createUser()
    
  }

  const handleRole = () => {
    if (event.target.textContent === "User") {
      values.role = "user"
    } else if (event.target.textContent === "Co-Admin") {
        values.role = "coadmin"
      }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          title="Create User"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={6}>
          <Stack
            spacing={3}
            sx={{ maxWidth: 400 }}
          >
            <TextField
              fullWidth
              label="Username"
              name="username"
              onChange={handleChange}
              type="username"
              value={values.username}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
            />
          </Stack>
          </Grid>
          <Grid item xs={6}>
          <Stack
            spacing={3}
            sx={{ maxWidth: 400 }}
          >
            <Select
            onChange={(event) => handleRole()}
          >
            <MenuItem value={20}>Co-Admin</MenuItem>
            <MenuItem value={30}>User</MenuItem>
          </Select>
            <TextField
              fullWidth
              label="Tag"
              name="tag"
              onChange={handleChange}
              value={values.tag}
            />
          </Stack>
          </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained"
          onClick={handleSubmit}
          >
            Create
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
