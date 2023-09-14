# creation of case

URL for registration : <br/>
localhost:1978/cases/registerCase text in blue <br/>
<br/>
**Paramaters are passed by the value**<br/>
<br/>
```
"victim" : _string_
"fir" : _string_
"policeStation" : _string_
"areaPincode" : _Number_
"IPCs" : _ array of strings_
"prevCaseId" : _string_
```
<br/>
_example :_
<br/>
```
{<br/>
       "victim": "Saquib",<br/>
        "fir": "529810-123",<br/>
        "policeStation": "Chutiya",<br/>
        "areaPincode": 480001,<br/>
        "IPCs": ["295","296","297"],<br/>
        "prevCaseId": "4567-123526"<br/>
}<br/>
```
