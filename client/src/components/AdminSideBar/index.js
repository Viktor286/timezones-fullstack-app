import './index.css';
import { useEffect, useState } from 'react';
import { getUserList, sendUserDelete } from '../../requests/user';

export default function AdminSideBar({ auth }) {
  const [users, setUsers] = useState([]);

  const onUserDelete = (userObj) => {
    const asyncRun = async () => {
      const { email: userEmail } = userObj;
      const deleteResponse = await sendUserDelete(auth, userEmail);

      if (deleteResponse.status === 204) {
        console.log('DELETED!', userObj);
        const userListRes = await getUserList(auth);
        const {
          data: { users },
        } = userListRes;
        setUsers(users);
        // update list
      }
    };

    asyncRun();
  };

  useEffect(() => {
    const asyncRun = async () => {
      const userListRes = await getUserList(auth);
      const {
        data: { users },
      } = userListRes;
      setUsers(users);
    };

    asyncRun();
  }, []);

  return (
    <aside className={`admin-sidebar ${auth.role}`}>
      <h2>Admin panel</h2>
      <ul className="users-list">
        {users.map((el) => {
          const { email, role } = el;
          return (
            <li key={email}>
              {email}({role})
              <div>
                <button>(edit)</button>
                <button onClick={() => onUserDelete(el)}>(delete)</button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
