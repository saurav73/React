import { NavLink, useNavigate } from "react-router";


const Sidebar = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.setItem("is_login", "0");
    navigate("/");
  }
  return (
    <div className="v-col sidebar">
      <ul className="v-col">
        <li>
          <NavLink to="/admin/dashboard" end>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/users" end>
            Users
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/setting" end>
            Setting
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/antdesign" end>
            Ant Design
          </NavLink>
        </li>

        <li>
          <button type="button" onClick={handleClick}>Logout</button>
        </li>
      </ul>
    </div>
  );
};



export default Sidebar;
