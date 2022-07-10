interface user {
    firstname?: string | undefined;
    lastname?: string | undefined;
    emailAddress?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    zipcode?: string | undefined;
    password?: string | undefined;
}

interface UserReg {
    firstname: string
    lastname: string
    emailAddress: string
    phone: string
    address: string
    zipcode: string
    password: string
    confirmPassword: string
}

interface DriverReg{
    firstname: string
    lastname: string
    emailAddress: string
    phone: string
    address: string
    zipcode: string
    licenseNumber: string
    password: string
    confirmPassword: string
}

interface AdminReg{
    companyName: string
    emailAddress: string
    password: string
    confirmPassword: string
}

interface authUser {
    firstname: string;
    lastname: string;
    emailAddress: string;
    phone: string;
    address: string;
    zipcode: string;
    time?: number;
}

interface adminPayload{
    companyName: string;
    emailAddress: string;
    password: string;
    role: string;
}

interface driverPayload{
    firstname: string;
    lastname: string;
    emailAddress: string;
    phone: string;
    address: string;
    zipcode: string;
    licenseNumber: string;
    password: string;
    role: string;
}

interface userPayload{
    firstname: string;
    lastname: string;
    emailAddress: string;
    phone: string;
    address: string;
    zipcode: string;
    password: string;
    role: string;
}

interface Login {
    emailAddress: string
    password: string
  }

interface order {
    user: {
        fullName: string,
        email: string
    },
    addressOfBin: string,
    zipCode: string,
    trips: {
        driverConfirm: boolean,
        userConfirm: boolean,
        date: Date
    }[]
}

interface orderInput {
    fullname: string,
    binAddress: string,
    city: string,
    zipCode: string,
    state: string,
    cardNum: string,
    expMonth: string,
    expYear: string,
    cvc: string,
    price: string
}