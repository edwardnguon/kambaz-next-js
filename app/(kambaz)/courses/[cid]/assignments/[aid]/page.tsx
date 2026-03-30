"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FormControl, FormSelect, FormCheck, Row, Col, FormLabel, FormGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setAssignments } from "../../../../courses/assignments/reducer";
import { RootState } from "../../../../store";
import * as client from "../../../client";

export default function AssignmentEditor() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const cid = params.cid as string;
  const aid = params.aid as string;
  const isNew = aid === "new";
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const existingAssignment = assignments.find((a: any) => a._id === aid);

  const [assignment, setAssignment] = useState<any>(
    isNew
      ? {
          title: "New Assignment",
          description: "New Assignment Description",
          points: 100,
          course: cid,
          dueDate: "",
          availableDate: "",
          availableUntil: "",
        }
      : {
          ...existingAssignment,
        }
  );

  const handleSave = async () => {
    if (isNew) {
      const newAssignment = await client.createAssignmentForCourse(cid, assignment);
      dispatch(setAssignments([...assignments, newAssignment]));
    } else {
      await client.updateAssignment(assignment);
      dispatch(setAssignments(assignments.map((a: any) =>
        a._id === assignment._id ? assignment : a
      )));
    }
    router.push(`/courses/${cid}/assignments`);
  };

  const handleCancel = () => {
    router.push(`/courses/${cid}/assignments`);
  };

  return (
    <div id="wd-assignments-editor">
      <FormGroup className="mb-3">
        <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
        <FormControl id="wd-name" value={assignment?.title || ""}
          onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
          className="form-control" />
      </FormGroup>
      <FormControl as="textarea" id="wd-description" rows={6} className="form-control mb-3"
        value={assignment?.description || ""}
        onChange={(e) => setAssignment({ ...assignment, description: e.target.value })} />

      <Row className="mb-3">
        <Col sm={4} className="text-end">
          <FormLabel htmlFor="wd-points">Points</FormLabel>
        </Col>
        <Col sm={8}>
          <FormControl id="wd-points" value={assignment?.points || 100}
            onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) || 0 })}
            className="form-control" />
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
            <FormControl type="date" id="wd-due-date"
              value={assignment?.dueDate || ""}
              onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
              className="form-control mt-2 mb-3" />
            <Row>
              <Col>
                <strong>Available from</strong>
                <FormControl type="date" id="wd-available-from"
                  value={assignment?.availableDate || ""}
                  onChange={(e) => setAssignment({ ...assignment, availableDate: e.target.value })}
                  className="form-control mt-2" />
              </Col>
              <Col>
                <strong>Until</strong>
                <FormControl type="date" id="wd-available-until"
                  value={assignment?.availableUntil || ""}
                  onChange={(e) => setAssignment({ ...assignment, availableUntil: e.target.value })}
                  className="form-control mt-2" />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <hr />
      <div className="text-end">
        <button onClick={handleCancel} className="btn btn-secondary me-2">Cancel</button>
        {isFaculty && (
          <button onClick={handleSave} className="btn btn-danger">Save</button>
        )}
      </div>
    </div>
  );
}
