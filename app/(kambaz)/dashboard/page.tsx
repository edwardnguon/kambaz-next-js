import Link from "next/link";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/courses/1234" className="wd-dashboard-course-link">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/2345" className="wd-dashboard-course-link">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS2345 Web Development </h5>
              <p className="wd-dashboard-course-title">
                Building modern web applications
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/3456" className="wd-dashboard-course-link">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS3456 Database Design </h5>
              <p className="wd-dashboard-course-title">
                Introduction to databases
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/4567" className="wd-dashboard-course-link">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS4567 Software Engineering </h5>
              <p className="wd-dashboard-course-title">
                Software development lifecycle
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/5678" className="wd-dashboard-course-link">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS5678 Mobile Development </h5>
              <p className="wd-dashboard-course-title">
                iOS and Android development
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/6789" className="wd-dashboard-course-link">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS6789 Cloud Computing </h5>
              <p className="wd-dashboard-course-title">
                AWS and Azure fundamentals
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/7890" className="wd-dashboard-course-link">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS7890 Machine Learning </h5>
              <p className="wd-dashboard-course-title">
                Introduction to ML algorithms
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
);}
