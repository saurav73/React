import UserHeader from './UserHeader';
import UserRow from './UserRow';

const Users = (props) => {
  const data = [
    {
      id: 1,
      name: "John Doe",
      age: 25,
      address: "USA",
      phone: "1234567890",
      email: "something@gmail.com",
    },
    {
      id: 2,
      name: "Jane Doe",
      age: 30,
      address: "Canada",
      phone: "9876543210",
      email: "1@gmail.com",
    },
    {
      id: 3,
      name: "John Smith",
      age: 35,
      address: "UK",
      phone: "1111111111",
      email: "2@gmail.com",
    },
    {
      id: 4,
      name: "Jane Smith",
      age: 40,
      address: "Australia",
      phone: "2222222222",
      email: "3@gmail.com",
    }
  ];

  return (
    <div>
      <div className="v-row dashboard-row">
        <div className="v-col dashboard-col dashboard-col-1">
          <h2>Hello, Admin!</h2>
          <p>Welcome to the {props.title} Lists</p>
          <table id="users">
            <thead>
              <UserHeader />
            </thead>
            <tbody>
              {data.map((item) => ( <UserRow row={item} />))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
