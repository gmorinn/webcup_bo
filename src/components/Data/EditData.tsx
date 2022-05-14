import { useEffect, useState } from "react";
import { Button, Card, CardContent, Box } from "@mui/material";
import useRouter from "../../hooks/useRouter";
import { useApi } from "../../hooks/useApi";
import { useParams } from "react-router";
import { UUID } from "../../utils/types";

export type DisplayData = {
	id: string,
	title: string,
	description: string,
	image?: string
	user_id: UUID
  }

const EditUser = () => {
    const router = useRouter()
	let { id } = useParams<{id: string}>();
    const [data, setData] = useState<DisplayData | null>(null)
    const { Fetch } = useApi()

    useEffect(() => {
		!data && Fetch(`/v1/bo/user/${id}`, "GET").then(res => res?.success && setData(res?.user))
		return () => setData(null)
		// eslint-disable-next-line
	}, [])
	
    return (
        <>
            <Card className="mb-5">
                <Box className="d-flex justify-content-between p-4">
					<h5>Edit Data</h5>
					<Button className="mx-2" variant="contained" onClick={() => router.navigate('/datas')}>
						Go back
					</Button>
				</Box>
				<CardContent>
					{/* {data && <FormData edit formData={data} />} */}
				</CardContent>
			</Card>
        </>
    )
}

export default EditUser