export const config = {
    user: 'sa',
    password: 'mySuperStrongP@ssword',
    server: process.env.HOSTNAME || 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'AGC_QUALITY',
    "options": {
        "encrypt": true,
        "enableArithAbort": true
    }
}
