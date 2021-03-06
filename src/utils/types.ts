export type UUID = string

export type Role = 'user' | 'admin' | 'pro'

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type Header = {
    Authorization?: string,
    jwtToken?: string,
    "Content-Type"?: string,
}

export type User = {
    id : UUID,
    firstname: string,
    lastname: string,
    created_at: Date,
    Email: string,
    Role: Role
}

export type ErrorAPI = {
    err?: string,
    error_code?: string,
    message?: string,
    name?: string,
}

export type SuccessResult = {
    success?: boolean,
}

export type ResetPasswordProps = {
    email: string
    password: string
    confirm_password: string
    code: string
}

export type ResultSendCodeConfirmation = {
    success: boolean,
    exist: boolean,
}

export type ResultJwt = {
    access_token: string
    refresh_token: string
    success: boolean,
}

export type SignUpParams = {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    confirm_password: string,
    birthday?: string,
    phone?: string
}

export type EnumProps = {
    display: string
    value: string
}

export type Column = {
    id: string,
    numeric: boolean,
    disablePadding: boolean,
    label: string
  }

export type TypeFile = "text" | "password" | "file" | "number" | "password" | "phone" | "date" | "email"