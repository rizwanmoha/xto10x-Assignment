// services/employeeService.js
const Employee = require('../models/employeeModel');

const findEmployeeByName = async (name) => {
    try {
        
        const employee = await Employee.findOne({ name: name });
        console.log(employee);
        
        // Check if employee array is empty
        if (!employee || employee.length === 0) {
            return {
                success: false,
                data: null,
                error: 'Employee not found'
            };
        }

        return {
            success: true,
            data: employee
        };
    } catch (error) {
        console.error("Error in findEmployeeByName:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

const findEmployeeById = async (employeeId) => {
   try {
       const employee = await Employee.findOne({ employeeId });
       return {
           success: true,
           data: employee || null
       };
   } catch (error) {
       return {
           success: false,
           data : null,
           error: error.message
       };
   }
};

const generateEmployeeId = async () => {
   try {
       const count = await Employee.countDocuments();
       const employeeId = `EMP${(count + 1).toString().padStart(4, '0')}`;
       return {
           success: true,
           data: employeeId
       };
   } catch (error) {
       return {
           success: false,
           error: error.message
       };
   }
};

const checkCyclicDependency = async (employee) => {
   try {
       const employeeDoc = new Employee(employee);
       const result = await employeeDoc.checkCyclicRelationship(employee.managerId);
       return {
           success: true,
           data: result
       };
   } catch (error) {
       return {
           success: false,
           error: error.message
       };
   }
};

const createEmployee = async (employeeData) => {
   try {
       const { data: employeeId } = await generateEmployeeId();
       
       const employee = new Employee({
           ...employeeData,
           employeeId,
           count: 0
       });

       const savedEmployee = await employee.save();
       return {
           success: true,
           data: savedEmployee
       };
   } catch (error) {
       return {
           success: false,
           error: error.message
       };
   }
};

const listOfEmployeeService = async(skip , limit)=>{
    try{

        const employeesList = await Employee.find({managerId : null}).skip(skip).limit(limit);
        // const employeesList = await Employee.find({managerId : 'null'})
        return {
            success : true,
            data : employeesList
        }
    }
    catch(error){
            return {
                success : false,
                error: error.message
            }
    }
}

const allEmployeesUnderManagerService = async(empId) =>{

    try{
        const employeeList = await Employee.find({managerId : empId});


        return {
            success : true ,
            data : employeeList
        }

    }
    catch(error){
        return {
            success : false ,
            error : error.message
        }
    }
}


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
          data: allSubordinates
        };
      }
  
      // Add direct subordinates to the list
      allSubordinates = [...directSubordinates];
  
      // Recursively find all subordinates for each direct subordinate
      for (let subordinate of directSubordinates) {
        const subordinatesOfSubordinate = await findAllSubordinatesService(subordinate.employeeId);
        if (subordinatesOfSubordinate.success) {
          allSubordinates = [...allSubordinates, ...subordinatesOfSubordinate.data];
        }
      }
  
      return {
        success: true,
        data: allSubordinates
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };
  

  const findAllAncestorsService = async (employeeId) => {
    try {
      // Array to hold all ancestor managers
      let ancestors = [];
  
      // Find the employee by employeeId
      let employee = await Employee.findOne({ employeeId: employeeId });
  
      // While the employee has a managerId, keep fetching the manager details
      while (employee && employee.managerId) {
        const manager = await Employee.findOne({ employeeId: employee.managerId });
  
        if (!manager) break;
  
        // Add the manager to the ancestors array
        ancestors.push(manager);
  
        // Move to the next manager in the hierarchy
        employee = manager;
      }
  
      return {
        success: true,
        data: ancestors
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };


module.exports = {
   findEmployeeByName,
   findEmployeeById,
   generateEmployeeId,
   checkCyclicDependency,
   createEmployee,
   listOfEmployeeService,
   allEmployeesUnderManagerService,
   findAllSubordinatesService,
   findAllAncestorsService
};