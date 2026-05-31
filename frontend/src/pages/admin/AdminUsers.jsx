import { useEffect, useState } from "react";
import api from "../../api/api";
import AdminLayout from "../../components/AdminLayout";
import Loader from "../../components/Loader";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get("/auth/users")
      .then((data) => active && setUsers(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminLayout title="Users">
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td className="small">{u.email}</td>
                  <td>
                    <span className={`role-pill role-${u.role}`}>{u.role}</span>
                  </td>
                  <td>{u.verified ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
