import React, { useEffect, useState } from 'react';
import { Box, TableCell } from '@mui/material';
import { useApi } from '../../hooks/useApi';
import DashboardTable from '../dashboard/DashboardTable';
import useUpdateEffect from '../../hooks/useUpdateEffect'
import DashboardContent from '../dashboard/DashboardContent';
import { Column, Role } from '../../utils/types';

const headCells:Column[] = [
  {
    id: 'username',
    numeric: false,
    disablePadding: true,
    label: "Nom d'utilisateur",
  },
  {
    id: 'firstname',
    numeric: false,
    disablePadding: true,
    label: 'Prénom',
  },
  {
    id: 'lastname',
    numeric: true,
    disablePadding: false,
    label: 'Nom de famille',
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'role',
    numeric: true,
    disablePadding: false,
    label: 'Rôle',
  },
];

export type DisplayUser = {
  id: string,
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  role: Role
}

export type UserField = "firstname" | "lastname" | "email" | "role"

const Users = () => {
  const [data, setData] = useState<DisplayUser[] | null>(null)
  const [total, setTotal] = useState(0);
  const { Fetch } = useApi()
  const [selected, setSelected] = useState<string[]>([] as string[]);

  //// PAGINATION ////
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState<UserField>('firstname');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  ////////////////////

  const deleteItems = () => {
      Fetch("/v1/bo/users/remove", "PATCH", {tab: selected}, true)
        .then(res => res?.success && setSelected([]))
        .then(() => listItem())
    }

    const listItem = () => {
      Fetch(`/v1/bo/users/${page*rowsPerPage}/${rowsPerPage}?field=${orderBy}&direction=${order}`)
      .then(res => {
        if (res?.success && res.success && res.users && res.users.length > 0) {
          setData(res.users)
          setTotal(res.count)
        }
      })
    }

    useUpdateEffect(() => {
      listItem()
    }, [rowsPerPage, page, order, orderBy])

    useEffect(() => {
      listItem()
      return () => setData(null)
      // eslint-disable-next-line
    }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <DashboardTable
        name="Users"
        add="/users/add"
        deleteItems={deleteItems}
        order={order}
        total={total}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        page={page}
        setPage={setPage}
        setOrder={setOrder}
        selected={selected}
        setSelected={setSelected}
        data={data}
        headCells={headCells}
      >
        {data && data?.length > 0 && data?.map((row:DisplayUser, index:number) => {
            return (
              <DashboardContent
                selected={selected}
                setSelected={setSelected} 
                row={row}
                key={row.id}
                isItemSelected={selected.indexOf(row?.id) !== -1}
                labelId={`checkbox-${index}`}
                edit={`/users/edit/${row.id}`}
              >
                      <TableCell
                        component="th"
                        id={`checkbox-${index}`}
                        scope="row"
                        padding="none"
                      >
                        {row.username}
                      </TableCell>
                      <TableCell align="right">{row.firstname}</TableCell>
                      <TableCell align="right">{row.lastname}</TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.role}</TableCell>
                      </DashboardContent>
            );
        })}
      </DashboardTable>
    </Box>
  );
}

export default Users