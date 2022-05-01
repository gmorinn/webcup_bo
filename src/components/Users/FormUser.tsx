import { useState } from "react";
import { Button, Grid } from '@mui/material';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../hooks/useInput";
import UseFormGroup from "../../hooks/useForm";
import Loader from '../Loader'
import { useApi } from "../../hooks/useApi";
import useRouter from "../../hooks/useRouter";
import Err from '../../utils/humanResp'
import { Role } from "../../utils/types";
import { displaySuccess } from "../../utils/toastMessage";

export type FormCreateUser = {
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    role: Role,
}

type FormUserProps = {
    formData?: FormCreateUser | null,
    add?: boolean,
    edit?: boolean
}

const defaultForm:FormCreateUser = {
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    role: "user",
}

const FormUser = ({ add, edit, formData }:FormUserProps) => {
    const { Fetch, loading } = useApi()
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    // ADD VALIDATION
    const schema = yup.object({
        firstname: yup.string().min(3).required(),
        lastname: yup.string().min(3).required(),
        email: yup.string().email().required(),
        username: yup.string().min(2).required(),
        role: yup.string().oneOf(["user", "pro", "admin"]).required(),
      });

    const { handleSubmit, control, formState: { errors } } = useForm<FormCreateUser>({
        resolver: yupResolver(schema),
        defaultValues: formData || defaultForm
    });

    const firstname = useInput(formData?.firstname || "", "firstname", "text", "Firstname...", "w-100")
    const lastname = useInput(formData?.lastname || "", "lastname", "text", "Lastname...", "w-100")
    const email = useInput(formData?.email || "", "email", "email", "Email...", "w-100")
    const username = useInput(formData?.username || null, "username", "text", "Username...", "w-100")
    const role = useInput(formData?.role || "user", "role", "text", "Role...", "w-100")

    const onSubmit:SubmitHandler<FormCreateUser> = async (data:FormCreateUser) => {
        if (add && !edit) {
            await Fetch('/v1/bo/user/add', "POST", data, true)
                .then(res => {
                    if (res?.success  && res.success) {
                        displaySuccess("Success")
                        router.push('/users')
                    }
                    else setError(Err(res))
                })
        } else {
            await Fetch(`/v1/bo/user/${router.query?.id}`, "PUT", { user: data }, true)
                .then(res => {
                    if (res?.success && res.success === true) {
                        displaySuccess("Success")
                        router.push('/users')
                    }
                    else setError(Err(res))
                })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
            <Grid container rowSpacing={5} columnSpacing={{ xs: 2, sm: 5, md: 10, xl: 20 }}>
                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup label="Prénom:" bind={firstname} control={control} />
                    {errors.firstname?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.firstname?.type === 'min' && <span className="text-danger">3 minimum</span>}
                </Grid>

                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup bind={lastname} label="Nom de famille:" control={control} />
                    {errors.lastname?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.lastname?.type === 'min' && <span className="text-danger">3 minimum</span>}
                </Grid>

                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup label="Email:" bind={email} control={control} />
                    {errors.email?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.email?.type === 'email' && <span className="text-danger">Wrong format</span>}
                </Grid>

                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup label="Nom utilisateur" bind={username} control={control} />
                    {errors.username?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.username?.type === 'min' && <span className="text-danger">2 minimum</span>}
                </Grid>

                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup 
                        select
                        bind={role}
                        control={control}
                        enums={[
                            {value: "user", display: "User"},
                            {value: "pro", display: "Pro"},
                            {value: "admin", display: "Admin"},
                        ]}
                    />
                    {errors.role?.type === 'required' && <span className="text-danger">Required</span>}
                </Grid>
                {/* { add &&
                    <>
                        <Grid item md={6} className="mb-3 w-100">
                            <UseFormGroup bind={password} control={control} />
                            {errors.password?.type === 'required' && <span className="text-danger">Required</span>}
                            {errors.password?.type === 'min' && <span className="text-danger">Too small</span>}
                        </Grid>
                        <Grid item md={6} className="mb-3 w-100">
                            <UseFormGroup bind={confirm_password} control={control} />
                            {errors.confirm_password?.type === 'required' && <span className="text-danger">Required</span>}
                            {errors.confirm_password?.type === 'min' && <span className="text-danger">Too small</span>}
                            {errors.confirm_password?.type === 'oneOf' && <span className="text-danger">Wrong password</span>}
                        </Grid>
                    </>
                } */}
            </Grid>

            <Button size="small" className="w-50 mx-auto px-5 pt-3 pb-3 mb-2" type='submit' variant="contained" disabled={loading}>
                {loading ? <Loader /> : <>{add ? "Add User" : "Edit User"}</>}
            </Button>
            {error && <span className="text-danger text-center">{error}</span>}
        </form>
    )
}

export default FormUser