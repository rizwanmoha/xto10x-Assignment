const Employee = require("../models/employeeModel");
const { v4: uuidv4 } = require("uuid");

// Finding an Employee By email
const findEmployeeByEmail = async (email) => {
  try {
    const employee = await Employee.findOne({ email: email });

    // Check if employee is existing
    if (!employee) {
      return {
        success: false,
        data: null,
        error: "Employee not found",
      };
    }

    return {
      success: true,
      data: employee,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Finding  an employee by id
const findEmployeeById = async (employeeId) => {
  try {
    const employee = await Employee.findOne({ employeeId });
    return {
      success: true,
      data: employee || null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
};

// Generating a unique employee Id

const generateEmployeeId = async () => {
  try {
    const employeeId = `EMP-${uuidv4()}`;
    return {
      success: true,
      data: employeeId,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Creating a new Employee

const createEmployee = async (employeeData) => {
  try {
    const { data: employeeId } = await generateEmployeeId();

    const employee = new Employee({
      ...employeeData,
      employeeId,
      count: 0,
    });

    const savedEmployee = await employee.save();
    return {
      success: true,
      data: savedEmployee,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Getting a list of root employees
const listOfEmployeeService = async (skip, limit) => {
  try {
    const employeesList = await Employee.find({ managerId: null })
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      data: employeesList,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
// Getting all employees under a particular manager

const allEmployeesUnderManagerService = async (empId , skip , limit) => {
  try {
    const employeeList = await Employee.find({ managerId: empId }).skip(skip).limit(limit);
    return {
      success: true,
      data: employeeList,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Getting all direct ans indirect subordinates
const findAllSubordinatesService = async (managerId) => {
  try {
    // Find all direct subordinates
    const directSubordinates = await Employee.find({ managerId: managerId });

    // Array to hold all subordinates
    let allSubordinates = [];

    // If there are no direct subordinates, return an empty array
    if (!directSubordinates || directSubordinates.length === 0) {
      return {
        success: true,
        data: allSubordinates,
      };
    }

    // Add direct subordinates to the list
    allSubordinates = [...directSubordinates];

    // finding  all subordinates for each direct subordinate
    for (let subordinate of directSubordinates) {
      const subordinatesOfSubordinate = await findAllSubordinatesService(
        subordinate.employeeId
      );
      if (subordinatesOfSubordinate.success) {
        allSubordinates = [
          ...allSubordinates,
          ...subordinatesOfSubordinate.data,
        ];
      }
    }

    return {
      success: true,
      data: allSubordinates,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
// Finding all Manager Ancestors
const findAllAncestorsService = async (employeeId) => {
  try {
    // Array to hold all ancestor managers
    let ancestors = [];

    // Find the employee by employeeId
    let employee = await Employee.findOne({ employeeId: employeeId });

    // While the employee has a managerId, Going upward to the hierarchy
    while (employee && employee.managerId) {
      const manager = await Employee.findOne({
        employeeId: employee.managerId,
      });

      if (!manager) break;

      // Add the manager to the ancestors array
      ancestors.push(manager);

      // Move to the next manager in the hierarchy
      employee = manager;
    }

    return {
      success: true,
      data: ancestors,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete an employee

const deleteEmployeeService = async (empId) => {
  try {
    // Find the employee to be deleted
    const employeeToDelete = await Employee.findOne({ employeeId: empId });
    if (!employeeToDelete) {
      throw new Error("Employee not found");
    }

    // Get the current managerId of the employee to be deleted
    const { managerId } = employeeToDelete;

    // Find all direct subordinates of the employee to be deleted
    const subordinates = await Employee.find({ managerId: empId });

    // Update the managerId of each subordinate to the managerId of the employee to be deleted
    for (const subordinate of subordinates) {
      subordinate.managerId = managerId;
      await subordinate.save();
    }

    // If the employee to be deleted has a manager, decrease the count of the manager
    if (managerId) {
      const manager = await Employee.findOne({ employeeId: managerId });
      if (manager) {
        manager.count = Math.max(manager.count - 1, 0); // Ensure the count doesn't go below 0
        await manager.save();
      }
    }

    if (subordinates.length > 0 && managerId) {
      const newManager = await Employee.findOne({ employeeId: managerId });
      if (newManager) {
        newManager.count += subordinates.length;
        await newManager.save();
      }
    }

    // Delete the employee
    await Employee.deleteOne({ employeeId: empId });

    return {
      success: true,
      message: "Employee Deleted Successfully ",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error while deleting the employee",
    };
  }
};

// Update an Employee

const updateEmployeeService = async (empId, updatedData) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId: empId },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findEmployeeByEmail,
  findEmployeeById,
  generateEmployeeId,
  createEmployee,
  listOfEmployeeService,
  allEmployeesUnderManagerService,
  findAllSubordinatesService,
  findAllAncestorsService,
  deleteEmployeeService,
  updateEmployeeService,
};
