import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import HomeComponent from "./components/home-component";
import RegisterComponent from "./components/register-component";
import LoginComponent from "./components/login-component";
import ProfileComponent from "./components/profile-component";
import AuthService from "./services/auth.service";
import PostCourseComponent from "./components/postCourse-component";
import CourseComponent from "./components/course-component";
import EnrollComponent from "./components/enroll-component";

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrenUser());
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        >
          <Route index element={<HomeComponent />} />
          <Route path="/register" index element={<RegisterComponent />} />
          <Route
            path="/login"
            index
            element={
              <LoginComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="/profile"
            index
            element={
              <ProfileComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="/course"
            index
            element={
              <CourseComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="/postCourse"
            index
            element={
              <PostCourseComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="/enroll"
            index
            element={
              <EnrollComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
