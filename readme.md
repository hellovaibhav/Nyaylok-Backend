# Registration of case

### URL for registration : 

```
localhost:1978/cases/registerCase 
```

<br/>
**Paramaters are passed by the value**<br/>

```
"victim" : _string_
"fir" : _string_
"policeStation" : _string_
"pincode" : _Number_
"phone":"_Number_"
"IPCs" : _ array of strings_
"prevCaseId" : _string_
```
<br/>

_example :_


```
{
       "victim": "Saquib,
        "fir": "529810-123",
        "policeStation": "Namkum",
        "pincode": 480001,
        "phone":1245678321,
        "IPCs": ["295","296","297"],
        "prevCaseId": "4567-123526"
}
```


# Get ongoing and registered cases

### URL to get pending cases :

```
localhost:1978/cases/IncompleteCases 
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