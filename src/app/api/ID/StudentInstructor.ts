import axios from 'axios'

// function that gets the user details(instructor or student) given their ID:
export function getUserDetails(id: number) {
    try{
        let userData =  axios.get('http://localhost:5000/api/getUserDetails');
        if(userData){
            return {
                userType: userData.type,
                userId: userData.userId
            }
        }
    }catch(err: any){
        console.log('Couldnt find userData')
    }
}