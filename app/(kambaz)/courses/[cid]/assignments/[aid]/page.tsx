import Link from "next/link";
import { FormControl, FormSelect, FormCheck, Row, Col, FormLabel, FormGroup } from "react-bootstrap";
export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <FormGroup className="mb-3">
        <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
        <FormControl id="wd-name" defaultValue="A1" className="form-control" />
      </FormGroup>
      <FormControl as="textarea" id="wd-description" rows={6} className="form-control mb-3"
        defaultValue="The assignment is available online. Submit a link to the landing page of your Web application running on Vercel." />

      <Row className="mb-3">
        <Col sm={4} className="text-end">
          <FormLabel htmlFor="wd-points">Points</FormLabel>
        </Col>
        <Col sm={8}>
          <FormControl id="wd-points" defaultValue={100} className="form-control" />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={4} className="text-end">
          <FormLabel htmlFor="wd-group">Assignment Group</FormLabel>
        </Col>
        <Col sm={8}>
          <FormSelect id="wd-group" className="form-control">
            <option>ASSIGNMENTS</option>
            <option>QUIZZES</option>
            <option>EXAMS</option>
            <option>PROJECT</option>
          </FormSelect>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={4} className="text-end">
          <FormLabel htmlFor="wd-display-grade-as">Display Grade as</FormLabel>
        </Col>
        <Col sm={8}>
          <FormSelect id="wd-display-grade-as" className="form-control">
            <option>Percentage</option>
            <option>Letter Grade</option>
          </FormSelect>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={4} className="text-end">
          <FormLabel htmlFor="wd-submission-type">Submission Type</FormLabel>
        </Col>
        <Col sm={8}>
          <FormSelect id="wd-submission-type" className="form-control mb-2">
            <option>Online</option>
            <option>In Person</option>
          </FormSelect>
          <div className="border rounded p-3">
            <strong>Online Entry Options</strong>
            <FormCheck label="Text Entry" id="wd-text-entry" className="mt-2" />
            <FormCheck label="Website URL" id="wd-website-url" defaultChecked className="mt-2" />
            <FormCheck label="Media Recordings" id="wd-media-recordings" className="mt-2" />
            <FormCheck label="Student Annotation" id="wd-student-annotation" className="mt-2" />
            <FormCheck label="File Uploads" id="wd-file-uploads" className="mt-2" />
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={4} className="text-end">
          <FormLabel>Assign</FormLabel>
        </Col>
        <Col sm={8}>
          <div className="border rounded p-3">
            <strong>Assign to</strong>
            <FormControl id="wd-assign-to" defaultValue="Everyone" className="form-control mt-2 mb-3" />
            <strong>Due</strong>
            <FormControl type="date" id="wd-due-date" defaultValue="2024-05-13" className="form-control mt-2 mb-3" />
            <Row>
              <Col>
                <strong>Available from</strong>
                <FormControl type="date" id="wd-available-from" defaultValue="2024-05-06" className="form-control mt-2" />
              </Col>
              <Col>
                <strong>Until</strong>
                <FormControl type="date" id="wd-available-until" className="form-control mt-2" />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <hr />
      <div className="text-end">
        <Link href="/courses/1234/assignments" className="btn btn-secondary me-2">Cancel</Link>
        <Link href="/courses/1234/assignments" className="btn btn-danger">Save</Link>
      </div>
    </div>
  );
}
