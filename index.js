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
        choices: []
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
        choices: []
    },
    {
        type: "list",
        name: "whichManager",
        message: "Who is the manager of the current employee?",
        choices: []
    }
]

let updateEmployeeQuestion = [
    {
        type: "list",
        name: "employeeName",
        message: "What is the name of the employee who's role you'd like to update?",
        choices: []
    },
    {
        type: "list",
        name: "newRole",
        message: "What is the new role of this employee?",
        choices: []
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
    db.query("SELECT * FROM department;", (err, data) => {
        whatRole[2].choices = data.map((element) => ({value: element.id, name: element.name}));
        inquirer.prompt(whatRole)
        .then((response) => {
            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?);`, 
            [response.roleName, response.salary, response.whichDepart], 
            (err, data) => {
                console.log("\n-----------------------------------------\n")
                console.log("New role has been successfully added!")
                console.log("\n-----------------------------------------\n")
                askInit();
            })
        })
    })
};

let addEmployee = () => {
    db.query("SELECT * FROM role;", (err, data) => {
        whatEmployee[2].choices = data.map((element) => ({value: element.id, name: element.title}))
        db.query("SELECT * FROM employee;", (err, data) => {
            whatEmployee[3].choices = data.map((element) => ({value: element.id, name: element.first_name+" "+element.last_name}));
            whatEmployee[3].choices.push({value: null, name: "None"});
            inquirer.prompt(whatEmployee)
            .then((response) => {
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`, 
                [response.firstName, response.lastName, response.role, response.whichManager], 
                (err, data) => {
                    if (err) throw err;
                    console.log("\n-----------------------------------------\n")
                    console.log("New employee has been successfully added!")
                    console.log("\n-----------------------------------------\n")
                    askInit();
                })
            })
        })
    })
};

let updateEmployee = () => {
    db.query("SELECT * FROM employee;", (err, data) => {
        updateEmployeeQuestion[0].choices = data.map((element) => ({value: element.id, name: element.first_name+" "+element.last_name}));
        db.query("SELECT * FROM role;", (err, data) => {
            updateEmployeeQuestion[1].choices = data.map((element) => ({value: element.id, name: element.title}))
            inquirer.prompt(updateEmployeeQuestion)
            .then((response) => {
                db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, 
                [response.newRole, response.employeeName], 
                (err, data) => {
                    if (err) throw err;
                    console.log("\n-----------------------------------------\n")
                    console.log("New employee has been successfully added!")
                    console.log("\n-----------------------------------------\n")
                    askInit();
                })
            })
        })
    })
};