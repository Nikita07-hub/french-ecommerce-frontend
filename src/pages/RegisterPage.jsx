import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

const RegisterPage = () => 
    {

//here we define javascript code

//why we use  useState 
//we use useState hook to manage the forms input state for email and password
//as well as any loading or error states
//this line initializes the email state variable with an empty string and provides the setEmail funvtion to up date it

const [email , setEmail] = useState('');

// This line initialize  the password state variable and its  updater function 'setPassword'
const [password_hash , setPassword_Hash ]= useState('');

// This line initialize  the loading state which track whenever the registration process is in progress 'setLoading'
const [loading , setLoading] = useState(false);

// This line initialize  the error state which will store registration error msg 'setError'
const [error , setError] = useState(null);

const {registerAuth} = useContext(AuthContext);

//why we use asynchronus function
const  handleSubmit = async (e) => {
    //e.preventDefault() prevent the default form submission which could cause a page reload
    e.preventDefault();

//set the loading state to true to include that the registration process is started
setLoading(true);

//clear any previous error msg before attempting a new registration
setError(null);

//a try catch block is used to handle success and failure of the asynchrouns operations
try{
    //call the register function from the AuthContext
    //the await keyword pauses the execution until the register promise is resolved
    await registerAuth(email , password_hash)

}catch(error){
    //if an error occurs during  registration , the catch block is executed...
    //log the  error to the console for debugging purpose
    console.error(error);

    //we check for a specific error msg to provide better feedback to the user 
    //the "?" operator is a turnary operator, which is shorthand of an if...else statement
    const errorMessage = error.message === "Email already exist"
    ? "This email is already in use.Please try a diffrent one"
    : "Failed to register . Please try again later";
     
    setError(errorMessage);
} finally{
    setLoading(false);
    setEmail('');
    setPassword_Hash('');
}

} ;
    // the return statement renders  the components JSX(React syntax for html like code) 
return (
    // we use the standard html tags with bootstrap classes for styling to maintain consistency across our components
    //this is the main container div with bootstrap classes for centering content
<div className="container d-flex justify-content-center align-items-center " style={{minHeight:'80vh'}}>
    {/* this `div` acts  as a card with padding a shadow and a fixed width */}
    <div className="card p-4 shadow-sm" style={{width:'25rem'}}>
            {/* a heading for the form */}
            <h2 className="text-center mb-4">Register</h2>
            {/* we use condtional rendering to show an error msg if the 'error' state is not null */}
            {/* if error is a truthy valuethe div with the alert will be provided */}
            {error && <div className="alert alert-danger">{error}</div>}
            {/* the form element with an 'onSumbit' event handler that calls 'handleSubmit' function */}

            <form onSubmit={handleSubmit}>
                {/* a div for the email input  */}
                <div className="mb-3">
                    {/*  a lable for the email input 'htmlFor' links it to the input feild's id*/}
                    <label htmlFor="formEmail" className="form-label">Email Address</label>
                    {/* the email input feild */}
                    <input 
                    type="email"
                    className="form-control"
                    id="formEmail"
                    placeholder="Enter email"
                    //value = {email} binds the input value to the email state
                    value={email}
                    // 'onChange' updates the email state whenever the user types
                    onChange={(e => setEmail(e.target.value))}
                    //required is an html attribute that makes the feild mandatory
                    required
                    
                    />


                </div>

                 {/* a div for the password input  */}
                <div className="mb-3">
                    {/*  a lable for the password input 'htmlFor' links it to the input feild's id*/}
                    <label htmlFor="formPassword" className="form-label">Password</label>
                    {/* the password input feild */}
                    <input 
                    type="password"
                    className="form-control"
                    id="formPassword"
                    placeholder="Enter Password"
                    //value = {password} binds the input value to the password state
                    value={password_hash}
                    // 'onChange' updates the password state whenever the user types
                    onChange={(e => setPassword_Hash(e.target.value))}
                    //required is an html attribute that makes the feild mandatory
                    required
                    
                    />


                </div>
                {/* the submit button */}
                <button type="submit" className="btn btn-primary w-100" //the disable attribute is set to true if loading is true
                //preventing multiple submission while a request is in progress
                disabled={loading} //the button will disbale when loading
                >
                    {/* this uses a turnary operator to conditionally change the buttons text */}
                    {/* based in the loading state */}
                    {loading ? 'Registering....' : 'Register'}
                </button>
            </form>

    </div>

</div>
)
}

export default RegisterPage;