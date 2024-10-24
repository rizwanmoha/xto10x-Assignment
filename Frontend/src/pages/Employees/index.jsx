import { useContext } from "react";
import { EmployeeContext } from "../../providers/EmployeesProvider";
import EmployeesContainer from "./EmployeesContainer";
import ScreenLoader from "../../components/Loader/ScreenLoader";

const Employees = () => {
  const { employees, loading } = useContext(EmployeeContext);

  return loading ? (
    <ScreenLoader />
  ) : (
    <div className="p-4 ml-20">
      <EmployeesContainer employees={employees} />
    </div>
  );
};

export default Employees;
