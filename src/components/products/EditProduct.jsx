// This line imports the necessary hooks from React.
// `useState`: Manages the component's state (e.g., form data, loading status).
// `useEffect`: Executes side effects, like fetching data, after the component renders.
import React, { useState, useEffect } from "react";
// This line imports `useParams` to get parameters from the URL, and `useNavigate` for programmatic navigation.
import { useParams, useNavigate } from "react-router-dom";
// This line imports the `useContext` hook to access a context value.
import { useContext } from "react";
// This line imports the `productService` object, which contains all the API call functions for products.
import productService from "../../services/productService";
// This line imports the `AuthContext` to access the current user's authentication data.
import AuthContext from "../../context/AuthContext";
// This is a commented-out line that would import Bootstrap CSS.
// import 'bootstrap/dist/css/bootstrap.min.css';
/**
 * @description: A page component for editing an existing product.
 * It fetches the product's current data, pre-populates a form, and handles the update.
 */
// This defines the `EditProduct` functional component.
const EditProduct = () => {
  // We use `useParams` to get the dynamic product ID from the URL.
  // The `{ id }` part destructures the `id` from the parameters object.
  const { id } = useParams();
  // `useNavigate` is initialized here to get the navigation function.
  const navigate = useNavigate();
  // `useContext` is used to get the `currentUser` object from `AuthContext`.
  const { currentUser } = useContext(AuthContext);
  // We use the `useState` hook to manage the form data.
  // The state is an object that mirrors the product's properties.
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  // This new state holds the selected file object
  /**
   * 'const [image_url, setImageFile] = useState(null);' initializes state to hold the file object itself.
   * 'image_url' is named to reflect its intended final use as a source/URL.
   */
  const [image_url, setImageFile] = useState(null);
  // We use state to manage UI feedback and loading status.
  // `loading` is set to `true` initially because the product data needs to be fetched.
  const [loading, setLoading] = useState(true);
  // `message` is for success messages.
  const [message, setMessage] = useState("");
  // `error` is for error messages.
  const [error, setError] = useState(null);
  // We use `useEffect` to fetch the product data as soon as the component mounts.
  // This useEffect run when id provide
  // It is dependent on id
  useEffect(() => {
    /**
     * @description: Fetches the product data from the backend.
     */
    // This inner function is defined to handle the asynchronous API call.
    const fetchProduct = async () => {
      try {
        // Log the product ID to the console for debugging.
        console.log("Id is", id);
        // Call the `getProductById` function from `productService`.
        const response = await productService.getProductById(id); //product{id:2,name:"watch"}
        // Log the response for debugging.
        console.log("Response is", response);
        // If the response is valid, we pre-populate the form.
        if (response) {
          // Set the `formData` state with the fetched data.
          setFormData({
            name: response.name,
            description: response.description,
            price: response.price,
            stock: response.stock,
          });
          setImageFile({image_url: response.image_url || ""})
          // Set `loading` to `false` to hide the loading indicator.
          setLoading(false);
        } else {
          // If no product is found, set an error message.
          setError("Product not found.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error to fetch product", err);
        // If an error occurs during fetching, set an error message.
        setError("Failed to fetch product data.");
        setLoading(false);
      }
    };
    // Call the `fetchProduct` function to initiate the data fetching.
    fetchProduct();
  }, [id]); // The dependency array `[id]` ensures this effect runs only when the `id` parameter changes.
  /**
   * @description: Handles changes to the form input fields.
   * Updates the `formData` state with the new value.
   * @param {object} e - The event object from the input field.
   */
  const handleChange = (e) => {
    // Destructure `name` and `value` from the event target.
    const { name, value } = e.target;
    // Update the `formData` state using a functional update pattern for safety.
    setFormData((prevData) => ({
      ...prevData, // Copy the previous state.
      [name]: value, // Update the specific field that was changed.
    }));
    //   setFormData({
    //   ...formData, // Copy the previous state.
    //   [name]: value, // Update the specific field that was changed.
    // });
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
  /**
   * @description: Handles the form submission for updating the product.
   * @param {object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    // `e.preventDefault()` stops the default browser form submission behavior.
    e.preventDefault();
    // Set `loading` to `true` to show the updating status.
    setLoading(true);
    // Clear any previous messages.
    setMessage("");
    // Clear any previous errors.
    setError(null);
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
      // Call the `updateProduct` service from our `productService`.
      const response = await productService.updateProduct(
        id, // The product ID.
        productData, // The updated form data.
        currentUser.token // The user's token for authentication.
      );
      // Check for a `success` property in the response from the server.
      if (response.success) {
        // If successful, set a success message.
        setMessage("Product updated successfully!");
        // After a successful update, we use `setTimeout` to redirect the user after 2 seconds.
        setTimeout(() => {
          navigate("/products");
        }, 2000);
      } else {
        // If the server response indicates an error, set the error message.
        setError(response.message || "An unexpected error occurred.");
      }
    } catch (err) {
      console.error("Failed to update product", err);
      // If the API call fails, get the error message from the Axios error object.
      setError(err.response?.data?.message || "Failed to update product.");
    } finally {
      // The `finally` block runs whether the try or catch block was executed.
      // It ensures `loading` is set to `false`, which re-enables the form.
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
  // Conditional rendering for different states (loading, error, and success).
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading product data...</p>
      </div>
    );
  }
  // If there's an error, display an alert message.
  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }
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
                  Edit Product :shopping_bags:
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
                      message.startsWith("Error")
                        ? "alert-danger"
                        : "alert-success"
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
export default EditProduct;