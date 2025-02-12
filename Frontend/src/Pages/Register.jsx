import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Box, Paper, MenuItem } from "@mui/material";
import { registerUser } from "../Services/User"; // Import the API call function

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // Redirect after successful registration

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let errors = {};
    if (!formData.name.trim()) {
      errors.name = "Full name is required.";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format.";
    }
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (!formData.role) {
      errors.role = "Please select a role.";
    }
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return; // Prevent API call if validation fails

    try {
      const response = await registerUser(formData);

      if (response.error) {
        setError(response.error);
        setSuccess("");
      } else {
        setSuccess("User registered successfully! Redirecting...");
        setError("");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Select Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            error={!!errors.role}
            helperText={errors.role}
            margin="normal"
          >
           <MenuItem value="BUYER">Buyer</MenuItem>
           <MenuItem value="SELLER">Seller</MenuItem>
           <MenuItem value="ADMIN">Admin</MenuItem>
          </TextField>
          <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} type="submit" disabled={!isFormValid}>
            Register
          </Button>
        </form>
        {error && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}
        {success && <Typography color="success" align="center" sx={{ mt: 2 }}>{success}</Typography>}
        <Typography align="center" sx={{ mt: 2 }}>
          <Link to="/login">Already have an account? Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
