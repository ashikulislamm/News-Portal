import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home.jsx";
import { Footer } from "./components/Footer.jsx";
import { LoginForm } from "./pages/Login.jsx";
import { ContactPage } from "./pages/Contact.jsx";
import { News } from "./pages/News.jsx";
import { RegisterForm } from "./pages/Register.jsx";
import { UserDashboard } from "./pages/Profile.jsx";
import { PrivateRoute } from "./components/PrivateRoutes.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/news" element={<News />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<UserDashboard />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
