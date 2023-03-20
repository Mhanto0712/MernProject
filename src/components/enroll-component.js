import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../service/course.js";

const EnrollComponent = ({
  currentUser,
  setCurrentUser,
  courseData,
  setCourseData,
}) => {
  const navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);
  useEffect(() => {
    let _id = currentUser.user._id;
    CourseService.getStudent(_id)
      .then((data) => {
        setCourseData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = () => {
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        console.log(data);
        setSearchResult(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleEnroll = (e) => {
    let reEnroll = false;
    for (let i = 0; i < courseData.length; i++) {
      if (courseData[i]._id == e.target.id) {
        reEnroll = true;
      }
    }
    if (!reEnroll) {
      CourseService.enroll(e.target.id)
        .then(() => {
          window.alert("課程註冊成功。重新導向到課程頁面。");
          navigate("/course");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      window.alert("已註冊過此課程！");
    }
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before searching for courses.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>Only students can enroll in courses.</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div className="search input-group mb-3">
          <input
            onChange={handleChangeInput}
            type="text"
            className="form-control"
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>
      )}
      {currentUser && searchResult && searchResult.length != 0 && (
        <div>
          <p>我們從 API 返回的數據。</p>
          {searchResult.map((course) => (
            <div key={course._id} className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">課程名稱：{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p>價格: {course.price}</p>
                <p>目前的學生人數: {course.students.length}</p>
                <a
                  href="#"
                  onClick={handleEnroll}
                  className="card-text btn btn-primary"
                  id={course._id}
                >
                  註冊課程
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
