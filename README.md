# Auth Server Management Backend

Coding assessment-2 for Nerdevs recruitment process.
## Run Locally

Clone the project

```bash
  git clone https://github.com/MDAmir159/Auth-Server-Management-Backend.git
```

Go to the project directory

```bash
  cd Task2
```

Install dependencies

```bash
  npm install
```


Add `.env` file to root server directory. An example .env file is available named as `.env.example` for understanding. However, you can use it according to your own sysem.
```
PORT=<port-number>
DB_HOST=<host-name>
DB_NAME=<db-name>
MONGO_PORT=<mongodb-dbname>
JWT_SECRET=<jwt-secret>
```

Start the server
In developement mode
```bash
  npm run dev
```

To transpile and get the production build,
```bash
npm run build
```

This will automatically create a `dist` folder in the root directory. Opening this, you can see the project with the same structure of the original ts project, with the optmized and transpiled js files.

To run project in production mode.
```bash
npm run start
```

Your project will run on http://localhost:{port-name}.
## API Reference
### User Authentication
#### User Login
```http
  POST /auth/login
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required** |
| `password` | `string` | **Required** |

Upon successful registration a ticket, the returned HTTP Status code 200(OK)
```
{
    message: "Login successful!"
}
```
For unknown email yet not registered to the system will leave this response with 404(NOT FOUND)
```
{
    message: "User not found"
}
```
For invalid credentials will leave this response with 400(BAD REQUEST)
```
{
    message: "Invalid credentials"
}
```
For case that, user created account but didn't activated, will leave response with 400 (BAD REQUEST)
```
{
    message: "User account not activated"
}
```

In case of any other issues with 500 status (INTERNAL SERVER ERROR).
```
{
    message: "Error during login",
}
```


#### User Activation
```http
  GET /auth/activate/:token
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required** |

Upon successful activation , the returned HTTP Status code 200(OK)
```
{
    message: "Account activated successfully! You can now log in."
}
```
For unknown email yet not registered to the system will leave this response with 404(NOT FOUND)
```
{
    message: "User not found"
}
```
If the user already been activated, yet tried with the same token will leave 400(BAD REQUEST) response.
```
{
    message: "Account already activated"
}
```

In case of any other issues with 500 status (INTERNAL SERVER ERROR).
```
{
    message: "Invalid or expired activation link"
}
```

#### User Signup
```http
  POST /auth/signup
```
Request body payload
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required** |
| `firstName` | `string` | **Required** |
| `lastName` | `string` | **Required** |
| `mobileNumber` | `string` | **Required** |
| `password` | `string` | **Required** |

Upon successful signup , the returned HTTP Status code 200(OK) and an url to make a request to activate account.
```
{
    message: 'Signup successful! Copy the link below to activate your account:',
    activationLink: <activation-url>,
}
```
If the `email` already registered by any other account, the system will leave this response with 400(BAD REQUEST)
```
{
    message: "Email already exists"
}
```
If the  `mobileNumber` already registered by any other account, the system will leave this response with 400(BAD REQUEST)
```
{
    message: "Mobile number already exists"
}
```

In case of any other issues with 500 status (INTERNAL SERVER ERROR).
```
{
    message: "Server error"
}
```

## Tech Stack

**Server:** Node, Express, MongoDB
