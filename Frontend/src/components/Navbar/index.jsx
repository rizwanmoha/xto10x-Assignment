import { Navbar } from "flowbite-react";
import Logo from "../../assets/logo.png";
import React, { useState } from "react";
import AddEmployeeModal from "../Modals/AddEmployee";

const Nav = () => {
  const [addEmployeeVisible, setAddEmployeeVisible] = useState(false);

  return (
    <React.Fragment>
      <Navbar fluid rounded>
        <Navbar.Brand href="https://flowbite-react.com">
          <img
            src={Logo}
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite React Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Flowbite React
          </span>
        </Navbar.Brand>
        <button
          className="flex flex-row shadow-md px-4 py-1 rounded-md border-[2px]"
          onClick={() => setAddEmployeeVisible(true)}
        >
          Add
        </button>
      </Navbar>
      <AddEmployeeModal
        visible={addEmployeeVisible}
        setVisible={setAddEmployeeVisible}
      />
    </React.Fragment>
  );
};

export default Nav;
