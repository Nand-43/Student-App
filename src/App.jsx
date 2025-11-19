import {useEffect, useState} from "react";
import axios from "axios";
 import './App.css';

function App() {

  const[filteredStudents, setFilteredStudents] = useState([])
  const [students, setStudents] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [studentData,setStudentData]= useState({name:"", major:"", email:""});

   const openPopup = () => {
    setIsModelOpen(false)
   }

   const handleClose = () => {
    setIsModelOpen(true)
    getAllStudent();
   }

   const handleSearch=(e)=>{
      const searchValue = e.target.value.toLowerCase();
      const filteredData = students.filter(student => 
        student.name.toLowerCase().includes(searchValue) ||
        student.major.toLowerCase().includes(searchValue) ||
        student.email.toLowerCase().includes(searchValue) )
        setFilteredStudents(filteredData);
      
   }

   const getAllStudent=()=>{
    axios.get("http://localhost:3005/students").then((res)=>{
      setStudents(res.data)
      setFilteredStudents(res.data)
    })
   }

   const handleSubmit = async (e)=>{
    e.preventDefault();

    if(studentData.studentid){

      await axios.patch(`http://localhost:3005/students/${studentData.studentid}`,studentData).then((res)=>{
      console.log(res.data)
      })

    }
    else{

      await axios.post("http://localhost:3005/students",studentData).then((res)=>{
      console.log(res.data)
      })
    }

    handleClose();
   }
   const handleChange=(e)=>{
    setStudentData ({...studentData,[e.target.name]:e.target.value})
   }

   const handleUpdate=(student)=>{
     setStudentData(student);
     openPopup();
   }

   useEffect(() =>{
    getAllStudent();
   }, [])

  return (
    
      <div className="std-Container">
      <h3>
        FUll stack developer and web-developed Node.js,React 
        </h3>
      <div className="search-Box">
        <input className="searchInput" onChange={handleSearch} placeholder='serach' name="searchInput" id="searchInput"/>
        <button className="button addeditcolor" onClick={openPopup}>Add</button>
      </div>


      <div className="table-Box">
        {isModelOpen || <div className='addeditpopup'>
            <span className='closeBtn' onClick={handleClose}>&times;</span>
            <h4>Student Detail</h4>

            <div className="popupdiv">
              <label className="popuplabel" htmlFor="name">Name</label><br/>
              <input type="text" className="popupinput" value={studentData.name} onChange={handleChange} name="name" id="name" />
            </div><br></br>

            <div className="popupdiv">
              <label className="popuplabel" htmlFor="name">Major</label><br/>
              <input type="text" className="popupinput" value={studentData.major} onChange={handleChange} name="major" id="major" />
            </div><br></br>

            <div className="popupdiv">
              <label className="popuplabel" htmlFor="name">Email</label><br/>
              <input type="text" className="popupinput" value={studentData.email} onChange={handleChange} name="email" id="email" />
            </div><br></br>

            <button className="addstudentBtn addeditcolor" onClick={handleSubmit}>{studentData.studentid?"Update Student":"Add Student"} </button>

        </div>}
        
        <table className="table">
          
          <tr>
            <th>StudentId</th>
            <th>Name</th>
            <th>Major</th>
            <th>Email</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>


                    
                    <tbody>
                      {filteredStudents && filteredStudents.map(student =>{
                        return (
                          <tr key={student.studentid}>
                          <td>{student.studentid}</td>
                          <td>{student.name}</td>
                          <td>{student.major}</td>
                          <td>{student.email}</td>
                          <td ><button className='edit addeditcolor' onClick={()=>handleUpdate(student)}>Edit</button></td>
                          <td ><button className='delete deletecolor'>Delete</button></td>
                          </tr>)
                      })}
                    </tbody>

        </table>


        
      </div>
     </div>
    
  )
}


export default App
