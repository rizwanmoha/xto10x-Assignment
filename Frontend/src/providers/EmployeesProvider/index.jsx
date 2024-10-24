import { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../../api/axios";
import EditEmployeeModal from "../../components/Modals/EditEmployee";

export const EmployeeContext = createContext();

const EmployeesProvider = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [editVisible, setEditVisible] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/listofemployee");
            setEmployees([...response.data.data]);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const addEmployee = async (employeeData) => {
        setLoading(true);
        try {
            await axiosInstance.post("/addemployee", employeeData);
            fetchEmployees();
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const handleEditModalOpen = (id) => {
        setEditId(id);
        setEditVisible(true);
    }

    const editEmployee = async (employeeData) => {
        setLoading(true);
        try {
            await axiosInstance.put("/editemployee", employeeData);
            fetchEmployees();
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }
    
    const deleteEmployee = async (id) => {
        setLoading(true);
        try {
            await axiosInstance.delete("/addemployee/" + id);
            fetchEmployees();
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEmployees();
    }, []);


    const contextValue = {
        employees,
        addEmployee,
        editEmployee,
        deleteEmployee,
        handleEditModalOpen,
        loading
    }

    return (
        <EmployeeContext.Provider value={contextValue}>
            {children}
            <EditEmployeeModal visible={editVisible} id={editId} setVisible={setEditVisible} />
        </EmployeeContext.Provider>
    )
}

export default EmployeesProvider; 