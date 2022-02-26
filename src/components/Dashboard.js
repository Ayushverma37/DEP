import React, { useState } from 'react'
import data from "./data.json"
export default function DashboardTAble() {
  const [contacts] = useState(data);
  return (
    <>
    <div className="app-container">
    <table className="Table">
        <thead>
            <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Email</th>
            </tr>
        </thead>
        <tbody>
            {contacts.map((contact) => (
                <tr>
                    <td>{contact.fullName}</td>
                    <td>{contact.address}</td>
                    <td>{contact.phoneNumber}</td>
                    <td>{contact.email}</td>
                </tr>
            ))}
        </tbody>
    </table>
    </div>
    </>
  );
}
