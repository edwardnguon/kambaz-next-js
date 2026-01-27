import Link from "next/link";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of
      </textarea>
      <br />
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input type="number" id="wd-points" defaultValue={100} />
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-group">Assignment Group</label>
            </td>
            <td>
              <select id="wd-group">
                <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-display-grade-as">Display Grade as</label>
            </td>
            <td>
              <select id="wd-display-grade-as">
                <option value="Percentage">Percentage</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-submission-type">Submission Type</label>
            </td>
            <td>
              <select id="wd-submission-type">
                <option value="Online">Online</option>
              </select>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <label>Online Entry Options</label><br/>
              <input type="checkbox" id="wd-text-entry"/>
              <label htmlFor="wd-text-entry">Text Entry</label><br/>
              <input type="checkbox" id="wd-website-url"/>
              <label htmlFor="wd-website-url">Website URL</label><br/>
              <input type="checkbox" id="wd-media-recordings"/>
              <label htmlFor="wd-media-recordings">Media Recordings</label><br/>
              <input type="checkbox" id="wd-student-annotation"/>
              <label htmlFor="wd-student-annotation">Student Annotation</label><br/>
              <input type="checkbox" id="wd-file-uploads"/>
              <label htmlFor="wd-file-uploads">File Uploads</label>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-assign-to">Assign</label>
            </td>
            <td>
              <label htmlFor="wd-assign-to">Assign to</label><br/>
              <input id="wd-assign-to" defaultValue="Everyone" /><br/>
              <label htmlFor="wd-due-date">Due</label><br/>
              <input type="date" id="wd-due-date" defaultValue="2024-05-13" /><br/>
              <label htmlFor="wd-available-from">Available from</label>
              <label htmlFor="wd-available-until">Until</label><br/>
              <input type="date" id="wd-available-from" defaultValue="2024-05-06" />
              <input type="date" id="wd-available-until" defaultValue="2024-05-20" />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <Link href="/courses/1234/assignments">Cancel</Link>
              <button>Save</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
);}
