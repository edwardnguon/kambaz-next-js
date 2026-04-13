"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button, FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../courses/reducer";
import { RootState } from "../store";
import * as client from "../courses/client";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  const dispatch = useDispatch();
  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description"
  });
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  const fetchCourses = async () => {
    try {
      const courses = await client.findMyCourses();
      dispatch(setCourses(courses));
      setEnrolledCourseIds(courses.map((c: any) => c._id));
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAllCourses = async () => {
    try {
      const courses = await client.fetchAllCourses();
      setAllCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCourses();
    fetchAllCourses();
  }, [currentUser]);

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
    setEnrolledCourseIds([...enrolledCourseIds, newCourse._id]);
    fetchAllCourses();
  };
  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((course: any) => course._id !== courseId)));
    setEnrolledCourseIds(enrolledCourseIds.filter((id) => id !== courseId));
    fetchAllCourses();
  };
  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(setCourses(courses.map((c: any) => {
      if (c._id === course._id) { return course; }
      else { return c; }
    })));
    fetchAllCourses();
  };
  const onEnroll = async (courseId: string) => {
    await client.enrollInCourse(courseId);
    await fetchCourses();
    await fetchAllCourses();
  };
  const onUnenroll = async (courseId: string) => {
    await client.unenrollFromCourse(courseId);
    await fetchCourses();
    await fetchAllCourses();
  };

  const displayedCourses = showAllCourses ? allCourses : courses;

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard
        <button className="btn btn-primary float-end"
          id="wd-toggle-enrollments"
          onClick={() => setShowAllCourses(!showAllCourses)}>
          {showAllCourses ? "My Courses" : "All Courses"}
        </button>
      </h1> <hr />
      {isFaculty && (
        <>
          <h5> New Course
            <button className="btn btn-primary float-end"
                    onClick={onAddNewCourse} id="wd-add-new-course-click">
              Add </button>
            <button className="btn btn-warning float-end me-2"
                    onClick={onUpdateCourse} id="wd-update-course-click">
              Update </button>
          </h5> <br />
          <FormControl value={course.name} className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })} />
          <FormControl value={course.description} as="textarea" rows={3}
            onChange={(e) => setCourse({ ...course, description: e.target.value })} />
          <hr />
        </>
      )}
      <h2 id="wd-dashboard-published">
        {showAllCourses ? `All Courses (${displayedCourses.length})` : `Published Courses (${displayedCourses.length})`}
      </h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses
            .map((c: any) => (
            <Col key={c._id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link href={`/courses/${c._id}/home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark">
                  <CardImg src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {c.name} </CardTitle>
                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                      {c.description} </CardText>
                    <Button variant="primary"> Go </Button>
                  </CardBody>
                </Link>
                {showAllCourses && (
                  enrolledCourseIds.includes(c._id) ? (
                    <button className="btn btn-danger float-end" onClick={(event) => {
                      event.preventDefault();
                      onUnenroll(c._id);
                    }}>Unenroll</button>
                  ) : (
                    <button className="btn btn-success float-end" onClick={(event) => {
                      event.preventDefault();
                      onEnroll(c._id);
                    }}>Enroll</button>
                  )
                )}
                {!showAllCourses && isFaculty && (
                  <>
                    <button onClick={(event) => {
                              event.preventDefault();
                              setCourse(c);
                            }}
                      className="btn btn-warning me-2 float-end"
                      id="wd-edit-course-click" >
                      Edit
                    </button>
                    <button className="btn btn-danger float-end"
                      onClick={(event) => {
                        event.preventDefault();
                        onDeleteCourse(c._id);
                      }}
                      id="wd-delete-course-click">
                      Delete
                    </button>
                  </>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
