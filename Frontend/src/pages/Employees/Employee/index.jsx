import { useContext, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { axiosInstance } from "../../../api/axios";
import EmployeesContainer from "../EmployeesContainer";
import { AiFillDelete } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { EmployeeContext } from "../../../providers/EmployeesProvider";

const Employee = ({ employee }) => {
    const { handleEditModalOpen } = useContext(EmployeeContext);
    const [expanded, setExpanded] = useState(false);
    const [directSubordinates, setDirectSubordinates] = useState([]);

    const handleMinusClick = () => {
        setExpanded(false);
    }

    const handlePlusClick = async () => {
        if (directSubordinates.length === 0) {
            try {
                const response = await axiosInstance.get("/allemployeesUnderManager/" + employee.employeeId);
                setDirectSubordinates([...response.data.data]);
                setExpanded(true);
            } catch (err) {
                console.log(err);
                alert(err.response.data.message);
            }
        } else {
            setExpanded(true);
        }
    }
    
    const handleDelete = async () => {
        try {   

        } catch (err) {
            console.log(err);
            alert(err.response.data.message);
        }
    }

    return (
        <div>
            <div className="flex flex-row items-center gap-x-2">
                {
                    employee.count > 0
                    &&
                    <div className="bg-slate-300 px-1 py-1 cursor-pointer" onClick={expanded ? handleMinusClick: handlePlusClick}>
                        {
                            expanded
                            ?
                            <FaMinus />
                            :
                            <FaPlus />
                        }
                    </div>
                }
                <p>{employee.name}</p>
                {
                    employee.count > 0
                    &&
                    <p className="bg-slate-300 px-2 rounded-sm">{employee.count}</p>
                }
                <div className="cursor-pointer bg-slate-300 p-1" onClick={handleDelete}>
                    <AiFillDelete />
                </div>
                <div className="cursor-pointer bg-slate-300 p-1" onClick={() => handleEditModalOpen(employee.employeeId)}>
                    <MdEdit />
                </div>
            </div>
            {
                expanded
                &&
                <div className="ml-[11px] mt-2">
                    <EmployeesContainer employees={directSubordinates} />
                </div>
            }
        </div>
    )
}

export default Employee;