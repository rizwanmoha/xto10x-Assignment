const express = require('express');
const {addEmployee, EmployeeList , getSpecificEmployeeDetails , allEmployeesUnderManager , allDirectAndIndirectSubordinates, allAncestorManager} = require('../controllers/employeeController');

const router = express.Router();

router.post('/addemployee' , addEmployee);
router.get('/listofemployee' , EmployeeList);
router.get('/employeedetails/:empId' , getSpecificEmployeeDetails)
router.get('/allemployeesUnderManager/:empId' , allEmployeesUnderManager)
router.get('/employeesSubordinates/:empId' ,allDirectAndIndirectSubordinates);
router.get('/allAncestorManager/:empId' , allAncestorManager)



module.exports = router