import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosClient } from '../api/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Users() {
  const [users, setUsers] = useState([]);
 
  const getUsers = () => {
    axiosClient.get('/userslist')
      .then(res => {
        setUsers(res.data); 
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };
  useEffect(()=>{
    getUsers()
  },[])

  const handleDelete = (userId) => {
    console.log('Deleting user with ID:', userId);
    axiosClient.post('/delete/'+userId)
    .then(response => {console.log('user deleting' , response);
    getUsers();
  })
    
  };

  const handleEdit = (userId) => {
    const userToUpdate = users.find(user => user.id === userId);
    if (!userToUpdate) {
        console.error('User not found');
        return;
    }

    axiosClient.put(`/edit/${userId}`, userToUpdate)
        .then((response) => {
            console.log('User updated:', response.data);
            window.location.href = 'http://localhost:3000/modifier/'+userId; 
        })
        .catch((err) => console.log('Error in Edit:', err));
};

  const downloadpdf=()=>{
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [210,  297]
    });
    doc.setFont('Helvetica', 'bold'); // Set the font to Helvetica bold
    doc.setFontSize(14); // Set the font size to 14
    doc.text('List of Users', 10, 20); // Title with x=10, y=20
    autoTable(doc, {
      html: '#userstable', 
      startY: 30,
      theme: 'grid', // Use the grid theme for a beautiful table with borders
        styles: {
            font: 'Helvetica',
            fontSize: 10,
            cellPadding: 3,
            textColor: [50, 50, 50], // Dark gray text color
        },
        headStyles: {
            fillColor: [54, 162, 235], // Blue header background color
            textColor: [255, 255, 255], // White text color for headers
            fontSize: 10,
            font: 'Helvetica',
            halign: 'center' // Center-align the header text
        },
        bodyStyles: {
            fillColor: [245, 245, 245], // Light gray row background color
            textColor: [50, 50, 50], // Dark gray text color
            valign: 'middle', // Vertically align text to the middle
        },
        alternateRowStyles: {
            fillColor: [220, 220, 220], // Lighter gray color for alternate rows
        },
        columnStyles: {
            0: { halign: 'center' }, // Center-align the first column
        },
      columns: [
          { header: 'ID', dataKey: 'ID' },
          { header: 'Name', dataKey: 'Name' },
          { header: 'Email', dataKey: 'Email' },
          { header: 'Created At', dataKey: 'Created At' },
          { header: 'Updated At', dataKey: 'Updated At' }
      ],
      body: Array.from(document.querySelectorAll('#userstable tbody tr')).map(tr => {
          const cells = tr.children;
          return {
              ID: cells[0].innerText,
              Name: cells[1].innerText,
              Email: cells[2].innerText,
              'Created At': cells[3].innerText,
              'Updated At': cells[4].innerText
          };
      })
  });
    doc.save('users.pdf')
  }

  return (
    <div>
      <h1 className='text-center text-light'>Users List</h1>
      
      <div className="container">
        <div style={{ float :"right" , margin:'10px'}} >
      <button onClick={downloadpdf} className='btn btn-info'>Download Users Data</button>
      </div>
        <table className="table table-bordered" id='userstable'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.created_at}</td>
                <td>{user.updated_at}</td>
                <td style={{ padding : '10px' }}>
                  <button className="btn btn-danger m-1" onClick={() => handleDelete(user.id)}>Supprimer</button>
                  <button className="btn btn-primary" onClick={() => handleEdit(user.id)}>Modifier</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link className='btn btn-info ' to={'/ajouter'}> Ajouter user </Link>
      </div>
    </div>
  );
}
