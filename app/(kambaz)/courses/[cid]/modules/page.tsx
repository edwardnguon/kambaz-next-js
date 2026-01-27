export default function Modules() {
  return (
    <div>
      <div id="wd-modules-controls">
        <button id="wd-collapse-all">Collapse All</button>
        <button id="wd-view-progress">View Progress</button>
        <select id="wd-publish-all">
          <option value="PUBLISH_ALL">Publish All</option>
          <option value="PUBLISH_ALL_MODULES_AND_ITEMS">Publish all modules and items</option>
          <option value="PUBLISH_MODULES_ONLY">Publish modules only</option>
          <option value="UNPUBLISH_ALL_MODULES_AND_ITEMS">Unpublish all modules and items</option>
          <option value="UNPUBLISH_MODULES_ONLY">Unpublish modules only</option>
        </select>
        <button id="wd-add-module">+ Module</button>
      </div>
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">Week 1</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">Learn what is Web Development</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module"> <div className="wd-title">Week 2</div> </li>
        <li className="wd-module"> <div className="wd-title">Week 3</div> </li>
      </ul>
    </div>
);}
