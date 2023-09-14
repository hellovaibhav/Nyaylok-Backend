import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const totalPoints = async(arr,initialPoints)=>{
    return new Promise(async (resolve, reject) => {
        try {

            const length=arr.length;
            if ( length !== 0) {
            
                for(let cntr=0;cntr<length;cntr+=1)
                {
                    const x=arr[cntr];
                    // console.log(x);
                    const response = await axios.get(`${process.env.IPC_GET}${x}`);
                    // console.log(response.data.points);
                    initialPoints+=response.data.points;
                }

                // console.log(initialPoints);

                resolve({status:"success",points:initialPoints});
            } else {
                console.log("The array looks empty");
                reject({ status: "empty array found" }); 
            }
        } catch (err) {
            console.error("Error occurred:", err.message);
            reject({ status: "something went wrong" }); 
        }
    });
};