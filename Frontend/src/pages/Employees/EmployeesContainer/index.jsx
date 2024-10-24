import Employee from "../Employee";

const EmployeesContainer = ({employees}) => {
    return (
        <div className="border-l-2 border-black flex flex-col gap-3">
            {
                employees.map((employee, index) => (
                    <div key={index} className="flex flex-row gap-2">
                        <div className="h-[1.5px] w-5 bg-black mt-3"></div>
                        <Employee employee={employee} />
                    </div>
                ))
            }
        </div>
    )
}

export default EmployeesContainer;