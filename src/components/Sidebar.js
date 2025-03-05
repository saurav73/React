import { NavLink } from "react-router";


const Sidebar = () => {
 
  return (
    <div className="v-col sidebar">
      Admin
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
          <NavLink to="/login" end>
            Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
