const employeeModel = require("../models/employeeModel");
const {
  employeeValidationSchema,
} = require("../validations/employeeValidations");
const {
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
} = require("../services/employeeServices");

// This Controller is for adding employees in a collection

const addEmployee = async (req, res) => {
  try {
    // first we validate the payload
    const { error, value } = employeeValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details.map((detail) => detail.message),
      });
    }
    const { name, email, managerEmail, dateOfJoining } = value;
    let managerEmployeeId = null;
    // First we are checking wheather we are making them as root employee or employee under some manager
    if (managerEmail) {
      // Checking wheather Manager with the given email exist or not
      const manager = await findEmployeeByEmail(managerEmail);
      if (!manager.success) {
        return res.status(400).json({ message: "Manager not existing" });
      }

      managerEmployeeId = manager.data.employeeId;
      const tempEmployee = {
        employeeId: await generateEmployeeId(),
        managerId: managerEmployeeId,
      };
      // Checking wheather the employee with the  particular  email exist or not
      const existingEmployee = await employeeModel.findOne({ email: email });

      if (existingEmployee) {
        return res.status(400).json({ message: "Employee already existing" });
      }
      const employeeData = {
        name: name,
        email: email,
        dateOfJoining: dateOfJoining,
        managerId: managerEmployeeId,
      };

      // creating a new employee
      const createdEmployee = await createEmployee(employeeData);
      // Updating the count of manager
      const updatedManager = await employeeModel.findOneAndUpdate(
        { employeeId: managerEmployeeId },
        { $inc: { count: 1 } },
        { new: true }
      );

      // Checking if the manager was found and updated
      if (!updatedManager) {
        return res.status(400).send({ message: "Manager not updated" });
      }

      return res.status(200).json({ success: true, employee: createdEmployee });
    } else {
      // Creating root employee
      const employeeData = {
        name: name,
        email: email,
        dateOfJoining: dateOfJoining,
        managerId: managerEmployeeId,
      };
      const createdEmployee = await createEmployee(employeeData);

      return res.status(200).json({ success: true, employee: createdEmployee });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while getting", error: error });
  }
};

// List of root employees

const EmployeeList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const result = await listOfEmployeeService(skip, limit);

    return res.status(200).json({ data: result.data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while getting list of root employees" });
  }
};

// finding the details of specific employee and it's manager

const getSpecificEmployeeDetails = async (req, res) => {
  try {
    const { empId } = req.params;
    const employee = await findEmployeeById(empId);
    if (!employee.data) {
      return res
        .status(400)
        .json({ message: "Employee with this id is not existing" });
    }
    const manager = await findEmployeeById(employee.data.managerId);

    return res
      .status(200)
      .json({ success: true, employee: employee.data, manager: manager.data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//  finding the employees under the particular manager

const allEmployeesUnderManager = async (req, res) => {
  try {
    const { empId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const result = await allEmployeesUnderManagerService(empId , skip , limit);
    return res.status(200).json({ success: result.success, data: result.data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  finding all direct and indirect subordinates employees of a manager

const allDirectAndIndirectSubordinates = async (req, res) => {
  try {
    const { empId } = req.params;
    const { success, data, error } = await findAllSubordinatesService(empId);

    if (!success) {
      return res.status(500).json({
        success: false,
        error: error || "Error while fetching subordinates",
      });
    }

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// finding all ancestor Manager of a employee

const allAncestorManager = async (req, res) => {
  try {
    const { empId } = req.params;
    const { success, data, error } = await findAllAncestorsService(empId);

    if (!success) {
      return res.status(500).json({
        success: false,
        error: error || "Error while fetching ancestors",
      });
    }

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Deleting an employee

const deleteEmployee = async (req, res) => {
  try {
    const { empId } = req.params;
    const result = await deleteEmployeeService(empId);

    if (!result.success) {
      return res.status(400).json({ message: "Error while deleting Employee" });
    }

    return res.status(200).json({ message: "Employee deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error while deleting employee" });
  }
};

// Updating an Employee

const updateEmployee = async (req, res) => {
  try {
    const { empId } = req.params;

    const updatedData = req.body;

    const updatedEmployee = await updateEmployeeService(empId, updatedData);

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

module.exports = {
  addEmployee,
  EmployeeList,
  getSpecificEmployeeDetails,
  allEmployeesUnderManager,
  allDirectAndIndirectSubordinates,
  allAncestorManager,
  deleteEmployee,
  updateEmployee,
};
