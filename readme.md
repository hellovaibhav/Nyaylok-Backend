# creation of case

URL for registration : <br/>
localhost:1978/cases/registerCase <br/>
<br/>
**Paramaters are passed by the value**<br/>

```
"victim" : _string_
"fir" : _string_
"policeStation" : _string_
"pincode" : _Number_
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
        "IPCs": ["295","296","297"],
        "prevCaseId": "4567-123526"
}
```
