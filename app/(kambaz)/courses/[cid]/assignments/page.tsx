"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ListGroup, ListGroupItem, FormControl, InputGroup, Modal, Button } from "react-bootstrap";
import { BsGripVertical, BsSearch, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { setAssignments } from "../../../courses/assignments/reducer";
import { RootState } from "../../../store";
import * as client from "../../client";

export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<any>(null);

  const fetchAssignments = async () => {
    const assignments = await client.findAssignmentsForCourse(cid as string);
    dispatch(setAssignments(assignments));
  };
  useEffect(() => {
    fetchAssignments();
  }, []);

  const confirmDelete = (assignment: any) => {
    setAssignmentToDelete(assignment);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (assignmentToDelete) {
      await client.deleteAssignment(assignmentToDelete._id);
      dispatch(setAssignments(assignments.filter((a: any) => a._id !== assignmentToDelete._id)));
    }
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };

  return (
    <div id="wd-assignments">
      <Modal show={showDeleteDialog} onHide={() => setShowDeleteDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove the assignment &quot;{assignmentToDelete?.title}&quot;?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>No</Button>
          <Button variant="danger" onClick={handleDelete}>Yes</Button>
        </Modal.Footer>
      </Modal>

      <div className="d-flex justify-content-between mb-3">
        <InputGroup className="w-50">
          <InputGroup.Text><BsSearch /></InputGroup.Text>
          <FormControl placeholder="Search for Assignments" id="wd-search-assignment" />
        </InputGroup>
        {isFaculty && (
          <div>
            <button className="btn btn-secondary me-2"><BsPlus className="fs-5" />Group</button>
            <Link href={`/courses/${cid}/assignments/new`} className="btn btn-danger">
              <BsPlus className="fs-5" />Assignment
            </Link>
          </div>
        )}
      </div>

      <ListGroup className="rounded-0" id="wd-assignment-list">
        <ListGroupItem className="p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> ASSIGNMENTS
            <span className="float-end">
              <span className="badge bg-secondary border border-dark text-dark rounded-pill me-2">40% of Total</span>
              <BsPlus className="fs-4" />
              <IoEllipsisVertical className="fs-4" />
            </span>
          </div>
          <ListGroup className="rounded-0">
            {assignments.map((assignment: any) => (
              <ListGroupItem key={assignment._id} className="wd-lesson p-3 ps-1">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  <MdAssignment className="me-3 fs-3 text-success" />
                  <div className="flex-fill">
                    <Link href={`/courses/${cid}/assignments/${assignment._id}`}
                      className="text-decoration-none text-dark fw-bold">
                      {assignment.title}
                    </Link>
                    <br />
                    <span className="text-muted small">
                      Multiple Modules | Not available until {assignment.availableDate} | Due {assignment.dueDate} | {assignment.points} pts
                    </span>
                  </div>
                  <div className="float-end">
                    {isFaculty && (
                      <FaTrash className="text-danger me-2" style={{ cursor: "pointer" }}
                        onClick={() => confirmDelete(assignment)} />
                    )}
                    <FaCheckCircle className="text-success me-2" />
                    <IoEllipsisVertical className="fs-4" />
                  </div>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
