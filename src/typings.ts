interface user {
    status?: string;
    firstname?: string;
    lastname?: string;
    emailAddress?: string;
    phone?: string;
    address?: string;
    zipcode?: string;
    password?: string ;
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
    currentPassword?: string
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
    status: string;
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
    _id?: string;
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
    fullname: string;
    binAddress: string;
    city: string;
    zipCode: string;
    state: string;
    cardNum: string;
    expMonth: string;
    expYear: string;
    cvc: string;
    price: string;
}

interface trip {
    id?: string;
    _index?: number;
    driverConfirm: Boolean;
    userConfirm: Boolean;
    date: Date;
}

interface orderCollection {
    history: trip[];
    confirm: trip[];
    future: trip[];
  }

interface driverOrder{
  orderId: string,
  address: string,
  trip: {
    driverConfirm: boolean,
    userConfirm: boolean,
    date: string,
    _id: string
  },
  tripIndex: number
}