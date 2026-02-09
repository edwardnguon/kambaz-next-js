"use client";
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button } from "react-bootstrap";
import Link from "next/link";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/1234/home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1234 React JS</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Full Stack software developer
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/2345/home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS2345 Web Dev</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Web development with modern frameworks
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/3456/home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS3456 Databases</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Database management systems
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/4567/home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS4567 Algorithms</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Data structures and algorithms
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/5678/home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS5678 Machine Learning</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Introduction to machine learning
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/6789/home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS6789 Cloud Computing</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Cloud infrastructure and services
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/courses/7890/home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS7890 Mobile Dev</CardTitle>
                  <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                    Mobile application development
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
