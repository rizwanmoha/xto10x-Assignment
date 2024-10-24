const express = require("express");
const {
  addEmployee,
  EmployeeList,
  getSpecificEmployeeDetails,
  allEmployeesUnderManager,
  allDirectAndIndirectSubordinates,
  allAncestorManager,
  deleteEmployee,
  updateEmployee,
} = require("../controllers/employeeController");

const router = express.Router();
// add an employee
router.post("/addemployee", addEmployee);

// Getting list of root employee
router.get("/listofemployee", EmployeeList);

// Getting details of particular employee
router.get("/employeedetails/:empId", getSpecificEmployeeDetails);

// All employees Under a particular manager
router.get("/allemployeesUnderManager/:empId", allEmployeesUnderManager);

// All direct and Indirect subordinates a particular manager
router.get("/employeesSubordinates/:empId", allDirectAndIndirectSubordinates);

// All ancestors Manager till root
router.get("/allAncestorManager/:empId", allAncestorManager);

// Delete an employee
router.delete("/delete/:empId", deleteEmployee);

// Update an employee

router.put("/editemployee/:empId", updateEmployee);

module.exports = router;
