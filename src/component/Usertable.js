import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import "./css/table.css";
import { firebase, usersCollection } from "./firebase";

const handleStatusChange = async (uid) => {
  try {
    // Update the user status in Firestore
    const userDoc = await usersCollection.doc(uid).get();
    const userData = userDoc.data();

    if (userData.status === "Active") {
      await usersCollection.doc(uid).update({ status: "Inactive" });
      console.log(`Change status of user ${uid} to "Inactive"`);
    } else {
      await usersCollection.doc(uid).update({ status: "Active" });
      console.log(`Change status of user ${uid} to Active`);
    }
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

const handleAddUser = async (uid, uname, email) => {
  try {
    // Fetch the user details from Firestore using the userId
    if (uname !== "" && email !== "") {
      await usersCollection.doc(uid).set({
        username: uname,
        email: email,
        addeddate: firebase.firestore.FieldValue.serverTimestamp(),
        status: "Active",
      });
    }
    console.log(`Add user action for ${uid}`);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

const handleDeleteUser = async (uid) => {
  try {
    // Delete the user from Firestore
    await usersCollection.doc(uid).delete();
    console.log(`Delete user action for ${uid}`);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

const columns = [
  { Header: "Name", accessor: "username" },
  {
    Header: "Date Added",
    accessor: "addeddate",
    Cell: ({ value }) => {
      if (value && value.seconds) {
        const date = new Date(value.seconds * 1000);
        return date.toLocaleString();
      }
      return "N/A"; // Or any default value for missing date
    },
  },
  { Header: "Status", accessor: "status" },
  {
    Header: "Actions",
    accessor: "id", // Use the user ID for actions
    Cell: ({ value }) => (
      <div className="actions">
        <button onClick={() => handleStatusChange(value)}>Change</button>
        <button onClick={() => handleDeleteUser(value)}>Delete</button>
      </div>
    ),
  },
];

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [Uname, setUname] = useState("");
  const [Email, setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await usersCollection.get();
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure useEffect runs only once on component mount

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: users });

  return (
    <>
      <head>
        <title>Weatherteller</title>
      </head>
      <br></br>
      <h1>User's Log</h1>
      <div className="table-container">
        <table className="table" {...getTableProps()}>
          <thead className="header">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr className="row" {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td className="cell" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tr>
            <td colSpan={columns.length}>
              <div className="add-user-container">
                <input
                  type="text"
                  value={Uname}
                  onChange={(e) => setUname(e.target.value)}
                  placeholder="Enter Username"
                />
                <input
                  type="email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
                <button
                  className="add"
                  onClick={() => handleAddUser("newUserId", Uname, Email)}
                >
                  Add/Edit User
                </button>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default UserTable;
