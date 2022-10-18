const inquirer = require("inquirer");
const db = require("./db/connection.js");

db.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to database");
    askInit();
})

let initialQuestion = [
    {
        type: "list",
        name: "whatToDo",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
            "Quit"
        ]
    }
]

let whatDepartment = [
    {
        name: "departmentName",
        message: "What is the name of the department you would like to add?"
    }
]

let whatRole = [
    {
        name: "roleName",
        message: "What is the name of the role you would like to add?"
    },
    {
        name: "salary",
        type: "number",
        message: "What is the salary of this role?"
    },
    {
        type: "list",
        name: "whichDepart",
        message: "Which department does this role belong to?",
        choices: ["SALES", "ENGINEERING", "FINANCE", "LEGAL"]
    }
]

let whatEmployee = [
    {
        name: "firstName",
        message: "What is the first name of the employee you would like to add?"
    },
    {
        name: "lastName",
        message: "What is the last name of the employee you would like to add?"
    },
    {
        name: "role",
        type: "list",
        message: "What is the role of the current employee?",
        choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Attorney"]
    },
    {
        type: "list",
        name: "whichManager",
        message: "Who is the manager of the current employee?",
        choices: ["Jane", "James", "Miguel", "Morgan", "Derrick", "Toacin", "Disney", "Ian", "None"]
    }
]

let updateEmployeeQuestion = [
    {
        type: "list",
        name: "employeeName",
        message: "What is the name of the employee who's role you'd like to update?",
        choices: ["Jane", "James", "Miguel", "Morgan", "Derrick", "Toacin", "Disney", "Ian", "None"]
    },
    {
        type: "list",
        name: "newRole",
        message: "What is the new role of this employee?",
        choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Attorney"]
    }
]

function askInit () {
    inquirer.prompt(initialQuestion).then((answers) => {
        switch (answers.whatToDo) {
            case "View All Employees":
                getEmployees();
                break;
            case "View All Roles":
                getRoles();
                break;
            case "View All Departments":
                getDepartments();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
            case "Quit":
                console.log("Good Bye!");
                process.exit();
                break;
            default:
                break;
        }
    })
};

let getEmployees = () => {
    db.query("SELECT * FROM employee;", (err, data) => {
        console.table(data);
        askInit();
    })
};

let getRoles = () => {
    db.query("SELECT * FROM role;", (err, data) => {
        console.table(data);
        askInit();
    })
};

let getDepartments = () => {
    db.query("SELECT * FROM department;", (err, data) => {
        console.table(data);
        askInit();
    })
};

let addDepartment = () => {
    inquirer.prompt(whatDepartment)
    .then((response) => {
        db.query(`INSERT INTO department (name) VALUES (?);`, [response.departmentName], (err, data) => {
            console.log("\n-----------------------------------------\n")
            console.log("New department has been successfully added!")
            console.log("\n-----------------------------------------\n")
            askInit();
        })
    })
};

let addRole = () => {
    inquirer.prompt(whatRole)
    .then((response) => {
        let departID;
        switch (response.whichDepart) {
            case "SALES": departID = 1;
                break;
            case "ENGINEERING": departID = 2;
                break;
            case "FINANCE": departID = 3;
                break;
            case "LEGAL": departID = 4;
                break;
            default:
                break;
        }
        db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?);`, 
        [response.roleName, response.salary, departID], 
        (err, data) => {
            console.log("\n-----------------------------------------\n")
            console.log("New role has been successfully added!")
            console.log("\n-----------------------------------------\n")
            askInit();
        })
    })
};

let addEmployee = () => {
    inquirer.prompt(whatEmployee)
    .then((response) => {
        let roleID;
        let managerID;
        switch (response.role) {
            case "Sales Lead": roleID = 1;
                break;
            case "Salesperson": roleID = 2;
                break;
            case "Lead Engineer": roleID = 3;
                break;
            case "Software Engineer": roleID = 4;
                break;
            case "Account Manager": roleID = 5;
                break;
            case "Accountant": roleID = 6;
                break;
            case "Legal Team Lead": roleID = 7;
                break;
            case "Attorney": roleID = 8;
                break;
            default:
                break;
        }
        switch (response.whichManager) {
            case "Jane": managerID = 1;
                break;
            case "James": managerID = 2;
                break;
            case "Miguel": managerID = 3;
                break;
            case "Morgan": managerID = 4;
                break;
            case "Derrick": managerID = 5;
                break;
            case "Toacin": managerID = 6;
                break;
            case "Disney": managerID = 7;
                break;
            case "Ian": managerID = 8;
                break;
            case "None":
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?, NULL);`, 
                [response.firstName, response.lastName, roleID], 
                (err, data) => {
                    if (err) throw err;
                    console.log("\n-----------------------------------------\n")
                    console.log("New employee has been successfully added!")
                    console.log("\n-----------------------------------------\n")
                    askInit();
                })
                askInit();
                return;
            default:
                break;
        }
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`, 
        [response.firstName, response.lastName, roleID, managerID], 
        (err, data) => {
            if (err) throw err;
            console.log("\n-----------------------------------------\n")
            console.log("New employee has been successfully added!")
            console.log("\n-----------------------------------------\n")
            askInit();
        })
    })
};

let updateEmployee = () => {
    inquirer.prompt(updateEmployeeQuestion)
    .then((response) => {
        let roleID;
        let employeeID;
        switch (response.newRole) {
            case "Sales Lead": roleID = 1;
                break;
            case "Salesperson": roleID = 2;
                break;
            case "Lead Engineer": roleID = 3;
                break;
            case "Software Engineer": roleID = 4;
                break;
            case "Account Manager": roleID = 5;
                break;
            case "Accountant": roleID = 6;
                break;
            case "Legal Team Lead": roleID = 7;
                break;
            case "Attorney": roleID = 8;
                break;
            default:
                break;
        }
        switch (response.employeeName) {
            case "Jane": employeeID = 1;
                break;
            case "James": employeeID = 2;
                break;
            case "Miguel": employeeID = 3;
                break;
            case "Morgan": employeeID = 4;
                break;
            case "Derrick": employeeID = 5;
                break;
            case "Toacin": employeeID = 6;
                break;
            case "Disney": employeeID = 7;
                break;
            case "Ian": employeeID = 8;
                break;
            default:
                break;
        }
        db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, 
        [roleID, employeeID], 
        (err, data) => {
            if (err) throw err;
            console.log("\n-----------------------------------------\n")
            console.log("New employee has been successfully added!")
            console.log("\n-----------------------------------------\n")
            askInit();
        })
    })
};