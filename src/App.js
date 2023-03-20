import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout.js";
import Home from "./components/home-component.js";
import Register from "./components/register-component.js";
import Login from "./components/login-component.js";
import Profile from "./components/profile-component.js";
import Course from "./components/course-component.js";
import PostCourse from "./components/postCourse-component.js";
import Enroll from "./components/enroll-component.js";
import AuthService from "./service/auth.js";

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  let [courseData, setCourseData] = useState(null);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        >
          <Route index element={<Home />}></Route>
          <Route path="register" element={<Register />}></Route>
          <Route
            path="login"
            element={
              <Login
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="profile"
            element={
              <Profile
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="course"
            element={
              <Course
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                courseData={courseData}
                setCourseData={setCourseData}
              />
            }
          ></Route>
          <Route
            path="postCourse"
            element={
              <PostCourse
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="enroll"
            element={
              <Enroll
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                courseData={courseData}
                setCourseData={setCourseData}
              />
            }
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
