import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useContext, useState } from "react";
import { EmployeeContext } from "../../../providers/EmployeesProvider";
import PrimaryLoader from "../../Loader/PrimaryLoader";

const AddEmployeeModal = ({ visible, setVisible }) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [managerName, setManagerName] = useState("");
    const [joiningDate, setJoiningDate] = useState(new Date());
    const { addEmployee } = useContext(EmployeeContext);

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addEmployee({managerName, name, email, dateOfJoining: joiningDate});
            alert("Employee Created Successfully!");
        } catch (err) {
            console.log(err);
            alert(err.response.data.message);
        } finally {
            setLoading(false);
            setVisible(false);
        }
    }

    return (
        <Modal show={visible} size="md" popup onClose={() => setVisible(false)}>
            <Modal.Header />
            <Modal.Body>
                <form onSubmit={handleAddEmployee} className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                        Enter Employee Details
                    </h3>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="Name" value="Name" />
                        </div>
                        <TextInput 
                            id="Name" 
                            placeholder="Alex" 
                            value={name} 
                            required 
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email" value="Email" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            placeholder="alex@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="managerName" value="Manager Name" />
                        </div>
                        <TextInput 
                            id="managerName" 
                            placeholder="Jack"
                            value={managerName}
                            onChange={(e) => setManagerName(e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="join" value="Joining Date" />
                        </div>
                        <TextInput 
                            id="join" 
                            type="date" 
                            required 
                            value={joiningDate} 
                            onChange={(e) => setJoiningDate(e.target.value)}   
                        />
                    </div>
                    <div className="w-full flex flex-row justify-center">   
                        <Button type="submit">
                            {
                                loading
                                ?
                                <PrimaryLoader />
                                :   
                                "Add Employee"
                            }
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default AddEmployeeModal;