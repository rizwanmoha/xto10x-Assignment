import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { EmployeeContext } from "../../../providers/EmployeesProvider";
import PrimaryLoader from "../../Loader/PrimaryLoader";
import { axiosInstance } from "../../../api/axios";
import { toast } from "react-toastify";

const EditEmployeeModal = ({ visible, setVisible, id }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [managerName, setManagerName] = useState("");
  const [joiningDate, setJoiningDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const { editEmployee } = useContext(EmployeeContext);

  const handleEditEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await editEmployee({
        employeeId,
        name,
        email,
        dateOfJoining: joiningDate,
      });
      setName("");

      setJoiningDate("");
      setEmail("");
      toast.success("Employee Updated Successfully!");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const response = await axiosInstance.get("/employeedetails/" + id);
      const empl = response.data.employee;
      setName(empl.name);
      setEmployeeId(empl.employeeId);
      setManagerName(response.data?.manager?.name);
      setJoiningDate(empl.dateOfJoining.split("T")[0]);
      setEmail(empl.email);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchEmployeeData();
    }
  }, [visible]);

  return (
    <Modal show={visible} size="md" popup onClose={() => setVisible(false)}>
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleEditEmployee} className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Update Employee Details
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
              {loading ? <PrimaryLoader /> : "UpDate Employee"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditEmployeeModal;
