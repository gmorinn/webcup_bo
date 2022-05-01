import { useEffect, useState } from 'react';
import { Box, TableCell } from '@mui/material';
import { useApi } from '../../hooks/useApi';
import DashboardTable from '../dashboard/DashboardTable';
import useUpdateEffect from '../../hooks/useUpdateEffect'
import DashboardContent from '../dashboard/DashboardContent';
import { Column } from '../../utils/types';

const headCells:Column[] = [
  {
    id: 'email',
    numeric: false,
    disablePadding: true,
    label: "Email",
  },
  {
    id: 'message',
    numeric: false,
    disablePadding: true,
    label: 'Message',
  },
];

export type DisplayContact = {
  id: string,
  email: string,
  message: string,
}

const Contacts = () => {
  const [data, setData] = useState<DisplayContact[] | null>(null)
  const [total, setTotal] = useState(0);
  const { Fetch } = useApi()
  const [selected, setSelected] = useState<string[]>([] as string[]);

  //// PAGINATION ////
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  ////////////////////

  const deleteItems = () => {
      Fetch("/v1/bo/contacts/remove", "PATCH", {tab: selected}, true)
        .then(res => res?.success && setSelected([]))
        .then(() => listItem())
    }

    const listItem = () => {
      Fetch(`/v1/bo/contacts/messages/${page*rowsPerPage}/${rowsPerPage}?field=email&direction=${order}`)
      .then(res => {
        if (res?.success && res.success && res?.contacts?.length > 0) {
          setData(res.contacts)
          setTotal(res.count)
        }
      })
    }

    useUpdateEffect(() => {
      listItem()
    }, [rowsPerPage, page, order])

    useEffect(() => {
      listItem()
      return () => setData(null)
      // eslint-disable-next-line
    }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <DashboardTable
        name="Contacts"
        add="/contacts/add"
        deleteItems={deleteItems}
        order={order}
        total={total}
        orderBy={"email"}
        setOrderBy={() => {}}
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
        {data && data?.length > 0 && data?.map((row:DisplayContact, index:number) => {
            return (
              <DashboardContent
                selected={selected}
                setSelected={setSelected} 
                row={row}
                key={row.id}
                isItemSelected={selected.indexOf(row?.id) !== -1}
                labelId={`checkbox-${index}`}
                edit={`/contacts/edit/${row.id}`}
              >
                      <TableCell
                        component="th"
                        id={`checkbox-${index}`}
                        scope="row"
                        padding="none"
                      >
                        {row.email}
                      </TableCell>
                      <TableCell align="right">{row.message}</TableCell>
            </DashboardContent>
            );
        })}
      </DashboardTable>
    </Box>
  );
}

export default Contacts