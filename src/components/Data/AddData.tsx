import { lazy } from "react";
import { Button, Card, CardContent, Box } from "@mui/material";
import useRouter from "../../hooks/useRouter";

// const FormData = lazy(() => import('./FormData'))

const AddData = () => {
    const router = useRouter()

    return (
		<Card className="">
			<Box className="d-flex justify-content-between p-3">
				<h5>New Data</h5>
				<Button className="mx-2" variant="contained" onClick={() => router.navigate('/datas')}>
					Go back
				</Button>
			</Box>
			<CardContent>
				{/* <FormData add /> */}
			</CardContent>
		</Card>
    )
}

export default AddData