# User related API's

## User Registration

### Endpoint for user registration : 

```
POST : https://nyaylok-server.onrender.com/auth/registerCase 
```

<br/>

**Paramaters are passed by the value** <br/>

```
{
    "empId": String ,
    "name": String,
    "email":valid email String,
    "password": String,
    "confirmPassword": String matching the password input
}
```
<br/>

_sample input :_


```
{
    "empId":"2021UG2015",
    "name":"Saquib",
    "email":"saquibali353@outlook.com",
    "password":"123",
    "confirmPassword":"123"
}
```

## User Log in

### URL for logging in

```
POST : https://nyaylok-server.onrender.com/auth/login 
```
<br/>
**Paramaters are passed by the value**<br/>

```
{
    "empId": String ,
    "password": String
}
```
<br/>


_example :_


```
{
    "empId":"2021UG2023",
    "password":"123"
}
```
after succesful logging in a **cookie** name *nyayToken* will be generated and some basic information will be displayed : <br/>

_example output:_

```
{
    "message": "Vaibhav you have been logged in",
    "details": {
        "_id": "650474e713f3c1c5842f9f7b",
        "empId": "2021UG2023",
        "name": "Vaibhav",
        "email": "vermavaibhav2005@gmail.com",
        "__v": 0
    }
}
```
> ~~this unique token when pasted in right way into the browser can be used by anyone to signin without logging in~~


# Case realted API's


## Register Case


### endpoint for registering case

```
POST : https://nyaylok-server.onrender.com/cases/registerCase
```

_input fields:_

```
{
    "victim": String,
    "fir": String,
    "policeStation": String,
    "pincode": Number,
    "phone":Number 10 digits only,
    "ipc": Array of Strings
    "prevCase": Number
}
```

_example input:_ 

```
{
    "victim": "Saquib",
    "fir": "36452",
    "policeStation": "Patna Thana",
    "pincode": 800002,
    "phone":*********,
    "ipc": ["295","381","195A"]
}
```

_example output:_

```
{
    "message": "Case filed successfully",
    "savedCase": {
        "victimName": "Saquib",
        "firNumber": "36452",
        "policeStationName": "Patna Thana",
        "areaPincode": 800002,
        "IPCsections": [
            "295",
            "381",
            "195A"
        ],
        "points": 62520,
        "phoneNumber": *********,
        "status": "Registered",
        "DOR": "2023-09-16T18:34:42.859Z",
        "caseId": 17092023002703122,
        "_id": "6505fa7f76d05b6868f3d7a0",
        "__v": 0
    }
}
```

## View all ongoing and registered cases

### URL to get pending cases :

```
GET : https://nyaylok-server.onrender.com/cases/IncompleteCases
```

_output example:_

```

{
    "message": "successfull found 2 cases",
    "cases": [
        {
            "_id": "65035c57fed7b46666698e4f",
            "victimName": "Vivek",
            "areaPincode": 480051,
            "IPCsections": [
                "295",
                "379"
            ],
            "points": 32,
            "status": "Ongoing",
            "DOR": "2023-09-14T19:16:49.369Z",
            "__v": 0
        },
        {
            "_id": "65035e04151db9bf0582fc10",
            "victimName": "Nishant",
            "areaPincode": 841226,
            "IPCsections": [
                "171F",
                "364A",
                "376D"
            ],
            "points": 296002,
            "status": "Registered",
            "DOR": "2023-09-14T19:21:10.027Z",
            "__v": 0
        }
    ]
}

```

## To view limited details of particular case by case id

### URL for this operation

```
GET : https://nyaylok-server.onrender.com/cases/findCaseById/<enter case id here>
```

_example:_ 
https://nyaylok-server.onrender.com/cases/findCaseById/15092023130528300


_output example:_

```
{
    "message": "Found your case",
    "casePosition": 11,
    "victim": "Saquib",
    "dor": "15-09-2023",
    "status": "Registered"
}

```

## Paginated output of ongoing and pending cases ( _Incomplete Cases_ )

### endpoint for this operation

```
GET : https://nyaylok-server.onrender.com/cases/IncompleteCasesPaginated/?page=<enter the page number you want to see here>&pageLimit=<enter the number of elements you want to see in a single page here>
```

_sample endpoint:_

https://nyaylok-server.onrender.com/cases/IncompleteCasesPaginated/?page=2&pageLimit=3 <br/>

The above endpoint will display contents of ***page number : 2***  and on each page there would be a ***limit of 3 cases per page*** <br/>

_sample output:_

```
{
    "message": "here are your paginated cases",
    "paginatedCases": [
        {
            "_id": "65045100e3f279dafa2189b1",
            "victimName": "Nishant",
            "firNumber": "51352",
            "policeStationName": "Siwan Thana",
            "areaPincode": 841286,
            "IPCsections": [
                "171G",
                "381",
                "195A"
            ],
            "points": 98502,
            "phoneNumber": 7654531965,
            "status": "Registered",
            "DOR": "2023-09-15T12:41:32.422Z",
            "caseId": 15092023181136588,
            "__v": 0
        },
        {
            "_id": "6504512e06dacc69f6b9c53b",
            "victimName": "Vivek",
            "firNumber": "51352",
            "policeStationName": "Jamshedpur Thana",
            "areaPincode": 841286,
            "IPCsections": [
                "171G",
                "381",
                "195A"
            ],
            "points": 98502,
            "phoneNumber": 7654531965,
            "status": "Registered",
            "DOR": "2023-09-15T12:42:21.163Z",
            "caseId": 15092023181222292,
            "__v": 0
        },
        {
            "_id": "65040940ca32c277b1b44844",
            "victimName": "Saquib",
            "firNumber": "21562",
            "policeStationName": "Patna Thana",
            "areaPincode": 800002,
            "IPCsections": [
                "171G",
                "381",
                "195A"
            ],
            "points": 98502,
            "status": "Registered",
            "DOR": "2023-09-15T07:35:27.600Z",
            "caseId": 15092023130528300,
            "__v": 0
        }
    ]
}
```

**If no parameter is passed as PageCount the default value will be _7 elements per page_** and the endpoint would look like this: <br/>

https://nyaylok-server.onrender.com/cases/IncompleteCasesPaginated/?page=2 <br/>


## Get case counts of various types of cases (_on the basis of their status_)

### Endpoint for this method

```
GET : https://nyaylok-backend.vercel.app/cases/caseCounts
```

The ouput is this is Array of 3 JSON objects namely ***Registered Cases*** , ***Ongoing Cases*** and ***Completed Cases***<br/>

_Sample Output:_

{
    "response": [
        {
            "Registered Cases": 60
        },
        {
            "Ongoing Cases": 2
        },
        {
            "Completed Cases": 3
        }
    ]
}


## Update limited detials of a case using case id

### URL for this operation

```
PATCH : https://nyaylok-server.onrender.com/cases/updateCase/<enter case id here>
```

_example:_ 
https://nyaylok-server.onrender.com/cases/updateCase/15092023185735324

<br/>
**Allowed parameters for update are**<br/>

```
"victim" : String
"fir" : String
"ipc" : array of strings
"prevCaseId" : String
```
<br/>

_Input example:_

```
{
    "victim":"Karmyogi"
}
```

_Output for the following input will be :_

```
{
    "message": "case updated succefully",
    "updatedCase": {
        "_id": "65045bc74f082207cd062ab5",
        "victimName": "Karmyogi",
        "firNumber": "36452",
        "policeStationName": "Jaunpur Thana",
        "areaPincode": 800002,
        "IPCsections": [
            "295",
            "381",
            "195A"
        ],
        "points": 62520,
        "phoneNumber": 9651661199,
        "status": "Registered",
        "DOR": "2023-09-15T13:27:28.180Z",
        "caseId": 15092023185735324,
        "__v": 0
    }
}
```

## Upgrade a case's status to Ongoing

### Endpoint for this method

```
PATCH : https://nyaylok-backend.vercel.app/cases/upgradeToOngoing/<id of the case you want to upgrade status of>
```

**Example Endpoint:**<br/>
https://nyaylok-backend.vercel.app/cases/upgradeToOngoing/16092023140905868<br/>

This endpoint can only be triggered by ***authencticated users***.

_Sample Output:_
```
{
    "message": "Case number : 16092023140905868's status has been upgraded to Ongoing"
}
```

## Upgrade a case's status to Completed

### Endpoint for this method

```
PATCH : https://nyaylok-backend.vercel.app/cases/upgradeToCompleted/<id of the case you want to upgrade status of>
```

**Example Endpoint:**<br/>
https://nyaylok-backend.vercel.app/cases/upgradeToOngoing/15092023180435434<br/>

This endpoint can only be triggered by the ***judge of the court*** to mark the closing of the case.

_Sample Output:_
```
{
    "message": "Case number : 15092023180435434's status has been upgraded to Completed"
}

```