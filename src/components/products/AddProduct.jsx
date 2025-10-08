/* @fileoverview The AddProduct component provides a form interface for users
 * to input new product details, including converting a selected image file
 * into a Base64 string before submission to the backend service.
 */
// Import necessary React hooks and functions.
import React, { useState, useContext } from "react";
// useNavigate is a hook from React Router used for programmatic navigation.
import { useNavigate } from "react-router-dom";
// Imports an external service layer function for API interaction (creating the product).
import productService from "../../services/productService";
// Imports the Authentication Context to access the current user's token for authorization.
import AuthContext from "../../context/AuthContext";
// Imports the necessary CSS for styling (Bootstrap framework).
import "bootstrap/dist/css/bootstrap.min.css";
// Imports custom styling specific to this component.
import "../../styles/AddProduct.css";
/**
 * 'const AddProduct = () => { ... }' defines the main functional component.
 */
const AddProduct = () => {
  // 'const navigate = useNavigate();' initializes the navigation function from React Router.
  const navigate = useNavigate();
  // Destructures 'currentUser' from the AuthContext using the useContext hook.
  // This user object should contain the authorization token required for the API call.
  const { currentUser } = useContext(AuthContext);
  // This state now manages the text-based form data
  /**
   * 'const [formData, setFormData] = useState({ ... });' initializes state for all text inputs.
   * 'formData': Holds the current values of the form fields.
   * 'setFormData': The function to update this state.
   */
  const [formData, setFormData] = useState({
    name: "",      // Product name (string)
    description: "", // Product description (string)
    price: "",     // Product price (string, will be converted to number later)
    stock: "",     // Product stock quantity (string, will be converted to number later)
  });
  // This new state holds the selected file object
  /**
   * 'const [image_url, setImageFile] = useState(null);' initializes state to hold the file object itself.
   * 'image_url' is named to reflect its intended final use as a source/URL.
   */
  const [image_url, setImageFile] = useState(null);
  /**
   * State for displaying success or error messages to the user.
   */
  const [message, setMessage] = useState("");
  /**
   * State for managing the submission process (to disable the button and show a loader).
   */
  const [loading, setLoading] = useState(false);
  // This handles changes for all text inputs
  /**
   * 'const handleChange = (e) => { ... }' is the generic change handler for text inputs.
   * 'e' is the synthetic event object.
   */
  const handleChange = (e) => {
    // Destructure 'name' and 'value' properties from the input field that triggered the event.
    const { name, value } = e.target;
    // Update the 'formData' state by spreading the previous state and overriding the specific field.
    setFormData({
      ...formData,
      [name]: value, // Uses computed property names ([name]) to dynamically update the correct key.
    });
  };
  // This new function handles the file input change
  /**
   * 'const handleFileChange = (e) => { ... }' is the specific handler for the file input field.
   */
  const handleFileChange = (e) => {
    // Get the first file from the event target's files array (files[0]).
    const file = e.target.files[0];
    // Check if a file was successfully selected.
    if (file) {
      // Store the file object itself in the component state.
      setImageFile(file);
    }
  };
  // The asynchronous function handles the form submission
  /**
   * 'const handleSubmit = async (e) => { ... }' is the main function executed on form submission.
   * 'async' indicates it handles asynchronous operations (API calls).
   */
  const handleSubmit = async (e) => {
    // 'e.preventDefault();' prevents the default browser action (page reload) for form submission.
    e.preventDefault();
    // Start loading state.
    setLoading(true);
    // Clear any previous messages.
    setMessage("");
    // Use a FileReader to convert the image file to a Base64 string
    /**
     * 'const reader = new FileReader();' creates a new instance of the FileReader API.
     * This is a native browser API used to asynchronously read the contents of files.
     */
    const reader = new FileReader();
    // This callback function runs when the file has been fully read
    /**
     * 'reader.onloadend = async () => { ... }' sets a callback function that executes
     * once the 'readAsDataURL' operation (started below) is complete, whether success or failure.
     * The callback is marked 'async' because it contains the final API call.
     */
    reader.onloadend = async () => {
      // 'reader.result' contains the Base64 encoded string (prefixed with mime type, e.g., "data:image/png;base64,...").
      const base64String = reader.result;
      // Combine the form data and the new Base64 string
      // Create the final payload object to send to the API.
      const productData = {
        ...formData, // Spread all text input data (name, price, etc.)
        image_url: base64String, // Add the encoded image string under the 'imageUrl' key.
      };
      try {
        // Call the service function to send data to the backend API.
        const newProduct = await productService.createProduct(
          productData,
          // Pass the user's token (or authentication key) for API authorization.
          currentUser.token
        );
        // Check if the API call returned a product successfully.
        if (newProduct) {
          setMessage("Product created successfully!");
          // Use setTimeout for a delayed, controlled navigation after success.
          setTimeout(() => {
            navigate("/products");
          }, 2000);
        }
      } catch (error) {
        // Handle API errors. Attempt to get a specific message from the error response structure.
        const errorMessage =
          error.response?.data?.message || "An unexpected error occurred.";
        setMessage(`Error: ${errorMessage}`);
      } finally {
        // Ensure the loading state is reset regardless of success or failure.
        setLoading(false);
      }
    };
    // If a file is selected, start the conversion process. Otherwise, show an error.
    // Check if the file state ('image_url') holds a file object.
    if (image_url) {
      // CRITICAL: Call readAsDataURL on the selected file. This starts the asynchronous process
      // that will eventually trigger the 'onloadend' callback defined above.
      reader.readAsDataURL(image_url);
    } else {
      // If no file was selected, stop loading and display an error immediately.
      setLoading(false);
      setMessage("Error: Please select an image file.");
    }
  };
 /* The 'return' statement defines the JSX structure of the component.
   */
  return (
    // Main container with custom styling class.
    <div className="add-product-page ">
      <div className="container mt-3">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {/* Card component using Bootstrap for clean visual grouping. */}
            <div className="card shadow-lg product-form-card">
              <div className="card-body">
                {/* Header/Title */}
                <h2 className="card-title text-center mb-4 product-form-title">
                  Add New Product :shopping_bags:
                </h2>
                {/* The main form element, tied to the handleSubmit function. */}
                <form onSubmit={handleSubmit} className="product-form">
                  <div className="row">
                    {/* Product Name Input */}
                    <div className="col-md-6 mb-3 form-group">
                      <label htmlFor="name" className="form-label">
                        Product Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name} // Controlled input: value is tied to state.
                        onChange={handleChange} // Controlled input: updates state on change.
                        required
                      />
                    </div>
                    {/* Product Price Input */}
                    <div className="col-md-6 mb-3 form-group">
                      <label htmlFor="price" className="form-label">
                        Price
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  {/* Product Description Input (full width) */}
                  <div className="mb-3 form-group">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="row">
                    {/* Product Image File Input */}
                    <div className="col-md-6 mb-3 form-group">
                      <label htmlFor="imageFile" className="form-label">
                        Product Image
                      </label>
                      <input
                        type="file" // Sets the input type to accept file uploads.
                        className="form-control"
                        id="imageFile"
                        name="image_url"
                        onChange={handleFileChange} // Uses the specific file handler.
                        required
                      />
                    </div>
                    {/* Product Stock Input */}
                    <div className="col-md-6 mb-3 form-group">
                      <label htmlFor="stock" className="form-label">
                        Stock
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-50 btn-add-product"
                    // Disable the button when 'loading' is true to prevent multiple submissions.
                    disabled={loading}
                  >
                    {/* Conditional text display based on the loading state. */}
                    {loading ? "Adding..." : "Add Product"}
                  </button>
                </form>
                {/* Message Display */}
                {/* Conditionally render the message area if 'message' state is not empty. */}
                {message && (
                  <div
                    // Determine Bootstrap alert class based on whether the message starts with "Error".
                    className={`alert ${
                      message.startsWith("Error") ? "alert-danger" : "alert-success"
                    } mt-3 text-center`}
                    role="alert"
                  >
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Export the component so it can be used in other files (e.g., in routing setup).
export default AddProduct;