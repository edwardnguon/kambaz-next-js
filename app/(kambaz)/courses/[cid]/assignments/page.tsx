import Link from "next/link";
import { ListGroup, ListGroupItem, FormControl, InputGroup } from "react-bootstrap";
import { BsGripVertical, BsSearch, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
export default function Assignments() {
  return (
    <div id="wd-assignments">
      <div className="d-flex justify-content-between mb-3">
        <InputGroup className="w-50">
          <InputGroup.Text><BsSearch /></InputGroup.Text>
          <FormControl placeholder="Search for Assignments" id="wd-search-assignment" />
        </InputGroup>
        <div>
          <button className="btn btn-secondary me-2"><BsPlus className="fs-5" />Group</button>
          <button className="btn btn-danger"><BsPlus className="fs-5" />Assignment</button>
        </div>
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
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <MdAssignment className="me-3 fs-3 text-success" />
                <div className="flex-fill">
                  <Link href="/courses/1234/assignments/A1" className="text-decoration-none text-dark fw-bold">A1</Link>
                  <br />
                  <span className="text-muted small">Multiple Modules | Not available until May 6 at 12:00am | Due May 13 at 11:59pm | 100 pts</span>
                </div>
                <div className="float-end">
                  <FaCheckCircle className="text-success me-2" />
                  <IoEllipsisVertical className="fs-4" />
                </div>
              </div>
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <MdAssignment className="me-3 fs-3 text-success" />
                <div className="flex-fill">
                  <Link href="/courses/1234/assignments/A2" className="text-decoration-none text-dark fw-bold">A2</Link>
                  <br />
                  <span className="text-muted small">Multiple Modules | Not available until May 13 at 12:00am | Due May 20 at 11:59pm | 100 pts</span>
                </div>
                <div className="float-end">
                  <FaCheckCircle className="text-success me-2" />
                  <IoEllipsisVertical className="fs-4" />
                </div>
              </div>
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <MdAssignment className="me-3 fs-3 text-success" />
                <div className="flex-fill">
                  <Link href="/courses/1234/assignments/A3" className="text-decoration-none text-dark fw-bold">A3</Link>
                  <br />
                  <span className="text-muted small">Multiple Modules | Not available until May 20 at 12:00am | Due May 27 at 11:59pm | 100 pts</span>
                </div>
                <div className="float-end">
                  <FaCheckCircle className="text-success me-2" />
                  <IoEllipsisVertical className="fs-4" />
                </div>
              </div>
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
