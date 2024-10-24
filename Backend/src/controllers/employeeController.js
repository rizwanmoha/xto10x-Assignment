const employeeModel = require('../models/employeeModel');
const { employeeValidationSchema } = require('../validations/employeeValidations');
const {
    findEmployeeByName,
    findEmployeeById,
    generateEmployeeId,
    checkCyclicDependency,
    createEmployee,
    listOfEmployeeService,
    allEmployeesUnderManagerService,
    findAllSubordinatesService,
    findAllAncestorsService

} = require('../services/employeeServices');

const addEmployee = async (req, res) => {
    try {
        
        
        const { error, value } = employeeValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details.map(detail => detail.message)
            });
        }
        const { name, email, managerName, dateOfJoining } = value;
        let managerEmployeeId = null;
        if (managerName) {
                console.log("first coming");
                const manager = await findEmployeeByName(managerName);
                if(!manager.success){
                    return res.status(400).json({message : "Manager not existing"});
                    
                }

                managerEmployeeId = manager.data.employeeId;
                const tempEmployee = {
                    employeeId: await generateEmployeeId(),
                    managerId: managerEmployeeId
                };
    
                // const hasCycle = await checkCyclicDependency(tempEmployee);

                // if(hasCycle){
                //     return res.status(400).json({message : "Employee Forming cycle"})
                // }

                const existingEmployee = await  employeeModel.findOne({name :name });
                    console.log("First one is coming");
                if(existingEmployee){
                    return res.status(400).json({message : "Employee already existing"});
                }
                const employeeData = {name : name , email : email , dateOfJoining :dateOfJoining ,managerId : managerEmployeeId};

                console.log("employee data" , employeeData);
                const createdEmployee = await createEmployee(employeeData);
                const updatedManager = await employeeModel.findOneAndUpdate(
                    { employeeId: managerEmployeeId }, // Find the manager by employeeId
                    { $inc: { count: 1 } }, // Increment the count field by 1
                    { new: true } // Return the updated document
                  );

                  console.log("employeeCreatedandUpdate");
              
                  // Check if the manager was found and updated
                  if (!updatedManager) {
                    console.log('Manager not found with provided employeeId');
                    return res.status(400).send({message : "Manager not updated"});
                  }

                  return res.status(200).json({success : true , employee :createdEmployee });



                
        }
        else {
            const employeeData = {name : name , email : email , dateOfJoining :dateOfJoining ,managerId : managerEmployeeId};
            const createdEmployee = await createEmployee(employeeData);

            return res.status(200).json({success : true , employee :createdEmployee });
        }


        
    }
    catch (error) {
        console.log("error we are getting" , error);
        return res.status(500).json({ message: "Error while getting" , error : error });
    }
}


const EmployeeList = async(req , res) =>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

    
        const skip = (page - 1) * limit;

        const result = await listOfEmployeeService(skip , limit);

        return res.status(200).json({data : result.data});

    }
    catch(error){
        return res.status(500).json({message : "Error while getting list of root employees"});
    }
}

const getSpecificEmployeeDetails = async(req , res) =>{
    try{
        const { empId } = req.params;
        const employee = await findEmployeeById(empId);
        if(!employee.data){
            return res.status(400).json({message : "Employee with this id is not existing"});
        }
        const manager = await findEmployeeById(employee.data.managerId);
        


        return res.status(200).json({success : true , employee : employee.data , manager: manager.data })
        




    }
    catch(error){
        return res.status(500).json({error : error.message})
    }

}

const allEmployeesUnderManager = async(req , res) =>{
    try{
        const {empId} = req.params;

        const result = await allEmployeesUnderManagerService(empId);
        return res.status(200).json({success : result.success , data : result.data});
    }

    catch(error){
        return res.status(500).json({message : error.message});
    }

}
const allDirectAndIndirectSubordinates = async (req, res) => {
    try {
      const { empId } = req.params;
      const { success, data, error } = await findAllSubordinatesService(empId);
  
      if (!success) {
        return res.status(500).json({
          success: false,
          error: error || 'Error while fetching subordinates'
        });
      }
  
      return res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  const allAncestorManager = async (req, res) => {
    try {
      const { empId } = req.params;
      const { success, data, error } = await findAllAncestorsService(empId);
  
      if (!success) {
        return res.status(500).json({
          success: false,
          error: error || 'Error while fetching ancestors'
        });
      }
  
      return res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

const deleteEmployee = async(req , res) =>{
    try{
        const { empId } = req.params;
        

    }
    catch(error){

    }
}
  
  


module.exports = { addEmployee , EmployeeList  , getSpecificEmployeeDetails , allEmployeesUnderManager , allDirectAndIndirectSubordinates , allAncestorManager, deleteEmployee};