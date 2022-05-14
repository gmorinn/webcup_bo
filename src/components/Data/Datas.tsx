import React, { useEffect, useState } from 'react';
import { Box, TableCell } from '@mui/material';
import { useApi } from '../../hooks/useApi';
import DashboardTable from '../dashboard/DashboardTable';
import useUpdateEffect from '../../hooks/useUpdateEffect'
import DashboardContent from '../dashboard/DashboardContent';
import { Column, Role, UUID } from '../../utils/types';
import { useNavigate } from 'react-router-dom';

const headCells:Column[] = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: "Titre",
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: true,
    label: 'Description',
  },
  {
    id: 'user_id',
    numeric: true,
    disablePadding: false,
    label: "Id de l'utilisateur",
  },
  {
    id: 'img',
    numeric: true,
    disablePadding: false,
    label: "Lien de l'image",
  },
];

export type DisplayData = {
  id: string,
  title: string,
  description: string,
  image?: string
  user_id: UUID
}

export type UserField = "title" | "description" | "user_id"

const Datas = () => {
  const [data, setData] = useState<DisplayData[] | null>(null)
  const [total, setTotal] = useState(0);
  const { Fetch } = useApi()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string[]>([] as string[]);

  //// PAGINATION ////
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState<UserField>('title');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  ////////////////////

    const listItem = () => {
      Fetch(`/v1/bo/datas/${page*rowsPerPage}/${rowsPerPage}?field=${orderBy}&direction=${order}`)
      .then(res => {
        if (res?.success && res.success && res.data && res.data.length > 0) {
          setData(res.data)
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
        name="Datas"
        add="/datas/add"
        deleteItems={() => {}}
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
        {data && data?.length > 0 && data?.map((row:DisplayData, index:number) => {
            return (
              <DashboardContent
                noEdit
                selected={selected}
                setSelected={setSelected} 
                row={row}
                key={row.id}
                isItemSelected={selected.indexOf(row?.id) !== -1}
                labelId={`checkbox-${index}`}
                edit={`/datas/edit/${row.id}`}
              >
                      <TableCell
                        component="th"
                        id={`checkbox-${index}`}
                        scope="row"
                        padding="none"
                      >
                        {row.title}
                      </TableCell>
                      <TableCell align="right">{row.description}</TableCell>
                      <TableCell align="right" onClick={() => navigate("/users/edit/"+row.user_id)}>Voir l'utilisateur</TableCell>
                      <TableCell align="right" onClick={() => {row.image && row.image !== "" && window.open(process.env.REACT_APP_API_URL + row.image)}}>Voir l'image</TableCell>
                      </DashboardContent>
            );
        })}
      </DashboardTable>
    </Box>
  );
}

export default Datas