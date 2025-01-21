import axios from 'axios';

// function that gets the user details(instructor or student) given their ID:
export const getUserDetails = async (id: number) => {
	try {
		let response = await axios.get(`http://localhost:5000/api/getUserDetails/${id}`);
		let userData = response.data;

		if (userData && userData.hasOwnProperty('educationLevel')) {
			// Do something based on the presence of the property
			console.log(`User has the desired property: ${userData.educationLevel}`);
		} else {
			return userData.userId;
			console.log('User data does not have the desired property.');
		}
	} catch (err: any) {
		console.log('Couldnt find userData');
	}
};
